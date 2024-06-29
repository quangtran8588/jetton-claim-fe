import { Address, OpenedContract, toNano } from "@ton/core";

import { JettonMinterV2, MintTokenV2Req } from "../contracts/JettonMinter-v2";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";

export function useJettonMinter() {
  const client = useTonClient();
  const sender = useTonConnect();

  const minter = useAsyncInitialize(async () => {
    if (!client) return;

    const minterAddress: Address = Address.parse(
      "EQCjww8EMxKm4dS14NKdV53CB2HBr0EWrBPDvH7XY2_IUDWT"
    );
    const minter: OpenedContract<JettonMinterV2> = client.open(
      JettonMinterV2.createFromAddress(minterAddress)
    ) as OpenedContract<JettonMinterV2>;

    return minter;
  }, [client]);

  return {
    sendMintToken: (req: MintTokenV2Req) => {
      return minter?.sendMintToken(sender.sender, toNano(0.06), req);
    },
  };
}
