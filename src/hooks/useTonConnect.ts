import {
  Account,
  ConnectedWallet,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import { useEffect, useState } from "react";
import { Sender, SenderArguments } from "@ton/core";

export function useTonConnect(): {
  sender: Sender;
  account: Account | null;
  connected: boolean;
} {
  const [tonConnectUI] = useTonConnectUI();
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null);

  useEffect(
    () =>
      tonConnectUI.onStatusChange((wallet: ConnectedWallet | null) =>
        setWallet(wallet)
      ),
    [tonConnectUI]
  );

  return {
    sender: {
      send: async (args: SenderArguments) => {
        tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString("base64"),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
      },
    },
    account: wallet ? wallet.account : null,
    connected: wallet ? true : false,
  };
}
