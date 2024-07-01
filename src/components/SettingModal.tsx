/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import InputData from "./InputData";
import { IoMdSettings } from "react-icons/io";

interface Props {
  action: string;
  isDisabled: boolean;
}

export default function SettingModal({ action, isDisabled }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const title: string =
    action === "set-admin"
      ? "Change New Admin"
      : action === "set-amount"
      ? "Change Amount per Claim"
      : action === "set-cooldown"
      ? "Change Cooldown Time"
      : "error";
  if (title === "error") throw new Error("Error: Invalid action request");

  return (
    <Box>
      <IconButton
        size="sm"
        variant="ghost"
        colorScheme="white"
        aria-label={title}
        icon={<IoMdSettings />}
        onClick={onOpen}
        isDisabled={isDisabled}
      />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        colorScheme="blackAlpha"
        isCentered={true}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="#000">{title}</ModalHeader>
          <ModalCloseButton size="xs" />
          <ModalBody>
            <InputData action={action} onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
