import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient } from "@ton/ton";

import { useAsyncInitialize } from "./useAsyncInitialize";

export function useTonClient() {
  // const client = new TonClient({
  //   endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
  // });
  // return client;
  return useAsyncInitialize(
    async () =>
      new TonClient({
        endpoint: await getHttpEndpoint({ network: "testnet" }),
      })
  );
}
