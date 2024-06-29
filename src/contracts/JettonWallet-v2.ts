/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
  TupleReader,
} from "@ton/core";

export type JettonWalletV2Config = {};

export type JettonWalletV2Transfer = {
  amount: bigint;
  toAddress: Address;
  responseAddress: Address;
  customPayload?: any;
  forwardTonAmount: bigint;
  forwardPayload: Cell;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function jettonWalletConfigToCell(config: JettonWalletV2Config): Cell {
  config;
  return beginCell().endCell();
}

export class JettonWalletV2 implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromAddress(address: Address) {
    return new JettonWalletV2(address);
  }

  static createFromConfig(
    config: JettonWalletV2Config,
    code: Cell,
    workchain = 0
  ) {
    const data = jettonWalletConfigToCell(config);
    const init = { code, data };
    return new JettonWalletV2(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, sender: Sender, value: bigint) {
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendTransfer(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,
    req: JettonWalletV2Transfer
  ) {
    const msgBody = beginCell()
      .storeUint(0x0f8a7ea5, 32) // opcode for jetton transfer
      .storeUint(0, 64) // query id
      .storeCoins(req.amount) // jetton amount, amount * 10^9
      .storeAddress(req.toAddress)
      .storeAddress(req.responseAddress) // response destination
      .storeBit(0) // no custom payload
      .storeCoins(req.forwardTonAmount) // forward amount - if > 0, will send notification message
      .storeBit(1) // we store forwardPayload as a reference
      .storeRef(req.forwardPayload)
      .endCell();

    await provider.internal(sender, {
      value: value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msgBody,
    });
  }

  async getLastClaim(provider: ContractProvider) {
    const result: TupleReader = (await provider.get("get_last_claim", []))
      .stack;
    return result.readBigNumber();
  }

  async getWalletData(provider: ContractProvider) {
    const result: TupleReader = (await provider.get("get_wallet_data", []))
      .stack;
    const balance = result.readBigNumber();
    const owner = result.readAddress();
    result.readAddress(); // jetton_minter_address
    result.readCell(); // jetton_wallet_code

    return {
      owner: owner,
      balance: balance,
    };
  }
}
