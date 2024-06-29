import { Box, Button } from "@chakra-ui/react";
import { Address, beginCell, toNano } from "@ton/core";

import { useTonConnect } from "../hooks/useTonConnect";
import { useJettonMinter } from "../hooks/useJettonMinter";
import { MintTokenV2Req } from "../contracts/JettonMinter-v2";

export default function Claim() {
  const { sendMintToken } = useJettonMinter();
  const { connected, account } = useTonConnect();

  const forwardPayload = beginCell()
    .storeUint(0, 32) // 0 opcode means we have a comment
    .storeStringTail("Hello, Mint Testing Token")
    .endCell();

  let mintReq: MintTokenV2Req;
  if (account) {
    const addr = Address.parse(account.address as string);

    const cdTime = BigInt(2 * 60);
    const jettonAmt = toNano("100");
    mintReq = {
      to: addr,
      amount: toNano("0.1"), //  forward Toncoin amount to Jetton Wallet
      masterMsg: beginCell()
        .storeUint(0x178d4519, 32) // op::internal_transfer
        .storeUint(0, 64) // query_id
        .storeCoins(jettonAmt) //  jetton amount
        .storeUint(cdTime, 64)
        .storeAddress(addr) //  from_address
        .storeAddress(addr)
        .storeBit(0) //  no custom payload
        .storeCoins(toNano("0.01")) //  forward Toncoin amount for forward_payload
        .storeBit(1) // store forward_payload as a reference
        .storeRef(forwardPayload)
        .endCell(),
    };
  }

  return (
    <Box
      width="100dvw"
      height="100dvh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Button
        size="sm"
        onClick={() => sendMintToken(mintReq)}
        isDisabled={connected ? false : true}
      >
        Claim
      </Button>
    </Box>
  );
}
