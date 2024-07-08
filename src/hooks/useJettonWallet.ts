/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { Address, OpenedContract, toNano } from "@ton/core";
import { isEqual } from "lodash";

import {
  JettonWalletV2,
  JettonWalletV2Transfer,
} from "../contracts/JettonWallet-v2";
import { useTonClient } from "./useTonClient";
import { useJettonMinter } from "./useJettonMinter";
import { useAppContext } from "./uesAppContext";
import { useTonConnect } from "./useTonConnect";

export type JettonWalletData = {
  owner: Address;
  balance: bigint;
};

export function useJettonWallet() {
  const client = useTonClient();
  const sender = useTonConnect();
  const {
    wallet,
    jettonWallet,
    setJettonWallet,
    jettonWalletData,
    setJettonWalletData,
  } = useAppContext();
  const { getWalletAddress } = useJettonMinter();

  useEffect(() => {
    if (!client || !wallet) return;

    async function setJettonWalletAddress() {
      const jwAddress: Address = (await getWalletAddress(
        Address.parse(wallet?.account.address as string)
      )) as Address;

      const jw: OpenedContract<JettonWalletV2> = client?.open(
        JettonWalletV2.createFromAddress(jwAddress)
      ) as OpenedContract<JettonWalletV2>;
      if (!isEqual(jettonWallet, jw)) setJettonWallet(jw);
    }

    setJettonWalletAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, wallet]);

  useEffect(() => {
    if (!jettonWallet) return;

    async function getJettonWalletData() {
      if (!jettonWallet) return;

      let query: JettonWalletData = {
        owner: Address.parse(wallet?.account.address as string),
        balance: BigInt(0),
      };

      try {
        query = await jettonWallet.getWalletData();
      } catch (e) {
        // There's a case that Jetton Wallet not yet initialized
        // thus, getWalletData() will throw error
        // In such case, leave the default value which is
        // owner = connected_account and balance = 0
      }
      if (!isEqual(query, jettonWalletData)) setJettonWalletData(query);
    }

    getJettonWalletData();
    const intervalId = setInterval(getJettonWalletData, 10000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jettonWallet]);

  return {
    sendTransfer: (value: string, req: JettonWalletV2Transfer) => {
      return jettonWallet?.sendTransfer(sender.sender, toNano(value), req);
    },
  };
}
