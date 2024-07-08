/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { Address, OpenedContract, toNano } from "@ton/core";
import { isEqual } from "lodash";

import { JettonMinterV2, MintTokenV2Req } from "../contracts/JettonMinter-v2";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { useAppContext } from "./uesAppContext";

export type JettonMinterData = {
  admin: Address;
  totalSupply: bigint;
  fixedAmount: bigint;
  cooldown: bigint;
};

export function useJettonMinter() {
  const client = useTonClient();
  const sender = useTonConnect();
  const {
    jettonMinter,
    setJettonMinter,
    jettonMinterData,
    setJettonMinterData,
  } = useAppContext();

  useEffect(() => {
    if (!client || jettonMinter) return;

    const minterAddress: Address = Address.parse(
      import.meta.env.VITE_TON_CLAIMABLE_TOKEN_ADDR
    );
    const minter: OpenedContract<JettonMinterV2> = client.open(
      JettonMinterV2.createFromAddress(minterAddress)
    ) as OpenedContract<JettonMinterV2>;

    setJettonMinter(minter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, jettonMinter]);

  useEffect(() => {
    async function getValue() {
      if (!jettonMinter) return;

      const query: JettonMinterData =
        await jettonMinter.getJettonMinterFullData();

      if (!isEqual(query, jettonMinterData)) setJettonMinterData(query);
    }

    getValue();
    const intervalId = setInterval(getValue, 10000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jettonMinter]);

  return {
    sendMintToken: (req: MintTokenV2Req) => {
      return jettonMinter?.sendMintToken(sender.sender, toNano(0.08), req);
    },
    sendChangeAdmin: (admin: Address) => {
      return jettonMinter?.sendChangeAdmin(sender.sender, toNano(0.01), admin);
    },
    sendSetFixedAmount: (amount: bigint) => {
      return jettonMinter?.sendSetFixedAmount(
        sender.sender,
        toNano(0.01),
        amount
      );
    },
    sendSetCooldown: (cdTime: bigint) => {
      return jettonMinter?.sendSetCooldown(sender.sender, toNano(0.01), cdTime);
    },
    getWalletAddress: (owner: Address) => {
      return jettonMinter?.getJettonWalletAddress(owner);
    },
  };
}
