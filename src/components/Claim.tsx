import {
  Text,
  Button,
  Link,
  Grid,
  GridItem,
  VStack,
  Box,
  HStack,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Address, beginCell, fromNano, toNano } from "@ton/core";
import { isEqual } from "lodash";

import Logo from "./Logo";
import SettingModal from "./SettingModal";
import { useTonConnect } from "../hooks/useTonConnect";
import { useJettonMinter } from "../hooks/useJettonMinter";
import { MintTokenV2Req } from "../contracts/JettonMinter-v2";

function selfClaimReq(
  addr: Address,
  jettonAmount: bigint,
  cdTime: bigint,
  forwardMsg: string
): MintTokenV2Req {
  const forwardPayload = beginCell()
    .storeUint(0, 32) // 0 opcode means we have a comment
    .storeStringTail(forwardMsg)
    .endCell();

  const mintReq: MintTokenV2Req = {
    to: addr,
    amount: toNano("0.05"), //  forward Toncoin amount to Jetton Wallet
    masterMsg: beginCell()
      .storeUint(0x178d4519, 32) // op::internal_transfer
      .storeUint(0, 64) // query_id
      .storeCoins(jettonAmount) //  jetton amount
      .storeUint(cdTime, 64)
      .storeAddress(addr) //  from_address
      .storeAddress(addr)
      .storeBit(0) //  no custom payload
      .storeCoins(toNano("0.01")) //  forward Toncoin amount for forward_payload
      .storeBit(1) // store forward_payload as a reference
      .storeRef(forwardPayload)
      .endCell(),
  };

  return mintReq;
}

export default function Claim() {
  const { data, sendMintToken } = useJettonMinter();
  const { connected, account } = useTonConnect();

  let mintReq: MintTokenV2Req;
  if (account && data) {
    const addr = Address.parse(account.address as string);
    mintReq = selfClaimReq(
      addr,
      data.fixedAmount,
      data.cooldown,
      `Mint ${data.fixedAmount} tokens`
    );
  }

  let contract = import.meta.env.VITE_TON_CLAIMABLE_TOKEN_ADDR as string;
  const explorer = import.meta.env.VITE_TON_EXPLORER as string;
  const contractLink: string = explorer + contract;
  contract = contract.slice(0, 20) + "..." + contract.slice(-5);

  let admin: string = "";
  let adminLink: string = "";
  if (data) {
    admin = data.admin.toString();
    adminLink = explorer + admin;
    admin = admin.slice(0, 20) + "..." + admin.slice(-5);
  }
  const isAdmin = isEqual(
    data?.admin.toRawString(),
    account?.address as string
  );

  return (
    <Box w="100dvw" h="100dvh" display="flex" justifyContent="center">
      <VStack w={{ base: "80%", lg: "60%" }} h="100%">
        <Text color="#00FF00" fontSize={{ base: "x-large" }}>
          Free Claim
        </Text>
        <Box mt={5} mb={1}>
          <Logo
            width={{ base: "450", lg: "600px" }}
            height={{ base: "150", lg: "200px" }}
          />
        </Box>

        <Text fontSize={{ base: "sm" }}>
          Contract:{" "}
          <Link
            href={contractLink}
            isExternal
            color="#FFFF00"
            fontSize={{ base: "md" }}
          >
            {contract} <ExternalLinkIcon mx="2px" />
          </Link>
        </Text>

        <Box
          w={{ base: "100%", sm: "70%", md: "50%", xl: "40%" }}
          h={{ base: "180px" }}
          mb={6}
        >
          <Grid
            w="100%"
            h="100%"
            templateRows="repeat(3, 1fr)"
            templateColumns="repeat(2, 1fr)"
            gap={1}
          >
            <GridItem
              rowSpan={1}
              colSpan={2}
              bgGradient="linear(to-l, gray.900, green.900, black)"
              border="2px solid"
              borderColor="green.900"
              borderStyle="double"
              borderRadius="10px"
            >
              <VStack>
                <HStack gap={0}>
                  <Text fontSize={{ base: "xs" }} color="#00FFFF">
                    Contract Admin
                  </Text>
                  <SettingModal
                    action="set-admin"
                    isDisabled={isAdmin ? false : true}
                  />
                </HStack>

                <Link
                  href={`${adminLink}`}
                  isExternal
                  fontSize={{ base: "sm" }}
                >
                  {admin} <ExternalLinkIcon mx="2px" />
                </Link>
              </VStack>
            </GridItem>

            <GridItem
              rowSpan={1}
              colSpan={1}
              bgGradient="linear(to-l, gray.900, green.900, black)"
              border="2px solid"
              borderColor="green.900"
              borderStyle="double"
              borderRadius="10px"
            >
              <VStack>
                <HStack gap={0}>
                  <Text fontSize={{ base: "xs" }} color="#00FFFF">
                    Claim Amount
                  </Text>
                  <SettingModal
                    action="set-amount"
                    isDisabled={isAdmin ? false : true}
                  />
                </HStack>

                <Text fontSize={{ base: "sm" }}>{`${fromNano(
                  data ? data.fixedAmount : 0
                )}`}</Text>
              </VStack>
            </GridItem>

            <GridItem
              rowSpan={1}
              colSpan={1}
              bgGradient="linear(to-l, gray.900, green.900, black)"
              border="2px solid"
              borderColor="green.900"
              borderStyle="double"
              borderRadius="10px"
            >
              <VStack>
                <HStack gap={0}>
                  <Text fontSize={{ base: "xs" }} color="#00FFFF">
                    Cooldown
                  </Text>
                  <SettingModal
                    action="set-cooldown"
                    isDisabled={isAdmin ? false : true}
                  />
                </HStack>
                <Text fontSize={{ base: "sm" }}>
                  {`${data ? data.cooldown : 0}`}s
                </Text>
              </VStack>
            </GridItem>

            <GridItem
              rowSpan={1}
              colSpan={2}
              bgGradient="linear(to-l, gray.900, green.900, black)"
              border="2px solid"
              borderColor="green.900"
              borderStyle="double"
              borderRadius="10px"
            >
              <VStack display="flex" justifyContent="space-around">
                <Text fontSize={{ base: "xs" }} color="#00FFFF">
                  Total Supply
                </Text>
                <Text fontSize={{ base: "sm" }}>{`${fromNano(
                  data ? data.totalSupply : 0
                )}`}</Text>
              </VStack>
            </GridItem>
          </Grid>
        </Box>

        <Button
          size={{ base: "sm" }}
          onClick={() => sendMintToken(mintReq)}
          isDisabled={connected ? false : true}
        >
          Claim
        </Button>
      </VStack>
    </Box>
  );
}
