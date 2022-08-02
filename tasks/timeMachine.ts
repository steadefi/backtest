import { task, subtask, types } from "hardhat/config";
import { getItemFromJSON, getItemsFromJSON, getParentItemFromJSON, elapsed, resolveExternalDependency } from "../utils";
import "colors";
import dateFormat from 'dateformat';
import { BigNumber, ethers } from "ethers";

import fetch from "node-fetch";
import fs from "fs";
import "./string.extension";
import _, { keyBy } from "lodash";
import { IMultiCallService } from "./alpacaMultiCall/interfaces";
import { Multicall2Service } from "./alpacaMultiCall/multicall";
import { getDeployer } from "./alpacaMultiCall/deployer-helper";

import dates_Ftm from "./queryData/dates_TimeMachine_ftmMainnet.json";
import blocks_ftm from "./queryData/blocks_ftmMainnet.json";

import dates_Bsc from "./queryData/dates_TimeMachine_bscMainnet.json";
import blocks_bsc from "./queryData/blocks_bscMainnet.json";
import blocks_avax from "./queryData/blocks_avaxMainnet.json";

import alpaca_bsc from "./queryData/.bsc_mainnet.json";
import alpaca_ftm from "./queryData/.fantom_mainnet.json";

import { request, gql } from "graphql-request";

import { formatUnits, formatEther, parseUnits, parseEther } from "@ethersproject/units";

interface SingleFinanceRoi {
  query_ts: string;
  assumedLPToken: number;
  equityValue: number;
  totalDexYield: number;
  totalTradingfee: number;
  newTotalTradingFee: number;
  liquidity: number;
  totalVolume: number;
  volume: number;
  priceImpact: number;
  priceEffect: number;
  totalReturn: number;
  totalEquityValue: number;
  impermanentLoss: number;
  tokenPrice: number;
  quoteTokenPrice: number;
  rewardPrice: number;
  rewardTokenPerLP?: number;
  feePerDollar?: number;
}

interface SingleFinanceResponse {
  result: {
    chart: {
      roi: SingleFinanceRoi[];
    };
  };
}

interface LpRate {
  block: number;
  blockTime: string;
  nativeInterestModelImpl: string;
  nativeSupply: string;
  nativeBorrow: string;
  nativeRate: string;
  stableInterestModelImpl: string;
  stableSupply: string;
  stableBorrow: string;
  stableRate: string;
}

interface LeveragePosition {
  positionId: number;
  positionValue: string;
  debtValue: string;
  leverage: number;
}
interface Leverage {
  native: LeveragePosition[];
  stable: LeveragePosition[];
}

interface BlockTime {
  query_ts: string;
  blockNo: number;
  blockTime: string;
  localDateTime: string;
}

interface ChainLinkDep {
  [key: string]: string;
}

interface Price {
  priceHistory: { price: string | number }[];
}
interface Reserve {
  id: string;
  variableBorrowRate: string | number;
  stableBorrowRate: string | number;
  price: Price;
}
interface BorrowPayload {
  reserve: Reserve;
  utilizationRate: string;
  timestamp: number;
}

interface AavePayload {
  reserveParamsHistoryItems: BorrowPayload[];
}

const BIG_ONE = BigNumber.from(10).pow(18);

interface SingleUrls {
  [key: string]: string;
}

const dependencies = {
  bscMainnet: {
    // stable: {
    //   // USDT
    //   symbol: "USDT",
    //   address: "0x55d398326f99059ff775485246999027b3197955",
    //   vault: "0x158Da805682BdC8ee32d52833aD41E74bb951E59",
    //   decimals: 6,
    // },
    // stable: {
    //   // BUSD
    //   symbol: "BUSD",
    //   address: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    //   vault: "0x158Da805682BdC8ee32d52833aD41E74bb951E59",
    //   decimals: 6,
    // },
    stable: {
      // USDC   
      symbol: "USDC",
      address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
      vault: "0x800933D685E7Dc753758cEb77C8bd34aBF1E26d7",
      decimals: 18,
    },
    native: {
      symbol: "BNB",
      address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      vault: "0xd7D069493685A581d27824Fc46EdA46B7EfC0063",
      decimals: 18,
    },
    // native: {
    //   symbol: "CAKE",
    //   address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
    //   vault: "0xfF693450dDa65df7DD6F45B4472655A986b147Eb",
    //   decimals: 18,
    // },
    // native: {
    //   symbol: "ALPACA",
    //   address: "0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F",
    //   vault: "0xf1bE8ecC990cBcb90e166b71E368299f0116d421",
    //   decimals: 18,
    // },
    // native: {
    //   symbol: "BTCB",
    //   address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
    //   vault: "0x08FC9Ba2cAc74742177e0afC3dC8Aed6961c24e7",
    //   decimals: 18,
    // },
    // native: {
    //   symbol: "ETH",
    //   address: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
    //   vault: "0xbfF4a34A4644a113E8200D7F1D79b3555f723AfE",
    //   decimals: 18,
    // },
    blockTimes: blocks_bsc,
    single: {
      url: {
        BNB_USDT:
          "https://time-machine-api.singlefinance.io/simulate/bsc-pancakeswap-264/simulate?principal=10000&period=3&toDate={date}&type=historical",
        BNB_BUSD:
          "https://time-machine-api.singlefinance.io/simulate/bsc-pancakeswap-252/simulate?principal=10000&period=3&toDate={date}&type=historical",
        BNB_USDC:
          "https://time-machine-api.singlefinance.io/simulate/bsc-pancakeswap-283/simulate?principal=10000&period=3&toDate={date}&type=historical",
        CAKE_BUSD:
          "https://time-machine-api.singlefinance.io/simulate/bsc-pancakeswap-389/simulate?principal=10000&period=3&toDate={date}&type=historical",
        ALPACA_BUSD:
          "https://time-machine-api.singlefinance.io/simulate/bsc-pancakeswap-362/simulate?principal=10000&period=3&toDate={date}&type=historical",
        BTCB_BUSD:
          "https://time-machine-api.singlefinance.io/simulate/bsc-pancakeswap-365/simulate?principal=10000&period=3&toDate={date}&type=historical",
        ETH_USDC:
        "https://time-machine-api.singlefinance.io/simulate/bsc-pancakeswap-409/simulate?principal=10000&period=3&toDate={date}&type=historical",
      } as SingleUrls,
    },
    chainlink: {
      "USDC/USD": "0x51597f405303C4377E36123cBc172b13269EA163",
      "USDT/USD": "0xB97Ad0E74fa7d920791E90258A6E2085088b4320",
      "WBNB/USD": "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE",
      "BUSD/USD": "0xcBb98864Ef56E9042e7d2efef76141f15731B82f",
    } as ChainLinkDep,
    alpaca: alpaca_bsc,
  },
  ftmMainnet: {
    native: {
      // FTM
      symbol: "FTM",
      address: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
      vault: "0xc1018f4Bba361A1Cc60407835e156595e92EF7Ad",
      decimals: 18,
    },
    stable: {
      // USDC
      symbol: "USDC",
      address: "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
      vault: "0x831332f94C4A0092040b28ECe9377AfEfF34B25a",
      decimals: 6,
    },
    blockTimes: blocks_ftm,
    single: {
      url: {
        FTM_USDC:
          "https://time-machine-api.singlefinance.io/simulate/fantom-spookyswap-2/simulate?principal=10000&period=14&toDate={date}&type=historical",
      } as SingleUrls,
    },
    chainlink: {
      "USDC/USD": "0x2553f4eeb82d5A26427b8d1106C51499CBa5D99c",
      "USDT/USD": "0xF64b636c5dFe1d3555A847341cDC449f612307d0",
      "WFTM/USD": "0xf4766552D15AE4d256Ad41B6cf2933482B0680dc",
    } as ChainLinkDep,
    alpaca: alpaca_ftm,
  },
};

function addHours(numOfHours: number, date: Date) {
  const dt_temp = new Date(date.getTime() + numOfHours * 60 * 60 * 1000);
  return dt_temp;
}

// Similar to a thread.sleep we don't want to keep firing requests otherwise the fail rate will be high
const timer = (ms: number) => new Promise((res) => setTimeout(res, ms));

task("avaxBorrowRates", "Queries the avax borrow rates")
  .addParam("filename", "filename to save as", "usdc", types.string)
  .addParam(
    "url",
    "The subgraph url to query",
    "https://api.thegraph.com/subgraphs/name/aave/protocol-v3-avalanche",
    types.string
  )
  .addParam(
    "tokenAddress",
    "The address to query borrow rates for",
    "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e0xa97684ead0e402dc232d5a977953df7ecbab3cdb",
    types.string
  )
  .addParam("runFailed", "runs failed blocks", false, types.boolean)
  .setAction(async ({ filename, url, tokenAddress, runFailed }) => {
    let promises: Promise<AavePayload>[] = [];

    const failedBlocks: { blockNo: number }[] = [{ blockNo: 16258109 }];
    const blocksToLoop = runFailed ? failedBlocks : blocks_avax;
    for (const block of blocksToLoop) {
      console.log(block.blockNo);
      promises.push(
        new Promise<AavePayload>(async (resolve: Function, reject: Function) => {
          const blockNo: number = block.blockNo;
          let query: string = gql`{
            reserveParamsHistoryItems (
              block: { number: ${blockNo} }
              where : { reserve: "${tokenAddress}"}
              orderBy: timestamp
              orderDirection: desc
              first: 1
            ) {
              reserve {
                id
                variableBorrowRate
                stableBorrowRate
                price {
                  priceHistory(first: 1, orderBy: timestamp, orderDirection: desc) {
                    price
                  }
                }
              }
              utilizationRate
              timestamp
            }
          }`;

          try {
            const result: AavePayload = await request(url, query);
            result.reserveParamsHistoryItems[0].reserve.stableBorrowRate = ethers.utils.formatUnits(
              result.reserveParamsHistoryItems[0].reserve.stableBorrowRate,
              27
            );
            result.reserveParamsHistoryItems[0].reserve.variableBorrowRate = ethers.utils.formatUnits(
              result.reserveParamsHistoryItems[0].reserve.variableBorrowRate,
              27
            );
            result.reserveParamsHistoryItems[0].reserve.price.priceHistory[0].price = ethers.utils.formatUnits(
              result.reserveParamsHistoryItems[0].reserve.price.priceHistory[0].price,
              8
            );
            resolve(result);
          } catch (e) {
            fs.appendFileSync(`./tasks/queryResult/avaxMainnet/failedBlocks_${filename}.json`, blockNo + ",\n");
            reject(e);
          }
        })
      );

      if (promises.length === 12) {
        const results: AavePayload[] = await Promise.all(promises.map((p) => p.catch((e) => e)));
        const validResults = results.filter((result) => !(result instanceof Error));

        const reserveHistory = validResults
          .map((reserve) => {
            return [...reserve.reserveParamsHistoryItems];
          })
          .reduce((prev, next) => {
            return prev.concat(next);
          });

        console.log(reserveHistory);

        promises = [];
        const stringResult: string = JSON.stringify(reserveHistory, null, 2).slice(1, -1);
        fs.appendFileSync(`./tasks/queryResult/avaxMainnet/${filename}.json`, stringResult);
        await timer(1000);
      }
    }

    const results: AavePayload[] = await Promise.all(promises.map((p) => p.catch((e) => e)));
    const validResults = results.filter((result) => !(result instanceof Error));

    const reserveHistory = validResults
      .map((reserve) => {
        return [...reserve.reserveParamsHistoryItems];
      })
      .reduce((prev, next) => {
        return prev.concat(next);
      });

    console.log(reserveHistory);

    promises = [];
    const stringResult: string = JSON.stringify(reserveHistory, null, 2).slice(1, -1);
    fs.appendFileSync(`./tasks/queryResult/avaxMainnet/${filename}.json`, stringResult);
  });

task("traderJoeSwaps", "Gets the swaps for trader joe per hour")
  .addParam("pairaddress", "The address for the pair", undefined, types.string)
  .addParam("step", "Hourly steps", 1, types.int)
  .addOptionalParam("currenttime", "If failed we can set the current to start where it failed", undefined, types.int)
  .addOptionalParam("start", "The start time when the entity was first created", undefined, types.int)
  .setAction(async ({ pairaddress, step, currenttime, start }) => {
    let secondsSinceEpoch = currenttime ? currenttime : Math.round(Date.now() / 1000);
    const creationTime: number = start ? start : 0;
    const steps: number = step * 3600;
    for (let current = secondsSinceEpoch; current >= creationTime; current -= 3600) {
      let query: string = gql`{
        swaps (
          where :{
            pair: "${pairaddress}",
            timestamp_gt: ${current - steps},
            timestamp_lte: ${current}
          })
        {
          id
          amount0In
          amount1In
          amount0Out
          amount1Out
          pair {
            id
          }
          transaction {
            id,
            blockNumber
            timestamp
          }
          to
          timestamp
          amountUSD
        }
      }`;

      try {
        const result = await request("https://api.thegraph.com/subgraphs/name/traderjoe-xyz/exchange", query);
        console.log(JSON.stringify(result, null, 2));
        fs.writeFileSync("./tasks/queryResult/avaxMainnet/swaps.json", JSON.stringify(result, null, 2) + ",", {
          flag: "w",
        });
      } catch (e) {
        console.log({
          failedTime: current,
        });
        throw e;
      }
    }
  });

task("pancakeSubgraph", "Queries the pancakeswap subgraph").setAction(async () => {
  const query = gql`
    query overviewTransactions {
      swaps: swaps(first: 33, orderBy: timestamp, orderDirection: desc) {
        id
        timestamp
        pair {
          token0 {
            id
            symbol
          }
          token1 {
            id
            symbol
          }
        }
        from
        amount0In
        amount1In
        amount0Out
        amount1Out
        amountUSD
      }
    }
  `;

  const result = await request("https://bsc.streamingfast.io/subgraphs/name/pancakeswap/exchange-v2", query);

  console.log(JSON.stringify(result));
});

task("generateBlocks", "generate blocks for TimeMachine queries")
  .addPositionalParam("step", "interval step in hours", 1, types.int)
  .addOptionalParam("dates", "option date string array", undefined, types.json)
  .setAction(async ({ step, dates }, { network, run, ethers }) => {
    const start = Date.now();
    const dep = resolveExternalDependency(network);
    const blocksOut: BlockTime[] = [];
    const failedBlocks: string[] = [];
    const datesForTimeMachineQuery: string[] = [];

    if (dates) {
      for (let dateStr of dates) {
        try {
          const dt = new Date(dateStr);
          const [blockTag, blockTime] = await run("getBlockNoSubTask", { date: dateStr });
          const blockTimeStr = blockTime.toISOString();
          const localeDateStr = blockTime.toLocaleString("en-GB", { hour12: false });
          console.log(dateStr, blockTag, blockTimeStr, localeDateStr.magenta);
          blocksOut.push({
            query_ts: dateStr,
            blockNo: blockTag,
            blockTime: blockTimeStr,
            localDateTime: localeDateStr,
          });

          if (dt.getHours() == 16) {
            const dailyStart = addHours(1, dt);
            datesForTimeMachineQuery.push(dailyStart.toISOString());
          }
        } catch (e) {
          console.log(`Failed to look up block for '${dateStr}'`);
          failedBlocks.push(dateStr);
          continue;
        }
      }
    } else {
      let dt =
        dep.name == "bscMainnet"
          ? new Date("2022-05-31T09:00:00.000Z")
          : dep.name == "ftmMainnet"
          ? new Date("2022-02-14T08:00:00.000Z")
          : new Date("2021-07-01T08:00:00.000Z");
      const endDate = new Date("2022-07-10T08:00:00.000Z");
      console.log(`Generating block intervals from ${dt.toISOString()} to ${endDate.toISOString()}...`);

      while (dt <= endDate) {
        try {
          const [blockTag, blockTime] = await run("getBlockNoSubTask", { date: dt.toISOString() });
          const blockTimeStr = blockTime.toISOString();
          const localeDateStr = dt.toLocaleString("en-GB", { hour12: false });
          console.log(dt.toISOString(), blockTag, blockTimeStr, localeDateStr.magenta);
          blocksOut.push({
            query_ts: dt.toISOString(),
            blockNo: blockTag,
            blockTime: blockTimeStr,
            localDateTime: localeDateStr,
          });

          if (dt.getHours() == 16) {
            const dailyStart = addHours(1, dt);
            datesForTimeMachineQuery.push(dailyStart.toISOString());
          }
        } catch (e) {
          console.log(`Failed to look up block for '${dt.toISOString()}'`);
          failedBlocks.push(dt.toISOString());
          dt = addHours(step, dt);
          continue;
        }
        dt = addHours(step, dt);
      }
    }

    fs.writeFileSync(
      `./tasks/queryData/dates_TimeMachine_${dep.name}.json`,
      JSON.stringify(datesForTimeMachineQuery, null, 2),
      { flag: "w" }
    );
    fs.writeFileSync(`./tasks/queryData/blocks_${dep.name}2.json`, JSON.stringify(blocksOut, null, 2), { flag: "w" });
    console.log(failedBlocks.length, "failed blocks: ", failedBlocks);
    console.log(elapsed(start));
  });

task("getRatesForBlocks", "Get historical borow rates on a array of blockTags")
  .addPositionalParam("blockTags", "array of blockTags", [], types.json)
  .setAction(async ({ blockTags }, { ethers, network, run }) => {
    const mainnet = network.name === "bscMainnet" ? dependencies.bscMainnet : dependencies.ftmMainnet;
    const nativeVault = await ethers.getContractAt("IIBToken", mainnet.native.vault);
    const stableVault = await ethers.getContractAt("IIBToken", mainnet.stable.vault);
    const lpRates: LpRate[] = [];
    const failedBlocks: number[] = [];

    const nativeERC20 = await ethers.getContractAt("IERC20Metadata", mainnet.native.address);
    const stableERC20 = await ethers.getContractAt("IERC20Metadata", mainnet.stable.address);

    const nativeDecimals = await nativeERC20.decimals();
    const stableDecimals = await stableERC20.decimals();

    for (let blockTag of blockTags) {
      let blockInfo = getItemFromJSON(mainnet.blockTimes, "blockNo", blockTag);
      if (!blockInfo) throw new Error(`blockTag ${blockTag} not found in blocks JSON`);

      let rates = await run("getRatesForOneBlock", {
        blockTag: blockInfo.blockNo,
        blockTime: new Date(blockInfo.blockTime),
        vaultA: nativeVault,
        vaultB: stableVault,
        decimalsA: nativeDecimals,
        decimalsB: stableDecimals,
      });

      if (rates) lpRates.push(rates);
      else failedBlocks.push(blockTag);
    }
    fs.writeFileSync(
      `./tasks/queryResult/${network.name}/rates/${mainnet.stable.symbol}-${mainnet.native.symbol}_rates_rerun.json`,
      JSON.stringify(lpRates, null, 2),
      { flag: "w" }
    );
    console.log(failedBlocks.length, "failed blocks: ", failedBlocks);

    console.log(lpRates);
    console.log(failedBlocks.length, "failed blocks: ", failedBlocks);
  });

interface Rates {
  symbol: string;
  vaultSymbol: string;
  vaultAddr: string;
  interestModelAddr: string;
  decimals: number;
  supply: string;
  debt: string;
  supplyRate: string;
  borrowRate: string;
  utilization: string;
}

interface RatesInfo {
  block: number;
  blockTime: string;
  rates: Rates[];
}

task("getAllRates", "Get borrow & lending rates for all vaults in alpaca")
  .addOptionalParam("blocks", "array of blocks to run", undefined, types.json)
  .setAction(async ({ blocks }, { ethers, run, network }) => {
    const start = Date.now();
    const mainnet = network.name === "bscMainnet" ? dependencies.bscMainnet : dependencies.ftmMainnet;
    const failedBlocks: number[] = [];
    const failedBatches: number[] = [];

    if (blocks) {
      // TODO: This also needs the rates optimisation
      for (let blockTag of blocks) {
        let block = await ethers.provider.getBlock(`0x${blockTag.toString(16)}`);
        if (!block) throw new Error(`Failed to get block '${blockTag}'`);
        let blockTimeStamp = new Date(block.timestamp * 1000);
        try {
          const args = { blockTag, blockTime: blockTimeStamp.toISOString() };
          // console.log (args);
          await run("getAllRatesForOneBlockMultiCall", args);
        } catch (e) {
          console.error(`Failed to getAllRatesForOneBlockMultiCall for block ${blockTag}`);
          console.error(e);
          failedBlocks.push(blockTag);
        }
      }
    } else {
      const batchSize = 10;
      const batches = Math.ceil(mainnet.blockTimes.length / batchSize);

      console.log(`getAllRates in ${batches} batches...`);

      for (let i = 0; i < batches; i++) {
        const batch = mainnet.blockTimes.slice(i * batchSize, (i + 1) * batchSize);
        console.log("Batch", i + 1);

        await Promise.all(
          batch.map((block) => {
            const args = { blockTag: block.blockNo, blockTime: block.blockTime };
            return run("getAllRatesForOneBlockMultiCall", args);
          })
        ).catch((err) => {
          failedBatches.push(i);
          console.log(err);
        });
      }
    }

    console.log("Failed batches:", failedBatches);
    console.log("Failed blocks:", failedBlocks);
    console.log("getAllRates took:", elapsed(start));
  });

task("getAllRatesForOneBlockMultiCall", "Get borrow & lending rates for all vaults")
  .addOptionalParam("blockTag", "block no for the query", undefined, types.int)
  .addOptionalParam("blockTime", "block timestamp", undefined, types.string)
  .setAction(async ({ blockTag, blockTime }, { ethers, run, network }) => {
    const filePath = `./tasks/queryResult/${network.name}/rates/rates${blockTag ? `_${blockTag}` : ""}.json`;

    if (blockTag && fs.existsSync(filePath)) {
      console.log(`File already exists for block ${blockTag}. Skipping ${filePath}...`);
      return;
    }

    const start = Date.now();
    const deployer = await getDeployer(ethers, network);
    const mainnet = network.name == "bscMainnet" ? dependencies.bscMainnet : dependencies.ftmMainnet;
    const multicallAddr = mainnet.alpaca.MultiCall;
    const multicallService: IMultiCallService = new Multicall2Service(multicallAddr, deployer);

    const secsInAYear = 24 * 60 * 60 * 365;
    const vaults = blockTag
      ? (mainnet.alpaca.Vaults as any[]).filter((v) => v.deployedBlock <= blockTag)
      : mainnet.alpaca.Vaults;
    const numVaults = vaults.length;

    console.log(vaults);
    console.log(numVaults);

    const calls1 = [];
    for (let vaultInfo of vaults) {
      const baseToken = await ethers.getContractAt("IERC20Metadata", vaultInfo.baseToken);
      const vault = await ethers.getContractAt("IIBToken", vaultInfo.address);
      
      calls1.push({ contract: vault, functionName: "totalToken" });
      calls1.push({ contract: vault, functionName: "vaultDebtVal" });
      calls1.push({ contract: vault, functionName: "config" });
      calls1.push({ contract: baseToken, functionName: "symbol" });
      calls1.push({ contract: baseToken, functionName: "decimals" });
    }

    const results1: any[] = await multicallService.multiContractCall<Array<BigNumber>>(calls1, {
      blockNumber: blockTag,
    });
    console.log("results1:", results1);

    const vaultFloating = [];
    const calls2 = [];
    for (let i = 0; i < numVaults; i++) {
      const vaultConfig = await ethers.getContractAt("ConfigurableInterestVaultConfig", results1[i * 5 + 2]);
      vaultFloating[i] = results1[i * 5].sub(results1[i * 5 + 1]);
      if (vaultFloating[i].lt(0)) {
        console.warn(`WARNING: Debt > Supply for block ${blockTag}. Setting Supply=Debt`);
        const decimals = results1[i * 5 + 4];
        console.log("supply:", formatUnits(results1[i * 5], decimals));
        console.log("debt:", formatUnits(results1[i * 5 + 1], decimals));
        vaultFloating[i] = BigNumber.from(0);
      }
      calls2.push({ contract: vaultConfig, functionName: "interestModel" });
    }
    const results2: any[] = await multicallService.multiContractCall<Array<BigNumber>>(calls2, {
      blockNumber: blockTag,
    });
    // console.log("interestModels:", results2);

    const calls3 = [];
    for (let i = 0; i < numVaults; i++) {
      const interestModel = await ethers.getContractAt("IAlpacaInterestRateModel", results2[i]);
      calls3.push({
        contract: interestModel,
        functionName: "getInterestRate",
        params: [results1[i * 5 + 1], vaultFloating[i]],
      });
    }
    const results3: any[] = await multicallService.multiContractCall<Array<BigNumber>>(calls3, {
      blockNumber: blockTag,
    });
    // console.log("rates:", results3);

    const data = {
      block: blockTag,
      blockTime,
      rates: [],
    } as RatesInfo;

    for (let i = 0; i < numVaults; i++) {
      const bSuppyMoreThan0 = results1[i * 5].gt(0);
      const borrowRate = bSuppyMoreThan0 ? results3[i].mul(secsInAYear) : BigNumber.from(0);
      const supplyRate = bSuppyMoreThan0
        ? borrowRate
            .mul(parseUnits("81", 16))
            .mul(results1[i * 5 + 1])
            .div(results1[i * 5])
            .div(parseEther("1"))
        : BigNumber.from(0);
      const utilization = bSuppyMoreThan0
        ? results1[i * 5 + 1].mul(parseEther("1")).div(results1[i * 5])
        : BigNumber.from(0);

      const decimals = results1[i * 5 + 4];
      const rates = {
        symbol: results1[i * 5 + 3],
        vaultSymbol: mainnet.alpaca.Vaults[i].symbol,
        vaultAddr: mainnet.alpaca.Vaults[i].address,
        interestModelAddr: results2[i],
        decimals: decimals,
        supply: formatUnits(results1[i * 5], decimals),
        debt: formatUnits(results1[i * 5 + 1], decimals),
        supplyRate: formatEther(supplyRate),
        borrowRate: formatEther(borrowRate),
        utilization: formatEther(utilization),
      } as Rates;
      data.rates.push(rates);
    }

    console.log(blockTag, blockTime);
    for (let r of data.rates) {
      console.log(
        "   ",
        r.symbol.green,
        r.supply.cyan,
        r.debt.magenta,
        r.supplyRate.yellow.dim,
        r.borrowRate.yellow,
        r.utilization.grey
      );
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), { flag: "w" });
    console.log(elapsed(start));
    return data;
  });

task("getFarmingYields", "Gets the yield farming returns from Time machine for a rolling 14 day period").setAction(
  async (_, { network }) => {
    const start = Date.now();
    console.log("Running getFarmingYields".green);
    const mainnet = network.name === "bscMainnet" ? dependencies.bscMainnet : dependencies.ftmMainnet;
    const queryDates: string[] = network.name === "bscMainnet" ? dates_Bsc : dates_Ftm;

    const masterOutFilePath = `./tasks/queryResult/${network.name}/timeMachine/2d/allIntervals_${mainnet.native.symbol}-${mainnet.stable.symbol}.csv`;
    fs.appendFileSync(
      masterOutFilePath,
      `query_ts,assumedLPToken,equityValue,totalDexYield,totalTradingfee,newTotalTradingFee,liquidity,totalVolume,volume,priceImpact,priceEffect,totalReturn,totalEquityVal,impermanentLoss,tokenPrice,quoteTokenPrice,rewardPrice,rewardTokenPerLP,feePerDollar\n`,
      { flag: "w" }
    );

    for (let date of queryDates) {
      const outFilePath = `./tasks/queryResult/${network.name}/timeMachine/2d/${mainnet.native.symbol}-${
        mainnet.stable.symbol
      }_${dateFormat(new Date(date), "yyyy-mm-dd_HHMM")}.csv`;

      if (fs.existsSync(outFilePath)) {
        console.log(`File already exists. Skipping ${outFilePath}...`);
        continue;
      }
      console.log(outFilePath);

      const url: string = mainnet.single.url[`${mainnet.native.symbol}_${mainnet.stable.symbol}`].replace(
        "{date}",
        encodeURIComponent(date)
      );
      // console.log(url);
      const response = await fetch(url, { method: "POST" });
      const data: SingleFinanceResponse = (await response.json()) as SingleFinanceResponse;
      // console.log(data);

      fs.appendFileSync(
        outFilePath,
        `query_ts,assumedLPToken,equityValue,totalDexYield,totalTradingfee,newTotalTradingFee,liquidity,totalVolume,volume,priceImpact,priceEffect,totalReturn,totalEquityVal,impermanentLoss,tokenPrice,quoteTokenPrice,rewardPrice,rewardTokenPerLP,feePerDollar\n`,
        { flag: "a+" }
      );

      if (data?.result?.chart?.roi) {
        data.result.chart.roi.pop();

        for (let i = 0; i < data.result.chart.roi.length; i++) {
          let roi: SingleFinanceRoi = data.result.chart.roi[i];
          roi.rewardTokenPerLP =
            i == 0
              ? roi.totalDexYield / roi.rewardPrice / roi.assumedLPToken
              : (roi.totalDexYield / roi.rewardPrice -
                  data.result.chart.roi[i - 1].totalDexYield / data.result.chart.roi[i - 1].rewardPrice) /
                roi.assumedLPToken;
          roi.feePerDollar = (roi.volume * 0.0017) / roi.liquidity;
          const dataToAppend: string = Object.values(roi).join(",") + "\n";

          fs.appendFileSync(outFilePath, dataToAppend);

          // save the last 24 entries from each query
          if (data.result.chart.roi.length - i <= 24) fs.appendFileSync(masterOutFilePath, dataToAppend);
        }

        // for (let roi of data.result.chart.roi) {
        //   const dataToAppend: string = Object.values(roi).join(",") + "\n";
        //   fs.appendFileSync(outFilePath, dataToAppend);
        // }
      }
    }
    console.log(elapsed(start));
  }
);

interface Position {
  id: number;
  owner?: string;
  worker?: string;
  posVal: string | BigNumber;
  debtVal: string | BigNumber;
  leverage: string | BigNumber;
}

interface DebValtByWorker {
  [key: string]: string | BigNumber;
}

interface PosValByWorker {
  [key: string]: string | BigNumber;
}

interface VaultPositionInfo {
  decimals: number;
  positions: Position[];
  positionsByWorker: PosValByWorker;
  debtsByWorker: DebValtByWorker;
  totalPosVal: string | BigNumber;
  totalDebtVal: string | BigNumber;
}

task("outstandingPositions").setAction(async ({ startingBatch }, { run, network }) => {
  const mainnet = network.name === "bscMainnet" ? dependencies.bscMainnet : dependencies.ftmMainnet;
  const vaultSymbols = network.name == "bscMainnet" ? ["ibUSDT", "ibWBNB"] : ["ibUSDC", "ibWFTM"];
  const batchSize = 5;
  const batches = Math.ceil(mainnet.blockTimes.length / batchSize);

  for (let i = 0; i < batches; i++) {
    const batch = mainnet.blockTimes.slice(i * batchSize, (i + 1) * batchSize);

    for (let symbol of vaultSymbols) {
      let bMissing = false;
      let missingBlocks: number[] = [];
      batch.map((block) => {
        const filePath = `D:\\Dropbox\\Dropbox\\Steadifi\\backup\\${network.name}\\positions\\${symbol}_${block.blockNo}.json`;
        if (!fs.existsSync(filePath)) {
          bMissing = true;
          missingBlocks.push(block.blockNo);
        }
      });

      if (bMissing) {
        console.log("Batch", i);
        console.log("    ", symbol, missingBlocks);
      }
    }
  }
});

task("getAllPositions")
  .addOptionalPositionalParam("startingBatch", "run from batch number", 0, types.int)
  .setAction(async ({ startingBatch }, { run, network }) => {
    const start = Date.now();
    const mainnet = network.name === "bscMainnet" ? dependencies.bscMainnet : dependencies.ftmMainnet;
    const failedBatches = new Set<number>();
    const batchSize = 5;
    const batches = Math.ceil(mainnet.blockTimes.length / batchSize);
    const vaultSymbols = network.name === "bscMainnet" ? ["ibBUSD", "ibWBNB"] : ["ibUSDC", "ibFTM"]; // ["ibUSDT", "ibWBNB"]

    console.log(`getAllPositions in ${batches} batches...`);

    for (let i = startingBatch; i < batches; i++) {
      const batch = mainnet.blockTimes.slice(i * batchSize, (i + 1) * batchSize);
      console.log("Batch", i + 1);

      // Group calls of similar sizes instead of group a small query with a large one.
      for (let symbol of vaultSymbols) {
        await Promise.all(
          batch.map((block) =>
            run("getPositionsMultiCall", { vaultSymbol: symbol, blockTag: block.blockNo, bLog: false })
          )
        ).catch((err) => {
          console.log(err);
          failedBatches.add(i);
        });
      }
    }

    console.log("Failed batches:", failedBatches);
    console.log("getAllPositions took:", elapsed(start));
  });

task("getPositionsMultiCall", "return vault positions & debts by worker on Alpaca")
  .addPositionalParam("vaultSymbol", "vault symbol", undefined, types.string)
  .addOptionalParam("blockTag", "block no for the query", undefined, types.int)
  .addOptionalParam("bLog", "show logging", true, types.boolean)
  .setAction(async ({ blockTag, vaultSymbol, bLog }, { run, ethers, network }) => {
    // const filePath = `./tasks/queryResult/${network.name}/positions/${vaultSymbol}${
    //   blockTag ? `_${blockTag}` : ""
    // }.json`;

    // const filePath = `C:\\Dropbox\\Steadifi\\backup\\${network.name}\\positions\\${vaultSymbol}${
    //   blockTag ? `_${blockTag}` : ""
    // }.json`;

    const filePath = `/mnt/c/Dropbox/Steadifi/backup/${network.name}/positions/${vaultSymbol}${
      blockTag ? `_${blockTag}` : ""
    }.json`;

    if (blockTag && fs.existsSync(filePath)) {
      console.log(`File already exists. Skipping ${filePath}...`);
      return;
    }

    const start = Date.now();
    const deployer = await getDeployer(ethers, network);
    const mainnet = network.name == "bscMainnet" ? dependencies.bscMainnet : dependencies.ftmMainnet;
    const multicallAddr = mainnet.alpaca.MultiCall;
    const multicallService: IMultiCallService = new Multicall2Service(multicallAddr, deployer);

    const vaults =
      network.name == "bscMainnet" ? dependencies.bscMainnet.alpaca.Vaults : dependencies.ftmMainnet.alpaca.Vaults;
    const vaultInfo = getItemFromJSON(vaults, "symbol", vaultSymbol);

    if (!vaultInfo) throw new Error(`Vault '${vaultSymbol}' not found`);

    const vault = await ethers.getContractAt("IAlpacaVault", vaultInfo.address);
    if (!vault) throw new Error(`Failed to load Contract for IAlpacaVault '${vaultInfo.address}'`);
    const baseTokenAddr = await vault.token();
    const baseToken = await ethers.getContractAt("IERC20Metadata", baseTokenAddr);
    const baseTokenDecimals = await baseToken.decimals();

    let nextPositionId = (await vault.nextPositionID({ blockTag })).toNumber();
    console.log(`${blockTag} - ${nextPositionId - 1} position(s) found for ${vaultSymbol}`.grey);

    let vaultPos: VaultPositionInfo = {
      decimals: baseTokenDecimals,
      positions: [],
      positionsByWorker: {},
      debtsByWorker: {},
      totalPosVal: BigNumber.from(0),
      totalDebtVal: BigNumber.from(0),
    };

    let positionData: any[] = [];
    const maxLimit = network.name == "bscMainnet" ? 200 : 1000;
    for (let n = 0; n < Math.ceil(nextPositionId / maxLimit); n++) {
      // console.log("n=", n);
      const positionsCalls = [];
      for (let i = n * maxLimit; i < Math.min((n + 1) * maxLimit, nextPositionId); i++) {
        // console.log(i);
        if (i > 0) {
          positionsCalls.push({ contract: vault, functionName: "positionInfo", params: [i] });
          positionsCalls.push({ contract: vault, functionName: "positions", params: [i] });
        }
      }
      const results: any[] = await multicallService.multiContractCall<Array<BigNumber>>(positionsCalls, {
        blockNumber: blockTag,
      });
      positionData = positionData.concat(results);
    }

    for (let i = 0; i < (nextPositionId - 1) * 2; i += 2) {
      const id = Math.floor(i / 2) + 1;
      const positionInfo = positionData[i];
      const position = positionData[i + 1];
      const principal = positionInfo.positionVal.sub(positionInfo.debtVal);

      if (principal.gt("0")) {
        const leverage = positionInfo.positionVal.mul(BIG_ONE).div(principal);
        const p = {
          id,
          owner: position.owner,
          worker: position.worker,
          posVal: positionInfo.positionVal,
          debtVal: positionInfo.debtVal,
          leverage,
        } as Position;
        vaultPos.positions.push(p);

        if (bLog)
          console.log(
            p.id,
            "owner:".magenta,
            p.owner?.green,
            "worker:".magenta,
            p.worker?.green,
            "postVal:".magenta,
            formatUnits(p.posVal, baseTokenDecimals),
            "debtVal:".magenta,
            formatUnits(p.debtVal, baseTokenDecimals),
            "leverage:".magenta,
            formatEther(leverage).cyan
          );

        vaultPos.totalPosVal = (vaultPos.totalPosVal as BigNumber).add(p.posVal);
        vaultPos.totalDebtVal = (vaultPos.totalDebtVal as BigNumber).add(p.debtVal);
        vaultPos.positionsByWorker[position.worker] =
          (vaultPos.positionsByWorker[position.worker] as BigNumber)?.add(p.posVal) ?? p.posVal;
        vaultPos.debtsByWorker[position.worker] =
          (vaultPos.debtsByWorker[position.worker] as BigNumber)?.add(p.debtVal) ?? p.debtVal;
      }
    }

    // // Convert BigNumber to string for serialization
    vaultPos.totalPosVal = formatUnits(vaultPos.totalPosVal, baseTokenDecimals);
    vaultPos.totalDebtVal = formatUnits(vaultPos.totalDebtVal, baseTokenDecimals);

    for (let w in vaultPos.positionsByWorker) {
      vaultPos.positionsByWorker[w] = formatUnits(vaultPos.positionsByWorker[w], baseTokenDecimals);
    }

    for (let w in vaultPos.debtsByWorker) {
      vaultPos.debtsByWorker[w] = formatUnits(vaultPos.debtsByWorker[w], baseTokenDecimals);
    }

    for (let p of vaultPos.positions) {
      p.posVal = formatUnits(p.posVal, baseTokenDecimals);
      p.debtVal = formatUnits(p.debtVal, baseTokenDecimals);
      p.leverage = formatEther(p.leverage);
    }

    fs.writeFileSync(filePath, JSON.stringify(vaultPos, null, 2), { flag: "w" });
    // console.log(vaultPos);
    console.log(blockTag, `${nextPositionId - 1} position(s) found for ${vaultSymbol}`, elapsed(start));
    return vaultPos;
  });

task("getPositions", "return vault positions & debts by worker on Alpaca")
  .addPositionalParam("vaultSymbol", "vault symbol", undefined, types.string)
  .addOptionalParam("blockTag", "block no for the query", undefined, types.int)
  .setAction(async ({ blockTag, vaultSymbol }, { run, ethers, network }) => {
    const filePath = `./tasks/queryResult/${network.name}/positions/${vaultSymbol}${
      blockTag ? `_${blockTag}` : ""
    }.json`;

    if (blockTag && fs.existsSync(filePath)) {
      console.log(`File already exists for block ${blockTag}. Skipping ${filePath}...`);
      return;
    }

    const start = Date.now();
    const vaults =
      network.name == "bscMainnet" ? dependencies.bscMainnet.alpaca.Vaults : dependencies.ftmMainnet.alpaca.Vaults;
    const vaultInfo = getItemFromJSON(vaults, "symbol", vaultSymbol);

    if (!vaultInfo) throw new Error(`Vault '${vaultSymbol}' not found for ${vaultSymbol}`);

    const vault = await ethers.getContractAt("IAlpacaVault", vaultInfo.address);
    const baseTokenAddr = await vault.token();
    const baseToken = await ethers.getContractAt("IERC20Metadata", baseTokenAddr);
    const baseTokenDecimals = await baseToken.decimals();
    let nextPositionId = await vault.nextPositionID({ blockTag });
    console.log(`${blockTag} - ${nextPositionId - 1} position(s) found`);

    let vaultPos: VaultPositionInfo = {
      decimals: baseTokenDecimals,
      positions: [],
      positionsByWorker: {},
      debtsByWorker: {},
      totalPosVal: BigNumber.from(0),
      totalDebtVal: BigNumber.from(0),
    };

    for (let id = 1; id < nextPositionId; id++) {
      try {
        let [posVal, debtVal] = await vault.positionInfo(id, { blockTag });
        const position = await vault.positions(id, { blockTag });
        const principal = posVal.sub(debtVal);

        if (position.debtShare.gt("0")) {
          const leverage = posVal.mul(BIG_ONE).div(principal);
          const p = { id, owner: position.owner, worker: position.worker, posVal, debtVal, leverage } as Position;
          vaultPos.positions.push(p);

          console.log(
            id,
            "owner:".magenta,
            position.owner.green,
            "worker:".magenta,
            position.worker.green,
            "postVal:".magenta,
            formatUnits(posVal, baseTokenDecimals),
            "debtVal:".magenta,
            formatUnits(debtVal, baseTokenDecimals),
            "leverage:".magenta,
            formatEther(leverage).cyan
          );

          vaultPos.totalPosVal = (vaultPos.totalPosVal as BigNumber).add(posVal);
          vaultPos.totalDebtVal = (vaultPos.totalDebtVal as BigNumber).add(debtVal);
          vaultPos.positionsByWorker[position.worker] =
            (vaultPos.positionsByWorker[position.worker] as BigNumber)?.add(posVal) ?? posVal;
          vaultPos.debtsByWorker[position.worker] =
            (vaultPos.debtsByWorker[position.worker] as BigNumber)?.add(debtVal) ?? debtVal;
        }
      } catch (e) {
        console.error(e);
        continue;
      }
    }

    // Convert BigNumber to string for serialization
    vaultPos.totalPosVal = formatUnits(vaultPos.totalPosVal, baseTokenDecimals);
    vaultPos.totalDebtVal = formatUnits(vaultPos.totalDebtVal, baseTokenDecimals);

    for (let w in vaultPos.positionsByWorker) {
      vaultPos.positionsByWorker[w] = formatUnits(vaultPos.positionsByWorker[w], baseTokenDecimals);
    }

    for (let w in vaultPos.debtsByWorker) {
      vaultPos.debtsByWorker[w] = formatUnits(vaultPos.debtsByWorker[w], baseTokenDecimals);
    }

    for (let p of vaultPos.positions) {
      p.posVal = formatUnits(p.posVal, baseTokenDecimals);
      p.debtVal = formatUnits(p.debtVal, baseTokenDecimals);
      p.leverage = formatEther(p.leverage);
    }

    fs.writeFileSync(filePath, JSON.stringify(vaultPos, null, 2), { flag: "w" });
    // console.log(vaultPos);
    console.log(elapsed(start));
    return vaultPos;
  });

subtask("getLPStatic", "get spooky swap pool")
  .addParam("lpName", "name of LP Token", undefined, types.string)
  .setAction(async ({ lpName }, { network }) => {
    const pools =
      network.name === "bscMainnet"
        ? dependencies.bscMainnet.alpaca.YieldSources.Pancakeswap.pools
        : dependencies.ftmMainnet.alpaca.YieldSources.SpookySwap.pools;
    const lp = getItemFromJSON(pools, "name", lpName);
    if (!lp) throw new Error(`lp '${lpName} not found'`);
    return lp;
  });

task("getNonDeltaNeutralWorkers", "get workers for an LP on spookySwapfor a vault on Alpaca")
  .addParam("lpName", "name of LP Token", undefined, types.string)
  .addOptionalParam("log", "log results", false, types.boolean)
  .setAction(async ({ lpName, log }, { run, network }) => {
    const lp = await run("getLPStatic", { lpName });
    const vaults =
      network.name === "bscMainnet" ? dependencies.bscMainnet.alpaca.Vaults : dependencies.ftmMainnet.alpaca.Vaults;
    const workers = getItemsFromJSON(vaults, "stakingToken", lp.address);
    const nonDeltaNeutralWorkers = workers.filter((worker: any) => !worker.name.includes("DeltaNeutral"));
    if (log) console.log(nonDeltaNeutralWorkers);
    return nonDeltaNeutralWorkers;
  });

task("getWorkerParent", "get workers for an LP on spookySwapfor a vault on Alpaca")
  .addParam("address", "contract address of worker", undefined, types.string)
  .addOptionalParam("log", "show results", false, types.boolean)
  .setAction(async ({ address, log }, { run, network }) => {
    const vaults =
      network.name === "bscMainnet" ? dependencies.bscMainnet.alpaca.Vaults : dependencies.ftmMainnet.alpaca.Vaults;
    const workersParent = getParentItemFromJSON(vaults, "address", address);
    if (log) console.log(workersParent);
    return workersParent;
  });

task("getReserves", "get token reserves for a leverage yield farm on Alpaca")
  .addParam("lpName", "name of LP Token", undefined, types.string)
  .addOptionalParam("blockTag", "blockTag to apply", undefined, types.int)
  .setAction(async ({ lpName, blockTag }, { run, ethers }) => {
    const lp = await run("getLPStatic", { lpName });
    const lpToken = await ethers.getContractAt("IUniswapV2ERC20", lp.address);
    const token0Addr = await lpToken.token0({ blockTag });
    const token1Addr = await lpToken.token1({ blockTag });
    const token0 = await ethers.getContractAt("IERC20Metadata", token0Addr);
    const token1 = await ethers.getContractAt("IERC20Metadata", token1Addr);
    const token0_symbol = await token0.symbol();
    const token1_symbol = await token1.symbol();
    const token0_decimals = await token0.decimals();
    const token1_decimals = await token1.decimals();
    const { reserve0, reserve1 } = await lpToken.getReserves({ blockTag });
    console.log(
      lpToken.address,
      formatUnits(reserve0, token0_decimals),
      token0_symbol.grey,
      formatUnits(reserve1, token1_decimals),
      token1_symbol.grey
    );
  });

interface WorkerPosition {
  name: string;
  address: string;
  vault: string;
  borrowToken: string;
  posVal: number;
  posValUSD: number;
  debtVal: number;
  debtValUSD: number;
}

interface FarmTVL {
  blockNo?: number;
  lpName: string;
  lpTokens: number;
  token0_symbol: string;
  token0_decimals: number;
  token0: number;
  token0_liquidity: number;
  token0_price: number;
  token0_posVal: number;
  token0_posValUSD: number;
  token0_debtVal: number;
  token0_debtValUSD: number;
  token1_symbol: string;
  token1_decimals: number;
  token1: number;
  token1_liquidity: number;
  token1_price: number;
  token1_posVal: number;
  token1_posValUSD: number;
  token1_debtVal: number;
  token1_debtValUSD: number;
  liquidity: number;
  tvl: number;
  health: number;
  debt: number;
  leverage: number;
  workerPositions: WorkerPosition[];
}

task("getAllFarmInfo").setAction(async (_, { run, network }) => {
  const start = Date.now();
  const mainnet = network.name === "bscMainnet" ? dependencies.bscMainnet : dependencies.ftmMainnet;
  const failedBlocks: [string, number][] = [];

  for (let block of mainnet.blockTimes) {
    const lpName = network.name == "bscMainnet" ? "WBNB-BUSD LP" : "WFTM-USDC LP"; // "USDT-WBNB LP"
    try {
      await run("getFarmInfo", { lpName, blockTag: block.blockNo });
    } catch (e) {
      console.log(`Failed to getFarmInfo for '${lpName}', ${block.blockNo}`);
      failedBlocks.push([lpName, block.blockNo]);
    }
  }
  console.log("Failed calls:", failedBlocks);
  console.log("getAllFarmInfo took:", elapsed(start));
});

function getBorrowSymbolFromWorkerName(name: string): string {
  return name.split(" ")[0].split("-")[1];
}

task("getFarmInfo", "get LP Balance for all workers of a spookySwap LP on Alpaca")
  .addParam("lpName", "name of LP Token", undefined, types.string)
  .addOptionalParam("blockTag", "blockTag to apply", undefined, types.int)
  .setAction(async ({ lpName, blockTag }, { run, ethers, network }) => {
    const filePath = `./tasks/queryResult/${network.name}/farms/${lpName.replace(" ", "_")}${
      blockTag ? `_${blockTag}` : ""
    }.json`;

    if (blockTag && fs.existsSync(filePath)) {
      console.log(`File already exists for block ${blockTag}. Skipping ${filePath}...`);
      return;
    }

    const start = Date.now();
    const masterChefAddr =
      network.name == "bscMainnet"
        ? dependencies.bscMainnet.alpaca.YieldSources.Pancakeswap.MasterChef
        : dependencies.ftmMainnet.alpaca.YieldSources.SpookySwap.SpookyMasterChef;
    const masterChef = await ethers.getContractAt("ISpookyMasterChef", masterChefAddr);
    if (!masterChef) throw new Error("Failed to get SpookyMasterChef");

    const lp = await run("getLPStatic", { lpName });
    const lpToken = await ethers.getContractAt("IUniswapV2ERC20", lp.address);
    const lpDecimals = await lpToken.decimals();
    const lpTotalSupply = await lpToken.totalSupply({ blockTag });

    const token0Addr = await lpToken.token0({ blockTag });
    const token1Addr = await lpToken.token1({ blockTag });
    const token0 = await ethers.getContractAt("IERC20Metadata", token0Addr);
    const token1 = await ethers.getContractAt("IERC20Metadata", token1Addr);
    const token0_symbol = await token0.symbol();
    const token1_symbol = await token1.symbol();
    const token0_decimals = await token0.decimals();
    const token1_decimals = await token1.decimals();
    const { reserve0, reserve1 } = await lpToken.getReserves({ blockTag });

    const workers = await run("getNonDeltaNeutralWorkers", { lpName });
    let balance = BigNumber.from("0");

    for (let worker of workers) {
      const bal = await masterChef.userInfo(worker.pId, worker.address, { blockTag });
      balance = balance.add(bal.amount);
    }

    const token0_amt: BigNumber = reserve0.mul(balance).div(lpTotalSupply);
    const token1_amt: BigNumber = reserve1.mul(balance).div(lpTotalSupply);

    const prices = new Map<string, any>();
    const token0_price = await run("getPrice", { symbol: token0_symbol, blockTag });
    const token1_price = await run("getPrice", { symbol: token1_symbol, blockTag });
    prices.set(token0_symbol, token0_price);
    prices.set(token1_symbol, token1_price);

    const liquidity =
      parseFloat(formatUnits(reserve0, token0_decimals)) *
        parseFloat(formatUnits(token0_price.val, token0_price.decimals)) +
      parseFloat(formatUnits(reserve1, token1_decimals)) *
        parseFloat(formatUnits(token1_price.val, token1_price.decimals));

    const tvl =
      parseFloat(formatUnits(token0_amt, token0_decimals)) *
        parseFloat(formatUnits(token0_price.val, token0_price.decimals)) +
      parseFloat(formatUnits(token1_amt, token1_decimals)) *
        parseFloat(formatUnits(token1_price.val, token1_price.decimals));

    const positions: any[] = [];
    const workerPositions: WorkerPosition[] = [];
    let token0_posVal: number = 0;
    let token0_posValUSD: number = 0;
    let token0_debtVal: number = 0;
    let token0_debtValUSD: number = 0;
    let token1_posVal: number = 0;
    let token1_posValUSD: number = 0;
    let token1_debtVal: number = 0;
    let token1_debtValUSD: number = 0;
    let totalPosValUSD: number = 0;
    let totalDebtValUSD: number = 0;
    for (let worker of workers) {
      const vault = await run("getWorkerParent", { address: worker.address });
      const borrowSymbol = getBorrowSymbolFromWorkerName(worker.name);

      // const positionsPath = `D:\\Dropbox\\Dropbox\\Steadifi\\backup\\${network.name}\\positions\\${vault.symbol}${
      //   blockTag ? `_${blockTag}` : ""
      // }.json`;

      const positionsPath = `/home/lorenzo/Dropbox/Steadifi/backup/${network.name}/positions/${vault.symbol}${
        blockTag ? `_${blockTag}` : ""
      }.json`;

      // const positionsPath = `./queryResult/${network.name}/positions/${vault.symbol}${
      //   blockTag ? `_${blockTag}` : ""
      // }.json`;
      // console.log(`Loading positions: ${positionsPath}`);
      const p = await import(positionsPath);
      positions.push(p);

      const posVal = p.positionsByWorker[worker.address] ? parseFloat(p.positionsByWorker[worker.address]) : 0;
      const debtVal = p.debtsByWorker[worker.address] ? parseFloat(p.debtsByWorker[worker.address]) : 0;
      const baseToken = await ethers.getContractAt("IERC20Metadata", vault.baseToken);
      const baseTokenSymbol = await baseToken.symbol();
      const baseTokenPriceObj = prices.get(baseTokenSymbol);
      const baseTokenPrice = parseFloat(formatUnits(baseTokenPriceObj.val, baseTokenPriceObj.decimals));
      const posValUSD = posVal * baseTokenPrice;
      const debtValUSD = debtVal * baseTokenPrice;

      const bIsToken0 = borrowSymbol == token0_symbol;
      if (bIsToken0) {
        token0_posVal += posVal;
        token0_posValUSD += posValUSD;
        token0_debtVal += debtVal;
        token0_debtValUSD += debtValUSD;
      } else {
        // is token1
        token1_posVal += posVal;
        token1_posValUSD += posValUSD;
        token1_debtVal += debtVal;
        token1_debtValUSD += debtValUSD;
      }

      workerPositions.push({
        name: worker.name,
        address: worker.address,
        vault: vault.symbol,
        borrowToken: borrowSymbol,
        posVal,
        posValUSD,
        debtVal,
        debtValUSD,
      } as WorkerPosition);

      totalPosValUSD += posValUSD;
      totalDebtValUSD += debtValUSD;

      // console.log(`${worker.name.green} (${vault.symbol}): pos ${posVal.cyan} posUSD ${posValUSD} debt ${debtVal.magenta}  debt USD ${debtValUSD}`);
      console.log(
        worker.name.green,
        `(${vault.symbol})`.grey,
        "pos:",
        posVal.toString().yellow,
        baseTokenSymbol.grey,
        "or".grey,
        posValUSD,
        "USD".grey,
        "debt:",
        debtVal,
        baseTokenSymbol.grey,
        "or".grey,
        debtValUSD,
        "USD".grey
      );
    }

    const leverage = totalPosValUSD / (totalPosValUSD - totalDebtValUSD);

    console.log(
      blockTag,
      "-",
      "LIQ".magenta,
      liquidity,
      "TVL".magenta,
      tvl,
      lpName.green,
      formatUnits(balance, lpDecimals),
      "LP Tokens".grey,
      formatUnits(token0_amt, token0_decimals),
      token0_symbol.grey,
      formatUnits(token0_price.val, token0_price.decimals).grey,
      formatUnits(token1_amt, token1_decimals),
      token1_symbol.grey,
      formatUnits(token1_price.val, token1_price.decimals).grey,
      "Leverage".magenta,
      leverage
    );

    const farmInfo = {
      blockNo: blockTag,
      lpName,
      lpTokens: parseFloat(formatUnits(balance, lpDecimals)),
      token0_symbol,
      token0_decimals,
      token0: parseFloat(formatUnits(token0_amt, token0_decimals)),
      token0_liquidity: parseFloat(formatUnits(reserve0, token0_decimals)),
      token0_price: parseFloat(formatUnits(token0_price.val, token0_price.decimals)),
      token0_posVal,
      token0_posValUSD,
      token0_debtVal,
      token0_debtValUSD,
      token1_symbol,
      token1_decimals,
      token1: parseFloat(formatUnits(token1_amt, token1_decimals)),
      token1_liquidity: parseFloat(formatUnits(reserve1, token1_decimals)),
      token1_price: parseFloat(formatUnits(token1_price.val, token1_price.decimals)),
      token1_posVal,
      token1_posValUSD,
      token1_debtVal,
      token1_debtValUSD,
      liquidity,
      tvl,
      health: totalPosValUSD,
      debt: totalDebtValUSD,
      leverage,
      workerPositions,
    } as FarmTVL;

    fs.writeFileSync(filePath, JSON.stringify(farmInfo, null, 2), { flag: "w" });
    // console.log(farmInfo);

    console.log(elapsed(start));
    return farmInfo;
  });

interface BigNumberScaled {
  val: BigNumber;
  decimals: number;
}

subtask("getPrice", "get USD price from ChainLink")
  .addParam("symbol", "name of LP Token", undefined, types.string)
  .addOptionalParam("blockTag", "blockTag to apply", undefined, types.int)
  .setAction(async ({ symbol, blockTag }, { run, ethers, network }) => {
    const oracles =
      network.name == "bscMainnet" ? dependencies.bscMainnet.chainlink : dependencies.ftmMainnet.chainlink;
    const key = `${symbol}/USD`;
    const oracleAddr = oracles[key];
    if (!oracleAddr) throw new Error(`ChainLink oracle not found for ${key}`);
    const oracle = await ethers.getContractAt("AggregatorV3Interface", oracleAddr);
    const decimals = await oracle.decimals({ blockTag });
    const roundData = await oracle.latestRoundData({ blockTag });
    const price = formatUnits(roundData.answer, decimals);
    // console.log(symbol.yellow, price);
    return { val: roundData.answer, decimals } as BigNumberScaled;
  });

task("mergeRates").setAction(async ({}, { network }) => {
  const start = Date.now();
  const mainnet = network.name === "bscMainnet" ? dependencies.bscMainnet : dependencies.ftmMainnet;
  const failedBlocks: number[] = [];
  const allRatesInfo: RatesInfo[] = [];

  for (let block of mainnet.blockTimes) {
    const ratefilePath = `./tasks/queryResult/${network.name}/rates/rates_${block.blockNo}.json`;
    if (!fs.existsSync(ratefilePath)) {
      console.warn(`Rate missing for block ${block.blockNo}. Skipping ${ratefilePath}...`);
      continue;
    }

    let ratesInfo: RatesInfo;
    const ratefilePath2 = `./queryResult/${network.name}/rates/rates_${block.blockNo}.json`;
    ratesInfo = await import(ratefilePath2);
    allRatesInfo.push(ratesInfo);
  }

  fs.writeFileSync(`./tasks/queryResult/${network.name}/rates/allRates.json`, JSON.stringify(allRatesInfo, null, 2), {
    flag: "w",
  });

  console.log("Failed blocks:", failedBlocks);
  console.log("getAllRates took:", elapsed(start));
});

task("mergeData", "Merge data across all files").setAction(async (_, { ethers, network }) => {
  console.log("Merging data across all files");

  const start = Date.now();
  const dep = resolveExternalDependency(network);
  const directory: string = `./tasks/queryResult/${dep.name}/timeMachine`;

  let dirCont = fs.readdirSync(directory);
  let files = dirCont.filter(function (elm) {
    return elm.match(/.*\.(csv?)/gi);
  });

  const blockTimesFromFile: BlockTime[] = dep.name === "bscMainnet" ? blocks_bsc : blocks_ftm;
  const blockTimesByTs: { [key: string]: BlockTime } = keyBy(blockTimesFromFile, "query_ts");
  const failedFiles: string[] = [];

  let baseOutputPath: string = `./tasks/queryResult/${dep.name}/merged/`;
  const farmFileName = network.name == "bscMainnet" ? "WBNB-BUSD LP" : "WFTM-USDC_LP"; // "USDT-WBNB_LP"

  for (let file of files) {
    // query_ts, assumedLPToken, equityValue, totalDexYield, totalTradingfee, newTotalTradingFee, liquidity, totalVolume, volume, priceImpact, priceEffect,
    // totalReturn, totalEquityVal, impermanentLoss, tokenPrice, quoteTokenPrice, rewardPrice
    // lpName, lpTokens, token0_symbol, token0, token0_liquidity,
    // token0_price, token0_posVal, token0_posValUSD, token0_debtVal, token0_debtValUSD,
    // token1_price, token1_posVal, token1_posValUSD, token1_debtVal, token1_debtValUSD,
    // liquidity, tvl, health, debt, leverage

    console.log(`Processing '${file}'...`);

    try {
      // Remove \r for windows!!
      // const originalContent: string[] = fs.readFileSync(directory + "/" + file, "utf8").replace(/\r/g, '').split("\n");
      const originalContent: string[] = fs
        .readFileSync(directory + "/" + file, "utf8")
        .replaceAll("\r", "")
        .split("\n");

      // console.log(originalContent.length, "lines");

      const mergedContent: string[] = [
        originalContent[0] +
          ",block,blockTime,lpName,lpTokens" +
          ",token0_symbol,token0,token0_liquidity,token0_price,token0_posVal,token0_posValUSD,token0_debtVal,token0_debtValUSD,token0_supply,token0_debt,token0_util,token0_supplyRate,token0_borrowRate" +
          ",token1_symbol,token1,token1_liquidity,token1_price,token1_posVal,token1_posValUSD,token1_debtVal,token1_debtValUSD,token1_supply,token1_debt,token1_util,token1_supplyRate,token1_borrowRate" +
          ",liquidity,tvl,health,debt,leverage",
      ];

      for (let i = 1; i < originalContent.length; i++) {
        if (originalContent[i] === "") {
          continue;
        }
        // console.log(originalContent[i]);

        const timeMachineData: string[] = originalContent[i].split(",");
        const query_ts: string = timeMachineData[0];

        // Lookup blockNo
        const blockTime: BlockTime = blockTimesByTs[query_ts];
        if (!blockTime) throw new Error(`Block not found for ${query_ts} from file '${file}'`);

        // Load farm info
        const farmInfoPath = `./queryResult/${network.name}/farms/${farmFileName}_${blockTime.blockNo}.json`;
        let farmInfo: FarmTVL;
        farmInfo = await import(farmInfoPath);
        if (!farmInfo) throw new Error(`Failed to load FarmInfo '${farmInfoPath}'`);

        // // Load interest rates
        const ratesPath = `./queryResult/${network.name}/rates/rates_${blockTime.blockNo}.json`;
        let ratesInfo: RatesInfo;
        ratesInfo = await import(ratesPath);
        let rates: { [key: string]: Rates } = keyBy(ratesInfo.rates, "symbol");
        const token0_rates = rates[farmInfo.token0_symbol];
        const token1_rates = rates[farmInfo.token1_symbol];
        if (!token0_rates)
          throw new Error(
            `failed to load interest rate for '${farmInfo.token0_symbol}' for block ${blockTime.blockNo}`
          );
        if (!token1_rates)
          throw new Error(
            `failed to load interest rate for '${farmInfo.token1_symbol}' for block ${blockTime.blockNo}`
          );

        timeMachineData.push(
          blockTime.blockNo.toString(),
          blockTime.blockTime,
          farmInfo.lpName,
          farmInfo.lpTokens.toString(),
          farmInfo.token0_symbol,
          farmInfo.token0.toString(),
          farmInfo.token0_liquidity.toString(),
          farmInfo.token0_price.toString(),
          farmInfo.token0_posVal.toString(),
          farmInfo.token0_posValUSD.toString(),
          farmInfo.token0_debtVal.toString(),
          farmInfo.token0_debtValUSD.toString(),
          token0_rates.supply,
          token0_rates.debt,
          token0_rates.utilization,
          token0_rates.supplyRate,
          token0_rates.borrowRate,
          farmInfo.token1_symbol,
          farmInfo.token1.toString(),
          farmInfo.token1_liquidity.toString(),
          farmInfo.token1_price.toString(),
          farmInfo.token1_posVal.toString(),
          farmInfo.token1_posValUSD.toString(),
          farmInfo.token1_debtVal.toString(),
          farmInfo.token1_debtValUSD.toString(),
          token1_rates.supply,
          token1_rates.debt,
          token0_rates.utilization,
          token1_rates.supplyRate,
          token1_rates.borrowRate,
          farmInfo.liquidity.toString(),
          farmInfo.tvl.toString(),
          farmInfo.health.toString(),
          farmInfo.debt.toString(),
          farmInfo.leverage.toString()
        );
        const row = timeMachineData.join(",");
        mergedContent.push(row);
        // console.log(row);
      }

      fs.writeFileSync(baseOutputPath + file, mergedContent.join("\n"));
    } catch (e) {
      console.log(`Failed processing file '${file}'`);
      console.log(e);
      failedFiles.push(file);
    }
  }

  console.log("Failed files:", failedFiles);
  console.log(elapsed(start));
});
