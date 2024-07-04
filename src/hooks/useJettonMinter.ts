/* eslint-disable @typescript-eslint/no-explicit-any */
import { Address, OpenedContract, toNano } from "@ton/core";

import { JettonMinterV2, MintTokenV2Req } from "../contracts/JettonMinter-v2";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { useEffect, useState } from "react";
import { isEqual } from "lodash";

type Data = {
  admin: Address;
  totalSupply: bigint;
  fixedAmount: bigint;
  cooldown: bigint;
};

export function useJettonMinter() {
  const client = useTonClient();
  const sender = useTonConnect();
  const [data, setData] = useState<Data | null>(null);

  const minter = useAsyncInitialize(async () => {
    if (!client) return;

    const minterAddress: Address = Address.parse(
      import.meta.env.VITE_TON_CLAIMABLE_TOKEN_ADDR
    );
    const minter: OpenedContract<JettonMinterV2> = client.open(
      JettonMinterV2.createFromAddress(minterAddress)
    ) as OpenedContract<JettonMinterV2>;

    return minter;
  }, [client]);

  useEffect(() => {
    let intervalId: any;

    async function getValue() {
      if (!minter) return;

      const query: Data = await minter.getJettonMinterFullData();

      if (!isEqual(query, data)) setData(query);
    }

    if (minter) {
      getValue();
      intervalId = setInterval(getValue, 10000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [minter, data]);

  return {
    data: data,
    sendMintToken: (req: MintTokenV2Req) => {
      return minter?.sendMintToken(sender.sender, toNano(0.08), req);
    },
    sendChangeAdmin: (admin: Address) => {
      return minter?.sendChangeAdmin(sender.sender, toNano(0.01), admin);
    },
    sendSetFixedAmount: (amount: bigint) => {
      return minter?.sendSetFixedAmount(sender.sender, toNano(0.01), amount);
    },
    sendSetCooldown: (cdTime: bigint) => {
      return minter?.sendSetCooldown(sender.sender, toNano(0.01), cdTime);
    },
    getWalletAddress: (owner: Address) => {
      return minter?.getJettonWalletAddress(owner);
    },
  };
}
