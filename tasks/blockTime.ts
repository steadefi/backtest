import { subtask, task, types } from "hardhat/config";
import { getDuration, ExternalDependency, formatDuration, resolveExternalDependency } from "../utils";
import moment from "moment";
import "colors";
import dateFormat from "dateformat";
import "./string.extension";

task("getCurrentBlock", "get current block no. for connected network").setAction(async (args, { ethers, network }) => {
  const currentBlock = await ethers.provider.getBlockNumber();
  console.log(currentBlock);
});

task("getBlockDiff", "get the date n blocks from now")
  .addPositionalParam("offset", "block offset", undefined, types.int)
  .setAction(async ({ offset }, { ethers, network }) => {
    const dep = resolveExternalDependency(network);
    const currentBlock = await ethers.provider.getBlockNumber();
    const toBlock = currentBlock + offset;
    const duration = getDurationByBlocks(dep, offset);
    const d = moment().add(duration);

    console.log("current Block:".padEnd(15).grey, currentBlock);
    console.log("target Block:".padEnd(15).grey, toBlock);
    console.log("duration:".padEnd(15).grey, formatDuration(duration));
    console.log("Date:".padEnd(15).grey, dateFormat(d.toDate(), "yyyy-mm-dd HH:MM:ss Z").magenta);
  });

task("getBlockDate", "get block timestamp using block no.")
  .addPositionalParam("blockNo", "block number", undefined, types.int)
  .setAction(async ({ blockNo }, { ethers }) => {
    const block = await ethers.provider.getBlock(`0x${blockNo.toString(16)}`);
    if (block) {
      const dt = new Date(block.timestamp * 1000);
      console.log(dt.toString(), dt.toISOString());
    }
  });

task("getDateByBlockNo", "get the date n blocks from now")
  .addPositionalParam("blockNo", "block number", undefined, types.int)
  .setAction(async ({ blockNo }, { ethers, network }) => {
    const dep = resolveExternalDependency(network);
    const currentBlock = await ethers.provider.getBlockNumber();
    const diff = blockNo - currentBlock;
    const duration = getDurationByBlocks(dep, diff);
    const d = moment().add(duration);
    console.log("currentBlock:".padEnd(15).grey, currentBlock);
    console.log("blocks diff:".padEnd(15).grey, diff);
    console.log("duration:".padEnd(15).grey, formatDuration(duration));
    console.log("Date:".padEnd(15).grey, d);
  });

task("getBlockNoByDate", "get block no. for a particular date")
  .addPositionalParam("date", "date string (e.g. 2021-01-01T08:00)", undefined, types.string)
  .setAction(async ({ date }, { run, network }) => {
    const dep = resolveExternalDependency(network);
    const [blockTag, blockTime] = await run("getBlockNoSubTask", { date });
    console.log(blockTag, blockTime);
  });

subtask("getBlockNoSubTask", "get block no. for a particular date")
  .addPositionalParam("date", "date string (e.g. 2021-01-01T08:00)", undefined, types.string)
  .setAction(async ({ date, maxError }, { ethers, network }) => {
    const dep = resolveExternalDependency(network);
    const currentBlock = (await ethers.provider.getBlockNumber()) - 10;
    const targetDt = new Date(date);
    const guesses = new Set<number>();

    // console.log("currentBlock", currentBlock);

    // use network default as a start for block time
    let blockTime = dep.blockTime;

    let block = await ethers.provider.getBlock(`0x${currentBlock.toString(16)}`);
    if (!block) throw new Error(`Failed to get block '${currentBlock}'`);

    let lastBlockNo = currentBlock;
    let lastBlockTimeStamp = new Date(block.timestamp * 1000);

    let duration = getDuration(lastBlockTimeStamp, targetDt);
    let blocks = parseInt(getBlocksByDuration(dep, duration).toString());

    let targetBlockNo = lastBlockNo + blocks;

    guesses.add(targetBlockNo);
    // console.log("Tgt block no:", targetBlockNo);
    block = await ethers.provider.getBlock(`0x${targetBlockNo.toString(16)}`);
    let targetTimeStamp: Date;

    while (true) {
      targetTimeStamp = new Date(block.timestamp * 1000);
      // update blocktime using observed average
      const actualDuration = getDuration(lastBlockTimeStamp, targetTimeStamp);
      // console.log(targetBlockNo, targetTimeStamp.toISOString().magenta);
      const error = Math.abs((targetTimeStamp.valueOf() - targetDt.valueOf()) / 1000);
      // console.log("error", error);
      if (error < 1 || blockTime == 0 || targetBlockNo == lastBlockNo || Math.abs(targetBlockNo - lastBlockNo) == 1)
        break;

      lastBlockNo = targetBlockNo;
      lastBlockTimeStamp = targetTimeStamp;

      // console.log("actual duration:", formatDuration(actualDuration));
      blockTime = actualDuration.asSeconds() / blocks;
      // console.log("avgBlockTime", blockTime);

      // new guess
      duration = getDuration(lastBlockTimeStamp, targetDt);
      blocks = blockTime > 0 ? parseInt(getBlocksByDurationAndBlockTime(blockTime, duration).toString()) : 0;
      targetBlockNo = lastBlockNo + blocks;

      // if we ever go back to the same guess more than once, then exit
      if (guesses.has(targetBlockNo)) break;
      guesses.add(targetBlockNo);

      // console.log("lastBlockNo", lastBlockNo);
      // console.log("targetBlockNo", targetBlockNo);
      // console.log("blocks", blocks);

      block = await ethers.provider.getBlock(`0x${targetBlockNo.toString(16)}`);
      if (!block) throw new Error(`Failed to get block '${targetBlockNo}'`);
    }

    // Final adjustment in case the avg block time is not consistent
    // Step UP
    let nextBlockTimeStamp = new Date(
      (await ethers.provider.getBlock(`0x${(targetBlockNo + 1).toString(16)}`)).timestamp * 1000
    );
    let bIsImprovement =
      Math.abs(targetDt.getTime() - nextBlockTimeStamp.getTime()) <
      Math.abs(targetDt.getTime() - targetTimeStamp.getTime());
    while (bIsImprovement) {
      targetBlockNo += 1;
      targetTimeStamp = nextBlockTimeStamp;
      // console.log(targetBlockNo, targetTimeStamp);
      nextBlockTimeStamp = new Date(
        (await ethers.provider.getBlock(`0x${(targetBlockNo + 1).toString(16)}`)).timestamp * 1000
      );
      bIsImprovement =
        Math.abs(targetDt.getTime() - nextBlockTimeStamp.getTime()) <
        Math.abs(targetDt.getTime() - targetTimeStamp.getTime());
    }

    // Step DOWN
    let prevBlockTimeStamp = new Date(
      (await ethers.provider.getBlock(`0x${(targetBlockNo - 1).toString(16)}`)).timestamp * 1000
    );
    bIsImprovement =
      Math.abs(targetDt.getTime() - prevBlockTimeStamp.getTime()) <
      Math.abs(targetDt.getTime() - targetTimeStamp.getTime());
    while (bIsImprovement) {
      targetBlockNo -= 1;
      targetTimeStamp = prevBlockTimeStamp;
      // console.log(targetBlockNo, targetTimeStamp);
      prevBlockTimeStamp = new Date(
        (await ethers.provider.getBlock(`0x${(targetBlockNo - 1).toString(16)}`)).timestamp * 1000
      );
      bIsImprovement =
        Math.abs(targetDt.getTime() - prevBlockTimeStamp.getTime()) <
        Math.abs(targetDt.getTime() - targetTimeStamp.getTime());
    }

    // console.log(targetBlockNo, dateFormat(dt, "yyyy-mm-dd HH:MM:ss Z").magenta);
    return [targetBlockNo, targetTimeStamp];
  });

export function getBlocksByDuration(dep: ExternalDependency, d: moment.Duration): number {
  return d.asSeconds() / dep.blockTime;
}

export function getBlocksByDurationAndBlockTime(blockTimeInSecs: number, d: moment.Duration): number {
  return d.asSeconds() / blockTimeInSecs;
}

export function getDurationByBlocks(dep: ExternalDependency, numBlocks: number): moment.Duration {
  return moment.duration(numBlocks * dep.blockTime, "s");
}
