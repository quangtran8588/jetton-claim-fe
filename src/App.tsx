import { useState } from "react";
import { ConnectedWallet } from "@tonconnect/ui-react";
import { OpenedContract } from "@ton/core";

import { JettonWalletV2 } from "./contracts/JettonWallet-v2";
import { JettonMinterV2 } from "./contracts/JettonMinter-v2";
import { AppContext } from "./hooks/uesAppContext";
import Navbar from "./components/Navbar";
import Claim from "./components/Claim";
import { JettonMinterData } from "./hooks/useJettonMinter";
import { JettonWalletData } from "./hooks/useJettonWallet";

export default function App() {
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null);
  const [jettonWallet, setJettonWallet] =
    useState<OpenedContract<JettonWalletV2> | null>(null);
  const [jettonMinter, setJettonMinter] =
    useState<OpenedContract<JettonMinterV2> | null>(null);
  const [jettonMinterData, setJettonMinterData] =
    useState<JettonMinterData | null>(null);
  const [jettonWalletData, setJettonWalletData] =
    useState<JettonWalletData | null>(null);

  const context = {
    wallet: wallet,
    jettonWallet: jettonWallet,
    jettonMinter: jettonMinter,
    jettonMinterData: jettonMinterData,
    jettonWalletData: jettonWalletData,

    setWallet: setWallet,
    setJettonWallet: setJettonWallet,
    setJettonMinter: setJettonMinter,
    setJettonMinterData: setJettonMinterData,
    setJettonWalletData: setJettonWalletData,
  };

  return (
    <AppContext.Provider value={context}>
      <Navbar />
      <Claim />
    </AppContext.Provider>
  );
}
