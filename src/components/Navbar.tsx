import { Box, Flex } from "@chakra-ui/react";
import { TonConnectButton } from "@tonconnect/ui-react";

export default function Navbar() {
  return (
    <Box bg="blackAlpha.900" px={4} mb="2">
      <Flex h={16} align="center" justifyContent="flex-end">
        <TonConnectButton />
      </Flex>
    </Box>
  );
}
