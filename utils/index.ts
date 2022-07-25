import { BigNumber, utils } from "ethers";
import { elapsed } from "./timeFormat";
import { ethers, ContractTransaction, ContractReceipt } from "ethers";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const ZERO_BYTES32 = "0x0000000000000000000000000000000000000000000000000000000000000000";

export const MAX_UINT256 = BigNumber.from("2").pow(BigNumber.from("256")).sub(BigNumber.from("1"));
export const MAX_INT256 = BigNumber.from("2").pow(BigNumber.from("255")).sub(BigNumber.from("1"));
export const MIN_INT256 = BigNumber.from("2").pow(BigNumber.from("255")).mul(BigNumber.from("-1"));
export const BIG_ZERO = BigNumber.from("0");
export const BIG_ONE = utils.parseEther("1");
export const INDENT = "  ";
export const INDENT2 = "    ";
export const ERROR_MESSAGE_PREFIX = "VM Exception while processing transaction";
export const UNSAFE_SWEEP_ERROR_MESSAGE = "!safe"; // TODO: Sushi uses "!s" instead. Change later
export * from "./externalDependency";
export * from "./timeFormat";
export * from "./typeguards";
export * from "./jsonFormatter";

interface contractExecution {
  (): Promise<ContractTransaction>;
}

export async function send(f: any, details: boolean, ...logs: any[]): Promise<ContractReceipt> {
  const start = Date.now();
  let tx: ContractReceipt = await (await f()).wait();
  let effectiveGasPrice = tx.effectiveGasPrice || ethers.BigNumber.from(0);
  if (details)
    console.log(
      ...logs,
      elapsed(start),
      tx.gasUsed.toString().cyan,
      "gas".grey,
      ethers.utils.formatUnits(effectiveGasPrice, 9).cyan,
      "gwei".grey,
      ethers.utils.formatEther(tx.gasUsed.mul(effectiveGasPrice)).cyan,
      "ETH".grey,
      tx.transactionHash.magenta
    );
  else console.log(...logs, elapsed(start));

  return tx;
}

export interface EmittedEvent {
  readonly [key: string]: any;
}

export async function sendAndDecodeEvents(
  f: contractExecution,
  eventInterfaces: Map<string, string>,
  outMap: Map<string, EmittedEvent>
): Promise<void> {
  const receipt: ContractReceipt = await (await f()).wait();
  const interfaceByTopic = new Map<string, [string, utils.Interface]>();

  eventInterfaces.forEach((value: string, key: string) => {
    const _interface = new ethers.utils.Interface([value]);
    const _topic = _interface.getEventTopic(key);
    interfaceByTopic.set(_topic, [key, _interface]);
  });

  for (let log of receipt.logs) {
    const _interface = interfaceByTopic.get(log.topics[0]);
    if (_interface) {
      outMap.set(_interface[0], _interface[1].decodeEventLog(log.topics[0], log.data, log.topics));
    }
  }
  return;
}
