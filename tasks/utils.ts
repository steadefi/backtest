import { task, subtask, types } from "hardhat/config";
import getRevertReason from "eth-revert-reason";
import { ethers } from "ethers";

task("mineBlock", "manual mine blocks")
  .addPositionalParam("blocks", "number of blocks to mine", 1, types.int)
  .setAction(async ({ blocks }, { network }) => {
    await network.provider.send("hardhat_mine", [ethers.utils.hexValue(blocks)]);
  });

subtask("resetNetwork", "start forking network")
  .addParam("params", "params of hardhat_resets", [], types.any)
  .setAction(async (args, { network }) => {
    return network.provider.request({
      method: "hardhat_reset",
      params: args.params,
    });
  });

subtask("setNextBlockTimestamp", "set next block timestamp")
  .addParam("timestamp", "unix timestamp", [], types.int)
  .setAction(async ({ timestamp }, { network, run }) => {
    await network.provider.request({
      method: "evm_setNextBlockTimestamp",
      params: [timestamp], // in seconds
    });
  });

task("increaseTime", "fastforward block timestamp")
  .addParam("seconds", "number of seconds", undefined, types.int)
  .setAction(async ({ seconds }, { network, run }) => {
    await network.provider.request({
      method: "evm_increaseTime",
      params: [seconds],
    });
    return run("mineBlock", { blocks: 1 });
  });

task("getRevertReason", "eth-revert-reason")
  .addPositionalParam("txhash", "transation hash", undefined, types.string)
  .addOptionalParam("block", "block number", undefined, types.int)
  .setAction(async (args, _) => {
    console.log("txHash", args.txhash);
    if (args.block) console.log(await getRevertReason(args.txhash, "rinkeby", args.block));
    else console.log(await getRevertReason(args.txhash, "rinkeby"));
  });
