/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Address, OpenedContract } from "@ton/core";
import { isEqual } from "lodash";

import { JettonWalletV2 } from "../contracts/JettonWallet-v2";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";

type Data = {
  owner: Address;
  balance: bigint;
};

interface Props {
  jettonWalletAddr: Address;
}

export function useJettonWallet({ jettonWalletAddr }: Props) {
  const client = useTonClient();
  // const sender = useTonConnect();
  const [data, setData] = useState<Data | null>(null);

  const wallet = useAsyncInitialize(async () => {
    if (!client || !jettonWalletAddr) return;

    const wallet: OpenedContract<JettonWalletV2> = client.open(
      JettonWalletV2.createFromAddress(jettonWalletAddr)
    ) as OpenedContract<JettonWalletV2>;

    return wallet;
  }, [client]);

  useEffect(() => {
    let intervalId: any;

    async function getWalletData() {
      if (!wallet) return;

      const query: Data = await wallet.getWalletData();

      if (!isEqual(query, data)) {
        setData(query);
      }
    }

    if (wallet) {
      getWalletData();
      intervalId = setInterval(getWalletData, 10000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [wallet, data]);

  return {
    data: data,
  };
}
