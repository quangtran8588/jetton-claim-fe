import { Button, Center, Input, Text } from "@chakra-ui/react";
import { Address, toNano } from "@ton/core";
import { useState } from "react";

import { useJettonMinter } from "../hooks/useJettonMinter";

interface Props {
  action: string;
  onClose: () => void;
}

const adminMsg = "Enter a new Admin address";
const amountMsg = "Enter a new amount";
const cdTimeMsg = "Enter a new cooldown time";

export default function InputData({ action }: Props) {
  const [input, setInput] = useState<string>("");
  const { sendChangeAdmin, sendSetCooldown, sendSetFixedAmount } =
    useJettonMinter();

  const message: string =
    action === "set-admin"
      ? adminMsg
      : action === "set-amount"
      ? amountMsg
      : action === "set-cooldown"
      ? cdTimeMsg
      : "error";
  if (message === "error") throw new Error("Error: Invalid action request");

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInput(event.target.value);

  const handleOnClick = () => {
    if (action === "set-admin") {
      const admin: Address = Address.parse(input);
      sendChangeAdmin(admin);
    } else if (action === "set-amount") {
      const amount: bigint = toNano(input);
      sendSetFixedAmount(amount);
    } else if (action === "set-cooldown") {
      const cdTime: bigint = BigInt(input);
      sendSetCooldown(cdTime);
    }
    // onClose();
  };
  return (
    <>
      <Text mb={3} color="gray.700">
        {message}:
      </Text>
      <Input
        value={input}
        onChange={handleOnChange}
        placeholder={`${message}`}
        color="gray.700"
        mb={3}
      />
      <Center mt={3}>
        <Button size="sm" colorScheme="teal" onClick={handleOnClick}>
          Send
        </Button>
      </Center>
    </>
  );
}
