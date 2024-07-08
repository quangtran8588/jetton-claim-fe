import { ConnectedWallet, useTonConnectUI } from "@tonconnect/ui-react";
import { useEffect } from "react";
import { Sender, SenderArguments } from "@ton/core";

import { useAppContext } from "./uesAppContext";

export function useTonConnect(): {
  sender: Sender;
} {
  const [tonConnectUI] = useTonConnectUI();
  const { setWallet, setJettonWallet, setJettonWalletData } = useAppContext();

  useEffect(() => {
    tonConnectUI.onStatusChange((connectedWallet: ConnectedWallet | null) => {
      setWallet(connectedWallet);
      if (!connectedWallet) {
        setJettonWallet(null);
        setJettonWalletData(null);
      }
    });
  }, [setJettonWallet, setJettonWalletData, setWallet, tonConnectUI]);

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
  };
}
