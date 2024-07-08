import { createContext, useContext } from "react";
import { ConnectedWallet } from "@tonconnect/ui-react";
import { OpenedContract } from "@ton/core";

import { JettonMinterV2 } from "../contracts/JettonMinter-v2";
import { JettonWalletV2 } from "../contracts/JettonWallet-v2";
import { JettonMinterData } from "./useJettonMinter";
import { JettonWalletData } from "./useJettonWallet";

export interface Context {
  wallet: ConnectedWallet | null;
  jettonMinter: OpenedContract<JettonMinterV2> | null;
  jettonWallet: OpenedContract<JettonWalletV2> | null;
  jettonMinterData: JettonMinterData | null;
  jettonWalletData: JettonWalletData | null;

  setWallet: React.Dispatch<React.SetStateAction<ConnectedWallet | null>>;
  setJettonMinter: React.Dispatch<
    React.SetStateAction<OpenedContract<JettonMinterV2> | null>
  >;
  setJettonWallet: React.Dispatch<
    React.SetStateAction<OpenedContract<JettonWalletV2> | null>
  >;
  setJettonMinterData: React.Dispatch<
    React.SetStateAction<JettonMinterData | null>
  >;
  setJettonWalletData: React.Dispatch<
    React.SetStateAction<JettonWalletData | null>
  >;
}

export const AppContext = createContext<Context | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext) as Context;

  return context;
}
