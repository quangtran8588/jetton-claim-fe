/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Address, OpenedContract } from "@ton/core";
import { isEqual } from "lodash";

import { JettonWalletV2 } from "../contracts/JettonWallet-v2";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useJettonMinter } from "./useJettonMinter";
import { useTonConnect } from "./useTonConnect";

type Data = {
  owner: Address;
  balance: bigint;
};

export function useJettonWallet() {
  const client = useTonClient();
  const { getWalletAddress } = useJettonMinter();
  const { account } = useTonConnect();
  const [balance, setBalance] = useState<bigint>(BigInt(0));

  const wallet = useAsyncInitialize(async () => {
    if (!client || !account) return;

    const jettonWalletAddr: Address = (await getWalletAddress(
      Address.parse(account.address as string)
    )) as Address;
    const wallet: OpenedContract<JettonWalletV2> = client.open(
      JettonWalletV2.createFromAddress(jettonWalletAddr)
    ) as OpenedContract<JettonWalletV2>;

    return wallet;
  }, [client]);

  useEffect(() => {
    let intervalId: any;

    async function getWalletData() {
      if (!wallet) return;

      console.log(wallet.address.toString());
      let query: Data = {
        owner: Address.parse(account?.address as string),
        balance: BigInt(0),
      };

      try {
        query = await wallet.getWalletData();
        if (!isEqual(query.balance, balance)) setBalance(query.balance);
      } catch (e) {
        // There's a case that Jetton Wallet not yet initialized
        // thus, getWalletData() will throw error
        // In such case, leave the default value which is
        // owner = connected_account and balance = 0
      }
    }

    if (wallet) {
      getWalletData();
      intervalId = setInterval(getWalletData, 10000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [wallet, balance, account?.address]);

  return {
    balance: balance,
  };
}
