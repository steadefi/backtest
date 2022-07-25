import { ADDRESS_ZERO } from "@uniswap/v3-sdk";
import { Network } from "hardhat/types";

// block time in seconds
export const ETHMAINNET_BLOCK_TIME = 13.25;
export const ETHROPSTEN_BLOCK_TIME = 15;
export const ETHRINKEBY_BLOCK_TIME = 15;
export const ETHKOVAN_BLOCK_TIME = 4;
export const ETHGOERLI_BLOCK_TIME = 15;
export const BSCMAINNET_BLOCK_TIME = 3;
export const FTMMAINNET_BLOCK_TIME = 0.7;
export const POLYGONMAINNET_BLOCK_TIME = 2.2;
export const POLYGONMUMBAI_BLOCK_TIME = 2.4;
export const FANTOM_BLOCK_TIME = 1.2;
export const AVAXMAINNET_BLOCK_TIME = 2;
export const SOLANA_BLOCK_TIME = 0.4;

// dummy currency addresses
// compliant with EIP-55: Mixed-case checksum address encoding
// DO NOT wrap with contracts or treat as real tokens
export const DUMMY_ETH_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
export const DUMMY_BNB_ADDRESS = "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB";
export const DUMMY_USD_ADDRESS = "0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF";

interface IExternalDependency {
  [key: string]: any;
}

export interface ExternalDependency extends IExternalDependency {
  // network nature
  chainId: number;
  name: string; // name is needed for localhost and flurry forking deployment
  nativeSymbol: string;
  wrappedNativeSymbol: string;
  wrappedNativeAddr: string;
  blockTime: number;
  blocksPerYear: number;
  defaultExchange: string;

  // underlying tokens
  underlying: TokenInfoDep;

  // tokens
  tokens: TokenInfoDep;
  depositTokens: TokenInfoDep;

  // lending protocols
  AaveV1?: AaveV1Dep;
  AaveV2?: AaveV2Dep;
  AaveV2Polygon?: AaveV2PolygonDep;
  Alpaca?: AlpacaDep;
  Benqi?: BenqiDep;
  BZx?: StrategyDep;
  Compound?: CompoundDep;
  CompoundV0?: CompoundV0Dep;
  Cream?: StrategyDep;
  Dydx?: DydxDep;
  Qubit?: QubitDep;
  Rabbit?: RabbitDep;
  Sushi?: SushiDep;
  Venus?: VenusDep;

  // AMM
  uniswapV2?: UniswapV2Dep;
  uniswapV3?: UniswapV3Dep;
  pangolin?: UniswapV2Dep;
  kyber?: KyberDep;
  kyberAggregation?: KyberAggregationDep;

  // DeFi infrastructure
  // Chainlink
  chainlink: ChainLinkDep;
  keeper?: ChainlinkKeeper;
  safes?: MultiSigWallets;
  multicall?: string;
  relayer?: DefenderRelayer;

  // strategies
  strategies: string[];

  // deposit unwinders
  depositUnwinders: DepositUnwinderDep[];
}

interface TokenInfoDep {
  [key: string]: TokenInfo;
}

export interface TokenInfo {
  SYMBOL?: string;
  ADDRESS: string;
  WHALE_ADDRESS?: string;
  PID?: number;
  EXCHANGE?: string;
  NATIVE_PAIR?: string;
  COLLATERAL_SYMBOL?: string;
  COLLATERAL_ADDRESS?: string;
}

export interface KashiPair {
  asset: string;
  collateral: string;
  pid?: number;
}

interface StrategyDep {
  [key: string]: string | string[];
  BonusTokens: string[];
}

export interface AaveV1Dep extends StrategyDep {
  LENDING_POOL_ADDRESSES_PROVIDER_ADDRESS: string;
}
export interface AaveV2Dep extends StrategyDep {
  PROTOCOL_DATA_PROVIDER_ADDRESS: string;
  STKAAVE_ADDRESS: string;
}

export interface AaveV2PolygonDep extends StrategyDep {
  PROTOCOL_DATA_PROVIDER_ADDRESS: string;
}

export interface AlpacaDep extends StrategyDep {
  INTEREST_MODEL_ADDRESS: string;
  FAIR_LAUNCH_V2_ADDRESS: string;
}

export interface BenqiDep extends StrategyDep {
  COMPTROLLER_ADDRESS: string;
}

export interface CompoundDep extends StrategyDep {
  COMPTROLLER_ADDRESS: string;
}

export interface CompoundV0Dep extends StrategyDep {
  COMPTROLLER_ADDRESS: string;
}

export interface DydxDep extends StrategyDep {
  SOLO_ADDRESS: string;
  CALCULATOR_ADDRESS: string;
}

export interface QubitDep extends StrategyDep {
  QORE_ADDRESS: string;
  QUBIT_LOCKER_ADDRESS: string;
  DASHBOARD_ADDRESS: string;
}

export interface RabbitDep extends StrategyDep {
  BANK_ADDRESS: string;
  BANK_CONFIG_ADDRESS: string;
  FAIRLAUNCH_ADDRESS: string;
}

export interface SushiDep extends StrategyDep {
  BENTOBOX_ADDRESS: string;
  MASTERKP_ADDRESS: string;
  CHEF_ADDRESS: string;
}

export interface VenusDep extends StrategyDep {
  UNITROLLER_ADDRESS: string;
}

export interface UniswapV2Path {
  [key: string]: string[];
}

export interface UniswapV3Path {
  [key: string]: string;
}

export interface UniswapV2Dep {
  UNISWAP_V2_ROUTER02_ADDRESS: string;
  UNISWAP_V2_FACTORY_ADDRESS: string;
  UNISWAP_V2_PATH?: UniswapV2Path;
}
export interface UniswapV3Dep {
  UNISWAP_V3_ROUTER_ADDRESS: string;
  UNISWAP_V3_FACTORY_ADDRESS: string;
  NON_FUNGIBLE_POSITION_MANAGER_ADDRESS: string;
  UNISWAP_V3_PATH?: UniswapV3Path;
}

export interface KyberDep {
  KYBER_ROUTER_ADDRESS: string;
  KYBER_FACTORY_ADDRESS: string;
}

export interface KyberAggregationDep {
  KYBER_AGGREGATION_ROUTER_ADDRESS?: string;
}
export interface DefenderRelayer {
  API_KEY: string;
  API_SECRET: string;
  RELAYER_ADDRESS: string;
  REBASE_AUTOTASK_ID: string;
  COLLECT_REWARD_AUTOTASK_ID: string;
}

const uniswapV3Dep: UniswapV3Dep = {
  UNISWAP_V3_ROUTER_ADDRESS: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
  UNISWAP_V3_FACTORY_ADDRESS: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
  NON_FUNGIBLE_POSITION_MANAGER_ADDRESS: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
};

const uniswapV2Dep: UniswapV2Dep = {
  UNISWAP_V2_ROUTER02_ADDRESS: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  UNISWAP_V2_FACTORY_ADDRESS: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
};

export interface DepositUnwinderDep {
  protocol: string;
  unwinderType: string;
  tokenInterface?: string;
}

// Trading paths for UniswapV3
const uniswapEthMainnetPath: UniswapV3Path = {
  // AAVE -> WETH -> USDT
  AAVE_USDT:
    "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9000bb8c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20001f4dac17f958d2ee523a2206206994597c13d831ec7",
  // AAVE -> WETH -> USDC
  AAVE_USDC:
    "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9000bb8c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20001f4a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  // AAVE -> WETH -> USDC -> BUSD
  AAVE_BUSD:
    "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9000bb8c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20001f4a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480001f44fabb145d64652a948d72533023f6e7a623c7c53",
  // COMP -> WETH -> USDT
  COMP_USDT:
    "0xc00e94cb662c3520282e6f5717214004a7f26888000bb8c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20001f4dac17f958d2ee523a2206206994597c13d831ec7",
  // COMP -> WETH -> USDT
  COMP_USDC:
    "0xc00e94cb662c3520282e6f5717214004a7f26888000bb8c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20001f4a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  SUSHI_USDT:
    "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2000bb8c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20001f4dac17f958d2ee523a2206206994597c13d831ec7",
  SUSHI_USDC:
    "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2000bb8c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20001f4a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  // WETH, 0.3%, USDT
  WETH_USDT: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2000bb8dAC17F958D2ee523a2206206994597C13D831ec7",
};

const uniswapEthRopstenPath: UniswapV3Path = {
  //pool: comp/eth 1% -> eth/usdt 0.3%
  COMP_USDT:
    "0xf76d4a441e4ba86a923ce32b89aff89dbccaa075002710c778417e063141139fce010982780140aa0cd5ab000bb8110a13fc3efe6a245b50102d2d79b3e76125ae83",
  //pool: comp/eth 1% -> eth/usdc 0.3%
  COMP_USDC:
    "0xf76d4a441e4ba86a923ce32b89aff89dbccaa075002710c778417e063141139fce010982780140aa0cd5ab000bb807865c6e87b9f70255377e024ace6630c1eaa37f",
};

const uniswapEthKovanPath: UniswapV3Path = {
  ////pool: comp/eth 0.3% -> eth/usdc 0.3%
  COMP_USDT:
    "0x61460874a7196d6a22d1ee4922473664b3e95270000bb8d0a1e359811322d97991e03f863a0c30c2cf029c000bb807de306ff27a2b630b1141956844eb1552b956b5",
  COMP_USDC:
    "0x61460874a7196d6a22d1ee4922473664b3e95270000bb8d0a1e359811322d97991e03f863a0c30c2cf029c0001f4b7a4f3e9097c08da09517b5ab877f7a917224ede",
};

// Trading paths for PancakeSwap and QuickSwap
const pancakeswapBscMainnetPath: UniswapV2Path = {
  XVS_USDC: [
    "0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63", // XVS
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // WBNB
    "0xe9e7cea3dedca5984780bafc599bd69add087d56", // BUSD
    "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", // USDC
  ],
  XVS_USDT: [
    "0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63", // XVS
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // WBNB
    "0x55d398326f99059ff775485246999027b3197955", // USDT
  ],
  XVS_BUSD: [
    "0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63", // XVS
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // WBNB
    "0xe9e7cea3dedca5984780bafc599bd69add087d56", // BUSD
  ],
  RABBIT_USDT: [
    "0x95a1199EBA84ac5f19546519e287d43D2F0E1b41", // RABBIT
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // WBNB
    "0x55d398326f99059fF775485246999027B3197955", // USDT
  ],
  RABBIT_BUSD: [
    "0x95a1199eba84ac5f19546519e287d43d2f0e1b41", // RABBIT
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // WBNB
    "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", // BUSD
  ],
  ALPACA_USDC: [
    "0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F", // ALPACA
    "0xe9e7cea3dedca5984780bafc599bd69add087d56", // BUSD
    "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", // USDC
  ],
  ALPACA_USDT: [
    "0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F", // ALPACA
    "0xe9e7cea3dedca5984780bafc599bd69add087d56", // BUSD
    "0x55d398326f99059ff775485246999027b3197955", // USDT
  ],
  ALPACA_BUSD: [
    "0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F", // ALPACA
    "0xe9e7cea3dedca5984780bafc599bd69add087d56", // BUSD
  ],
  QBT_USDT: [
    "0x17B7163cf1Dbd286E262ddc68b553D899B93f526", // QBT
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // WBNB
    "0x55d398326f99059fF775485246999027B3197955", // USDT
  ],
  QBT_USDC: [
    "0x17B7163cf1Dbd286E262ddc68b553D899B93f526", // QBT
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // WBNB
    "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", // USDC
  ],
  QBT_BUSD: [
    "0x17B7163cf1Dbd286E262ddc68b553D899B93f526", // QBT
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // WBNB
    "0xe9e7cea3dedca5984780bafc599bd69add087d56", // BUSD
  ],
};

// We haven't found RABBIT's testnet deployment yet!!
const pancakeswapBscTestnetPath: UniswapV2Path = {
  XVS_USDC: [
    "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff", // XVS
    "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd", // WBNB
    "0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47", // BUSD
    "0x16227d60f7a0e586c66b005219dfc887d13c9531", // USDC
  ],
  XVS_USDT: [
    "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff", // XVS
    "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd", // WBNB
    "0xA11c8D9DC9b66E209Ef60F0C8D969D3CD988782c", // USDT
  ],
  XVS_BUSD: [
    "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff", // XVS
    "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd", // WBNB
    "0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47", // BUSD
  ],
  ALPACA_USDC: [
    "0x354b3a11D5Ea2DA89405173977E271F58bE2897D", // ALPACA
    "0x0266693F9Df932aD7dA8a9b44C2129Ce8a87E81f", // BUSD
    "0x74E6d184A8cD7d43E9b2B46b66F6Eb92d36a768B", // USDC
  ],
  ALPACA_USDT: [
    "0x354b3a11D5Ea2DA89405173977E271F58bE2897D", // ALPACA
    "0x0266693F9Df932aD7dA8a9b44C2129Ce8a87E81f", // BUSD
    "0xE60Fa777dEb72C364447BB18C823C4731FbeD671", // USDT
  ],
  ALPACA_BUSD: [
    "0x354b3a11D5Ea2DA89405173977E271F58bE2897D", // ALPACA
    "0x0266693F9Df932aD7dA8a9b44C2129Ce8a87E81f", // BUSD
  ],
  QUBIT_USDT: [
    "0xF523e4478d909968090a232eB380E2dd6f802518", // QUBIT
    "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd", // WBNB
    "0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684", // USDT
  ],
  QUBIT_BUSD: [
    "0xF523e4478d909968090a232eB380E2dd6f802518", // QUBIT
    "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd", // WBNB
    "0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7", // BUSD
  ],
};

const quickSwapMaticMainnetPath: UniswapV2Path = {
  MATIC_USDC: [
    "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // WMATIC
    "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC
  ],
  MATIC_USDT: [
    "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // WMATIC
    "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // USDT
  ],
};

const pangolinSwapAvaxMainnetPath: UniswapV2Path = {
  "QI_USDC.e": [
    "0x8729438eb15e2c8b576fcc6aecda6a148776c0f5",
    "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664",
  ],
  "QI_USDT.e": [
    "0x8729438eb15e2c8b576fcc6aecda6a148776c0f5",
    "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
  ],
  QI_USDC: [
    "0x8729438eb15e2c8b576fcc6aecda6a148776c0f5",
    "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
  ],
  QI_USDt: [
    "0x8729438eb15e2c8b576fcc6aecda6a148776c0f5",
    "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
  ],
  "WAVAX_USDC.e": ["0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664"],
  "WAVAX_USDT.e": ["0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", "0xc7198437980c041c805A1EDcbA50c1Ce5db95118"],
  WAVAX_USDC: ["0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"],
  WAVAX_USDt: ["0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7"],
};

interface MultiSigWallets {
  [key: string]: string;
  OperationsSafe: string;
  UpgradesSafe: string;
  FlurrySafe: string;
}

interface ChainLinkDep {
  [key: string]: string;
}

interface ChainlinkKeeper {
  REGISTRY_ADDRESS: string;
  LINK_ADDRESS: string;
}

const ethMainnet: ExternalDependency = {
  chainId: 1,
  name: "ethMainnet",
  nativeSymbol: "ETH",
  wrappedNativeSymbol: "WETH",
  wrappedNativeAddr: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  blockTime: ETHMAINNET_BLOCK_TIME,
  blocksPerYear: Math.floor((365 * 86400) / ETHMAINNET_BLOCK_TIME),
  defaultExchange: "uniswapV2",
  underlying: {
    USDC: {
      ADDRESS: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      WHALE_ADDRESS: "0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503",
    },
    USDT: {
      ADDRESS: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      WHALE_ADDRESS: "0x5754284f345afc66a98fbb0a0afe71e0f007b949",
    },
    BUSD: {
      ADDRESS: "0x4Fabb145d64652a948d72533023f6E7A623C7C53",
      WHALE_ADDRESS: "0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503",
    },
  },
  tokens: {
    AAVE: {
      SYMBOL: "AAVE",
      ADDRESS: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
      WHALE_ADDRESS: "0xf81ccdc1ee8de3fbfa48a0714fc773022e4c14d7",
      EXCHANGE: "uniswapV3",
    },
    COMP: {
      SYMBOL: "COMP",
      ADDRESS: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
      WHALE_ADDRESS: "0x7587caefc8096f5f40acb83a09df031a018c66ec",
      EXCHANGE: "uniswapV3",
    },
    CREAM: {
      SYMBOL: "CREAM",
      ADDRESS: "0x2ba592F78dB6436527729929AAf6c908497cB200",
      WHALE_ADDRESS: "0x000000000000000000000000000000000000dEaD",
    },
    dYdX: {
      SYMBOL: "dYdX",
      ADDRESS: "0x92d6c1e31e14520e676a687f0a93788b716beff5",
      WHALE_ADDRESS: "0xf95746b2c3d120b78fd1cb3f9954cb451c2163e4",
    },
    SUSHI: {
      SYMBOL: "SUSHI",
      ADDRESS: "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
      WHALE_ADDRESS: "0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503",
      EXCHANGE: "uniswapV3",
    },
    xSUSHI: {
      SYMBOL: "xSUSHI",
      ADDRESS: "0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272",
    },
    WETH: {
      SYMBOL: "WETH",
      ADDRESS: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    RUNE: {
      SYMBOL: "RUNE",
      ADDRESS: "0x3155BA85D5F96b2d030a4966AF206230e46849cb",
    },
    WBTC: {
      SYMBOL: "WBTC",
      ADDRESS: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    },
    LINK: {
      SYMBOL: "LINK",
      ADDRESS: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    },
  },
  depositTokens: {
    aUSDT_v1: {
      SYMBOL: "aUSDT_v1",
      ADDRESS: "0x71fc860F7D3A592A4a98740e39dB31d25db65ae8",
    },
    aUSDC_v1: {
      SYMBOL: "aUSDC_v1",
      ADDRESS: "0x9bA00D6856a4eDF4665BcA2C2309936572473B7E",
    },
    aUSDT_v2: {
      SYMBOL: "aUSDT_v2",
      ADDRESS: "0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811",
    },
    aUSDC_v2: {
      SYMBOL: "aUSDC_v2",
      ADDRESS: "0xBcca60bB61934080951369a648Fb03DF4F96263C",
    },
    aBUSD_v2: {
      SYMBOL: "aBUSD_v2",
      ADDRESS: "0xA361718326c15715591c299427c62086F69923D9",
    },
    iUSDT: {
      SYMBOL: "iUSDT",
      ADDRESS: "0x7e9997a38A439b2be7ed9c9C4628391d3e055D48",
    },
    iUSDC: {
      SYMBOL: "iUSDC",
      ADDRESS: "0x32E4c68B3A4a813b710595AebA7f6B7604Ab9c15",
    },
    cUSDT: {
      SYMBOL: "cUSDT",
      ADDRESS: "0xf650C3d88D12dB855b8bf7D11Be6C55A4e07dCC9",
    },
    cUSDC: {
      SYMBOL: "cUSDC",
      ADDRESS: "0x39AA39c021dfbaE8faC545936693aC917d5E7563",
    },
    crUSDT: {
      SYMBOL: "crUSDT",
      ADDRESS: "0x797aab1ce7c01eb727ab980762ba88e7133d2157",
    },
    crUSDC: {
      SYMBOL: "crUSDC",
      ADDRESS: "0x44fbebd2f576670a6c33f6fc0b00aa8c5753b322",
    },
    crBUSD: {
      SYMBOL: "crBUSD",
      ADDRESS: "0x1FF8CDB51219a8838b52E9cAc09b71e591BC998e",
    },
    "kmxSUSHI/USDT-LINK": {
      SYMBOL: "kmxSUSHI/USDT-LINK",
      ADDRESS: "0x17Fb5f39C55903DE60E63543067031cE2B2659EE",
      WHALE_ADDRESS: "0x0b152d7b2c1b04b8d42672be3bca3c3c56402e1f",
      PID: 249,
      COLLATERAL_SYMBOL: "xSUSHI",
    },
    "kmWETH/USDT-LINK": {
      SYMBOL: "kmWETH/USDT-LINK",
      ADDRESS: "0xfF7D29c7277D8A8850c473f0b71d7e5c4Af45A50",
      WHALE_ADDRESS: "0xb18ea8ab076c70026d01b4c273a28b53aa6e6bd0",
      PID: 190,
      COLLATERAL_SYMBOL: "WETH",
    },
    "kmRUNE/USDT-LINK": {
      SYMBOL: "kmRUNE/USDT-LINK",
      ADDRESS: "0xDf55bD0a205ec067aB1CaCfaeef708cF1d93ECfd",
      WHALE_ADDRESS: "0x3155BA85D5F96b2d030a4966AF206230e46849cb",
      PID: 226,
      COLLATERAL_SYMBOL: "RUNE",
    },
    "kmWBTC/USDT-LINK": {
      SYMBOL: "kmWBTC/USDT-LINK",
      ADDRESS: "0xf678B4A096bB49309b81B2a1c8a966Ef5F9756BA",
      WHALE_ADDRESS: "0xe8fb4d01eb775d782300d47ed7e09996490ca917",
      PID: 193,
      COLLATERAL_SYMBOL: "WBTC",
    },
    "kmLINK/USDT-LINK": {
      SYMBOL: "kmLINK/USDT-LINK",
      ADDRESS: "0xC84Fb1F76cbdd3b3491E81FE3ff811248d0407e9",
      WHALE_ADDRESS: "0xc05a2ce0f6ad14fd8bbe6acd12439fa8daa8bb9d",
      PID: 196,
      COLLATERAL_SYMBOL: "LINK",
    },
    "kmxSUSHI/USDC-LINK": {
      SYMBOL: "kmxSUSHI/USDC-LINK",
      ADDRESS: "0x6EAFe077df3AD19Ade1CE1abDf8bdf2133704f89",
      PID: 247,
      COLLATERAL_SYMBOL: "xSUSHI",
    },
    "kmWETH/USDC-LINK": {
      SYMBOL: "kmWETH/USDC-LINK",
      ADDRESS: "0xB7b45754167d65347C93F3B28797887b4b6cd2F3",
      WHALE_ADDRESS: "0x6dd76c57fa2cdd027c4dce8b62ffbbbb08f01849",
      PID: 191,
      COLLATERAL_SYMBOL: "WETH",
    },
    "kmLINK/USDC-LINK": {
      SYMBOL: "kmLINK/USDC-LINK",
      ADDRESS: "0x4f68e70e3a5308d759961643AfcadfC6f74B30f4",
      WHALE_ADDRESS: "0x4393b9c542bf79e5235180d6da1915c0f9bc02c3",
      PID: 198,
      COLLATERAL_SYMBOL: "LINK",
    },
  },
  AaveV1: {
    USDT: "aUSDT_v1",
    USDC: "aUSDC_v1",
    BonusTokens: [],
    LENDING_POOL_ADDRESSES_PROVIDER_ADDRESS: "0x24a42fD28C976A61Df5D00D0599C34c4f90748c8",
  },
  AaveV2: {
    USDT: "aUSDT_v2",
    USDC: "aUSDC_v2",
    BUSD: "aBUSD_v2",
    BonusTokens: ["AAVE"],
    STKAAVE_ADDRESS: "0x4da27a545c0c5B758a6BA100e3a049001de870f5",
    PROTOCOL_DATA_PROVIDER_ADDRESS: "0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d",
  },
  BZx: {
    USDT: "iUSDT",
    USDC: "iUSDC",
    BonusTokens: [],
  },
  Compound: {
    USDT: "cUSDT",
    USDC: "cUSDC",
    BonusTokens: ["COMP"],
    COMPTROLLER_ADDRESS: "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B",
  },
  Cream: {
    USDT: "crUSDT",
    USDC: "crUSDC",
    BUSD: "crBUSD",
    BonusTokens: [],
  },
  Dydx: {
    // USDC: {},
    BonusTokens: [],
    SOLO_ADDRESS: "0x1E0447b19BB6EcFdAe1e4AE1694b0C3659614e4e",
    CALCULATOR_ADDRESS: "0x0eED07cED0C8c36D4a5bfF44F2536422Bb09BE45",
  },
  Sushi: {
    USDT: ["kmxSUSHI/USDT-LINK", "kmWETH/USDT-LINK", "kmRUNE/USDT-LINK", "kmWBTC/USDT-LINK", "kmLINK/USDT-LINK"],
    USDC: ["kmxSUSHI/USDC-LINK", "kmWETH/USDC-LINK", "kmLINK/USDC-LINK"],
    BonusTokens: ["SUSHI"],
    BENTOBOX_ADDRESS: "0xF5BCE5077908a1b7370B9ae04AdC565EBd643966",
    MASTERKP_ADDRESS: "0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42",
    CHEF_ADDRESS: "0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd",
  },
  uniswapV2: uniswapV2Dep,
  uniswapV3: {
    UNISWAP_V3_ROUTER_ADDRESS: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    UNISWAP_V3_FACTORY_ADDRESS: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    NON_FUNGIBLE_POSITION_MANAGER_ADDRESS: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
    UNISWAP_V3_PATH: uniswapEthMainnetPath,
  },
  kyber: {
    KYBER_ROUTER_ADDRESS: "0x1c87257F5e8609940Bc751a07BB085Bb7f8cDBE6",
    KYBER_FACTORY_ADDRESS: "0x833e4083B7ae46CeA85695c4f7ed25CDAd8886dE",
  },
  kyberAggregation: {
    KYBER_AGGREGATION_ROUTER_ADDRESS: undefined,
  },
  chainlink: {
    ETHUSD_PRICE_FEED_ADDRESS: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    USDCETH_PRICE_FEED_ADDRESS: "0x986b5E1e1755e3C2440e960477f25201B0a8bbD4",
    USDTETH_PRICE_FEED_ADDRESS: "0xEe9F2375b4bdF6387aa8265dD4FB8F16512A1d46",
    BUSDETH_PRICE_FEED_ADDRESS: "0x614715d2Af89E6EC99A233818275142cE88d1Cfd",
    DAIETH_PRICE_FEED_ADDRESS: "0x773616E4d11A78F511299002da57A0a94577F1f4",
    USDCUSD_PRICE_FEED_ADDRESS: "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6",
    USDTUSD_PRICE_FEED_ADDRESS: "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D",
    BUSDUSD_PRICE_FEED_ADDRESS: "0x833D8Eb16D306ed1FbB5D7A2E019e106B960965A",
    AAVEUSD_PRICE_FEED_ADDRESS: "0x547a514d5e3769680Ce22B2361c10Ea13619e8a9",
    COMPUSD_PRICE_FEED_ADDRESS: "0xdbd020CAeF83eFd542f4De03e3cF0C28A4428bd5",
    SUSHIUSD_PRICE_FEED_ADDRESS: "0xCc70F09A6CC17553b2E31954cD36E4A2d89501f7",
  },
  keeper: {
    REGISTRY_ADDRESS: "0x7b3EC232b08BD7b4b3305BE0C044D907B2DF960B",
    LINK_ADDRESS: "0x514910771af9ca656af840dff83e8264ecf986ca",
  },
  safes: {
    OperationsSafe: process.env.ETH_MAINNET_OPERATIONS_SAFE!,
    UpgradesSafe: process.env.ETH_MAINNET_UPGRADES_SAFE!,
    FlurrySafe: process.env.ETH_MAINNET_FLURRY_SAFE!,
  },
  multicall: "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
  strategies: [
    "AaveV2",
    // "BZx", // bZx will be rebranded to OOKI
    "Compound",
    // "Cream", Cream is disabled currently
    // "Dydx", // dYdX is disabled currently
    // "Sushi", // Sushi release is put on hold until we have a better rebalance algo
  ],
  depositUnwinders: [
    // "AaveV2",
    // "BZx", // bZx will be rebranded to OOKI
    // "Compound",
    // "Cream", // Cream is disabled currently
    // "Dydx", // dYdX is disabled currently
    // "Sushi", // Sushi release is put on hold until we have a better rebalance algo
  ],
};

const ethRopsten: ExternalDependency = {
  chainId: 3,
  name: "ethRopsten",
  nativeSymbol: "ETH",
  wrappedNativeSymbol: "WETH",
  wrappedNativeAddr: "0xc778417e063141139fce010982780140aa0cd5ab",
  blockTime: ETHROPSTEN_BLOCK_TIME,
  blocksPerYear: Math.floor((365 * 86400) / ETHROPSTEN_BLOCK_TIME),
  defaultExchange: "uniswapV2",
  underlying: {
    USDC: {
      ADDRESS: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
      WHALE_ADDRESS: "0x75c0c372da875a4fc78e8a37f58618a6d18904e8",
    },
    USDT: {
      ADDRESS: "0x110a13FC3efE6A245B50102D2d79B3E76125Ae83",
      WHALE_ADDRESS: "0x046231a12d30248bad3322af74cea9c325627d32",
    },
  },
  tokens: {
    COMP: {
      SYMBOL: "COMP",
      ADDRESS: "0xf76D4a441E4ba86A923ce32B89AFF89dBccAA075",
      WHALE_ADDRESS: "0x046231a12d30248bad3322af74cea9c325627d32",
      EXCHANGE: "uniswapV3",
    },
  },
  depositTokens: {
    cUSDT: {
      SYMBOL: "cUSDT",
      ADDRESS: "0xF6958Cf3127e62d3EB26c79F4f45d3F3b2CcdeD4",
    },
    cUSDC: {
      SYMBOL: "cUSDC",
      ADDRESS: "0x2973e69b20563bcc66dC63Bde153072c33eF37fe",
    },
  },
  Compound: {
    USDT: "cUSDT",
    USDC: "cUSDC",
    BonusTokens: ["COMP"],
    COMPTROLLER_ADDRESS: "0xcfa7b0e37f5AC60f3ae25226F5e39ec59AD26152",
  },
  uniswapV2: uniswapV2Dep,
  uniswapV3: {
    UNISWAP_V3_ROUTER_ADDRESS: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    UNISWAP_V3_FACTORY_ADDRESS: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    NON_FUNGIBLE_POSITION_MANAGER_ADDRESS: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
    UNISWAP_V3_PATH: uniswapEthRopstenPath,
  },
  kyber: {
    KYBER_ROUTER_ADDRESS: "0x96E8B9E051c81661C36a18dF64ba45F86AC80Aae",
    KYBER_FACTORY_ADDRESS: "0x0639542A5cd99Bd5F4e85F58CB1F61D8Fbe32dE9",
  },
  kyberAggregation: {
    KYBER_AGGREGATION_ROUTER_ADDRESS: undefined,
  },
  chainlink: {
    USDCETH_PRICE_FEED_ADDRESS: "0x8a02feDAdfDD57e42A6f26E6ba8a3aF084824691", // mock
    USDTETH_PRICE_FEED_ADDRESS: "0x8a02feDAdfDD57e42A6f26E6ba8a3aF084824691", // copy USDC / ETH
    USDCUSD_PRICE_FEED_ADDRESS: "0xce91cDf34aAC63eAF76A32aD1e2eB738BFf424eD", // mock
    USDTUSD_PRICE_FEED_ADDRESS: "0xce91cDf34aAC63eAF76A32aD1e2eB738BFf424eD", // same as above
    COMPUSD_PRICE_FEED_ADDRESS: "0xe4582CEBA2dbA22BD67C0c5f946911e8cB7C756C", // mock
    ETHUSD_PRICE_FEED_ADDRESS: "0x864D056a07aB8db10fb980a4aEc96477A98c2B66", // mock pending
  },
  // safes: {
  //   OperationsSafe: "0x54996883Ae95989470990B4ECfC82D4AC2D65Bd8",
  //   UpgradesSafe: "0x8377aD0eB5D0319d2A5109efA2e4238A681FD22c",
  //   FlurrySafe: "0x3A48d95d0290b333183Da5c3A461646c32Ae5A53",
  // },
  multicall: "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
  relayer: {
    API_KEY: "AGCo2JXFVDF2tCAyW3fhhP8YbapHizz3",
    API_SECRET: process.env.DEFENDER_RELAYER_ETH_ROPSTEN_API_SECRET!,
    RELAYER_ADDRESS: process.env.DEFENDER_RELAYER_ETH_ROPSTEN_ADDRESS!,
    REBASE_AUTOTASK_ID: "072b8607-6eb3-49a5-bab3-26ea30dd73ad",
    COLLECT_REWARD_AUTOTASK_ID: "fa067195-8955-48c8-8532-bb3b1e927f68",
  },
  strategies: ["Compound"],
  depositUnwinders: [],
};

const ethRinkeby: ExternalDependency = {
  chainId: 4,
  name: "ethRinkeby",
  nativeSymbol: "ETH",
  wrappedNativeSymbol: "WETH",
  wrappedNativeAddr: "0xc778417e063141139fce010982780140aa0cd5ab",
  blockTime: ETHRINKEBY_BLOCK_TIME,
  blocksPerYear: Math.floor((365 * 86400) / ETHRINKEBY_BLOCK_TIME),
  defaultExchange: "uniswapV2",
  underlying: {
    // delete USDC because Compound's cUSDC interest rate model is not queryable
    USDT: {
      ADDRESS: "0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02",
      WHALE_ADDRESS: "0xe93b6bd33cff0fb73d0213e1c4ad0812d2431c6d",
    },
  },
  tokens: {},
  depositTokens: {
    cUSDT: {
      SYMBOL: "cUSDT",
      ADDRESS: "0x2fB298BDbeF468638AD6653FF8376575ea41e768",
    },
  },
  CompoundV0: {
    USDT: "cUSDT",
    BonusTokens: [],
    COMPTROLLER_ADDRESS: "0x2EAa9D77AE4D8f9cdD9FAAcd44016E746485bddb",
  },
  uniswapV2: uniswapV2Dep,
  chainlink: {
    USDTETH_PRICE_FEED_ADDRESS: "0xdCA36F27cbC4E38aE16C4E9f99D39b42337F6dcf", // copy USDC / ETH
    DAIETH_PRICE_FEED_ADDRESS: "0x74825DbC8BF76CC4e9494d0ecB210f676Efa001D",
    USDTUSD_PRICE_FEED_ADDRESS: "0xa24de01df22b63d23Ebc1882a5E3d4ec0d907bFB", // copy USDC / ETH
    ETHUSD_PRICE_FEED_ADDRESS: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
  },
  safes: {
    FlurrySafe: "0x165f65Dec59A285084D9Cb5B476e4909AFaee5eC",
    OperationsSafe: "0x7C0380701B31a3EBa37eB4555c5D924cA527b175",
    UpgradesSafe: "0x36824793440d1AB326b9B5634418393D5f5E30A3",
  },
  multicall: "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
  strategies: ["CompoundV0"],
  depositUnwinders: [],
};

const ethKovan: ExternalDependency = {
  chainId: 42,
  name: "ethKovan",
  nativeSymbol: "ETH",
  wrappedNativeSymbol: "WETH",
  wrappedNativeAddr: "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
  blockTime: ETHKOVAN_BLOCK_TIME,
  blocksPerYear: Math.floor((365 * 86400) / ETHKOVAN_BLOCK_TIME),
  defaultExchange: "uniswapV2",
  underlying: {
    USDC: {
      ADDRESS: "0xb7a4F3E9097C08dA09517b5aB877F7a917224ede",
      WHALE_ADDRESS: "0xd04fD1CdA37f81bc0B46b5DcAdfA00c239191988",
    },
    USDT: {
      ADDRESS: "0x07de306FF27a2B630B1141956844eB1552B956B5",
      WHALE_ADDRESS: "0xA776184Fd6F545DAe5f51361dBcC9018549a9749",
    },
  },
  tokens: {
    COMP: {
      SYMBOL: "COMP",
      ADDRESS: "0x61460874a7196d6a22D1eE4922473664b3E95270",
      WHALE_ADDRESS: "0xa776184fd6f545dae5f51361dbcc9018549a9749",
      EXCHANGE: "uniswapV3",
    },
  },
  depositTokens: {
    cUSDT: {
      SYMBOL: "cUSDT",
      ADDRESS: "0x3f0A0EA2f86baE6362CF9799B523BA06647Da018",
    },
    cUSDC: {
      SYMBOL: "cUSDC",
      ADDRESS: "0x4a92E71227D294F041BD82dd8f78591B75140d63",
    },
  },
  Compound: {
    USDT: "cUSDT",
    USDC: "cUSDC",
    BonusTokens: ["COMP"],
    COMPTROLLER_ADDRESS: "0x5eAe89DC1C671724A672ff0630122ee834098657",
  },
  // aave_v1: {
  //   LENDING_POOL_ADDRESSES_PROVIDER_ADDRESS: "0x506B0B2CF20FAA8f38a4E2B524EE43e1f4458Cc5",
  //   AAVE_ADDRESS: "0xB597cd8D3217ea6477232F9217fa70837ff667Af", // same as v2
  //   STKAAVE_ADDRESS: "0xf2fbf9A6710AfDa1c4AaB2E922DE9D69E0C97fd2", // same as v2
  //   AUSDC_V1_ADDRESS: "0x02F626c6ccb6D2ebC071c068DC1f02Bf5693416a",
  //   AUSDT_V1_ADDRESS: "0xA01bA9fB493b851F4Ac5093A324CB081A909C34B",
  // },
  // aave_v2: {
  //   PROTOCOL_DATA_PROVIDER_ADDRESS: "0x3c73A5E5785cAC854D468F727c606C07488a29D6",
  //   AAVE_ADDRESS: "0xB597cd8D3217ea6477232F9217fa70837ff667Af", // same as v1
  //   STKAAVE_ADDRESS: "0xf2fbf9A6710AfDa1c4AaB2E922DE9D69E0C97fd2", // same as v1
  //   AUSDC_V2_ADDRESS: "0xe12AFeC5aa12Cf614678f9bFeeB98cA9Bb95b5B0", // changes frequently, re-fetch if use
  //   AUSDT_V2_ADDRESS: "0xFF3c8bc103682FA918c954E84F5056aB4DD5189d", // changes frequently, re-fetch if use
  //   ABUSD_V2_ADDRESS: "0xfe3E41Db9071458e39104711eF1Fa668bae44e85", // changes frequently, re-fetch if use
  // },
  uniswapV2: uniswapV2Dep,
  uniswapV3: {
    UNISWAP_V3_ROUTER_ADDRESS: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    UNISWAP_V3_FACTORY_ADDRESS: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    NON_FUNGIBLE_POSITION_MANAGER_ADDRESS: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
    UNISWAP_V3_PATH: uniswapEthKovanPath,
  },
  chainlink: {
    USDCETH_PRICE_FEED_ADDRESS: "0x64EaC61A2DFda2c3Fa04eED49AA33D021AeC8838",
    USDTETH_PRICE_FEED_ADDRESS: "0x0bF499444525a23E7Bb61997539725cA2e928138",
    BUSDETH_PRICE_FEED_ADDRESS: "0xbF7A18ea5DE0501f7559144e702b29c55b055CcB",
    DAIETH_PRICE_FEED_ADDRESS: "0x22B58f1EbEDfCA50feF632bD73368b2FdA96D541",
    USDCUSD_PRICE_FEED_ADDRESS: "0x9211c6b3BF41A10F78539810Cf5c64e1BB78Ec60",
    USDTUSD_PRICE_FEED_ADDRESS: "0x2ca5A90D34cA333661083F89D831f757A9A50148",
    BUSDUSD_PRICE_FEED_ADDRESS: "", // no "BUSD / USD", pending for mock aggregator
    AAVEUSD_PRICE_FEED_ADDRESS: "0x1ad1FFFd6c07d4c3C89226bb33A2cD95Ad58912d", // mock
    // AAVEETH_PRICE_FEED_ADDRESS: "0xd04647B7CB523bb9f26730E9B6dE1174db7591Ad", // unused now
    COMPUSD_PRICE_FEED_ADDRESS: "0xECF93D14d25E02bA2C13698eeDca9aA98348EFb6",
    ETHUSD_PRICE_FEED_ADDRESS: "0x9326BFA02ADD2366b30bacB125260Af641031331",
  },
  keeper: {
    REGISTRY_ADDRESS: "0x4Cb093f226983713164A62138C3F718A5b595F73",
    LINK_ADDRESS: "0xa36085F69e2889c224210F603D836748e7dC0088",
  },
  safes: {
    OperationsSafe: "0xe0a0D0081BA638E2C95eB34f2bc949E70ea12Ecb",
    UpgradesSafe: "0xd47c47acA9EA4d7F4c9c7E629A35B8A61815B1D0",
    FlurrySafe: "0xFaDFF26d4B95a59FF2Fc227906AD619b5406e628",
  },
  multicall: "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
  strategies: [
    // 'AaveV1',
    "Compound",
  ],
  depositUnwinders: [],
};

const ethGoerli: ExternalDependency = {
  chainId: 5,
  name: "ethGoerli",
  nativeSymbol: "ETH",
  wrappedNativeSymbol: "WETH",
  wrappedNativeAddr: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
  blockTime: ETHGOERLI_BLOCK_TIME,
  blocksPerYear: Math.floor((365 * 86400) / ETHGOERLI_BLOCK_TIME),
  defaultExchange: "uniswapV2",
  underlying: {
    USDC: {
      ADDRESS: "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C",
      WHALE_ADDRESS: "	0x204960300ec862d4ff95c15698dabdd6fbf51edd",
    },
  },
  tokens: {},
  depositTokens: {
    cUSDC: {
      SYMBOL: "cUSDC",
      ADDRESS: "0xCEC4a43eBB02f9B80916F1c718338169d6d5C1F0",
    },
  },
  CompoundV0: {
    USDC: "cUSDC",
    BonusTokens: [],
    COMPTROLLER_ADDRESS: "0x627EA49279FD0dE89186A58b8758aD02B6Be2867",
  },
  uniswapV2: uniswapV2Dep,
  chainlink: {
    USDCETH_PRICE_FEED_ADDRESS: "0x840dF69dA931b439d751a8038eA826E3b9353c8d", // mock
    USDTETH_PRICE_FEED_ADDRESS: "0x840dF69dA931b439d751a8038eA826E3b9353c8d", // same as above
    USDCUSD_PRICE_FEED_ADDRESS: "0x6E3c13C57a09391f00EC1F440E64796B714901a5", // mock
    USDTUSD_PRICE_FEED_ADDRESS: "0x6E3c13C57a09391f00EC1F440E64796B714901a5", // same as above
    COMPUSD_PRICE_FEED_ADDRESS: "0x69A861b03882CB504212CA307617141000BB7fF6", // mock
    ETHUSD_PRICE_FEED_ADDRESS: "0x3B37526D97461924227b788E70E35d1028F2657c", // mock
  },
  safes: {
    OperationsSafe: "0xED7e330ec63d66EDa6A8Ac772bEd0416214c76C3",
    UpgradesSafe: "0x8501A72c7368FdEFBBcD6febE7f6Db2867396f1e",
    FlurrySafe: "0xE3ecEF0C4F60562cC7ED6dDf54B8ac6Ca7c95c70",
  },
  multicall: "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
  strategies: [],
  depositUnwinders: [],
};

const bscMainnet: ExternalDependency = {
  chainId: 56,
  name: "bscMainnet",
  nativeSymbol: "BNB",
  wrappedNativeSymbol: "WBNB",
  wrappedNativeAddr: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  blockTime: BSCMAINNET_BLOCK_TIME,
  blocksPerYear: Math.floor((365 * 86400) / BSCMAINNET_BLOCK_TIME),
  defaultExchange: "uniswapV2",
  underlying: {
    USDC: {
      ADDRESS: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      WHALE_ADDRESS: "0xf977814e90da44bfa03b6295a0616a897441acec",
    },
    USDT: {
      ADDRESS: "0x55d398326f99059ff775485246999027b3197955",
      WHALE_ADDRESS: "0xefdca55e4bce6c1d535cb2d0687b5567eef2ae83",
    },
    BUSD: {
      ADDRESS: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
      WHALE_ADDRESS: "0x8894E0a0c962CB723c1976a4421c95949bE2D4E3",
    },
  },
  tokens: {
    ALPACA: {
      SYMBOL: "ALPACA",
      ADDRESS: "0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F",
      WHALE_ADDRESS: "0x000000000000000000000000000000000000dEaD",
      EXCHANGE: "uniswapV2",
    },
    CREAM: {
      ADDRESS: "0xd4CB328A82bDf5f03eB737f37Fa6B370aef3e888",
      WHALE_ADDRESS: "0xF977814e90dA44bFA03b6295A0616a897441aceC",
    },
    RABBIT: {
      SYMBOL: "RABBIT",
      ADDRESS: "0x95a1199EBA84ac5f19546519e287d43D2F0E1b41",
      WHALE_ADDRESS: "0xE3893e482583104408d81756bB2d0Af1dD9c720C",
      EXCHANGE: "uniswapV2",
      NATIVE_PAIR: "0x04b56A5B3f45CFeaFbfDCFc999c14be5434f2146",
    },
    XVS: {
      SYMBOL: "XVS",
      ADDRESS: "0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63",
      WHALE_ADDRESS: "0xF977814e90dA44bFA03b6295A0616a897441aceC",
      EXCHANGE: "uniswapV2",
    },
    QBT: {
      SYMBOL: "QBT",
      ADDRESS: "0x17b7163cf1dbd286e262ddc68b553d899b93f526",
      WHALE_ADDRESS: "0xb56290befc4216dc2a526a9022a76a1e4fdf122b",
      NATIVE_PAIR: "0x67EFeF66A55c4562144B9AcfCFbc62F9E4269b3e",
      EXCHANGE: "uniswapV2",
    },
    WETH: {
      SYMBOL: "WETH",
      ADDRESS: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
    },
  },
  depositTokens: {
    vUSDT: {
      SYMBOL: "vUSDT",
      ADDRESS: "0xfD5840Cd36d94D7229439859C0112a4185BC0255",
      WHALE_ADDRESS: "0xf977814e90da44bfa03b6295a0616a897441acec",
    },
    vUSDC: {
      SYMBOL: "vUSDC",
      ADDRESS: "0xecA88125a5ADbe82614ffC12D0DB554E2e2867C8",
      WHALE_ADDRESS: "0x8fe02faff19c88c5b62c8aad0307b37596bfa5c3",
    },
    vBUSD: {
      SYMBOL: "vBUSD",
      ADDRESS: "0x95c78222B3D6e262426483D42CfA53685A67Ab9D",
      WHALE_ADDRESS: "0xf977814e90da44bfa03b6295a0616a897441acec",
    },
    ibUSDT: {
      SYMBOL: "ibUSDT",
      ADDRESS: "0xFE1622F9F594A113cd3C1A93F7F6B0d3C0588781",
      WHALE_ADDRESS: "0xe4b5b2667e049ac8c79ae6c5a7e3300815aa32be",
      PID: 2,
    },
    ibBUSD: {
      SYMBOL: "ibBUSD",
      ADDRESS: "0xE0d1130Def49C29A4793De52eac680880Fc7cB70",
      WHALE_ADDRESS: "0x0def7def5d7686fecb60318158e515d01ec14ba6",
      PID: 1,
    },
    crUSDT: {
      SYMBOL: "crUSDT",
      ADDRESS: "0xEF6d459FE81C3Ed53d292c936b2df5a8084975De",
      WHALE_ADDRESS: "0x2c78b4b5e40f78f5bfa6fce0b277d2c59ccf8545",
    },
    crUSDC: {
      SYMBOL: "crUSDC",
      ADDRESS: "0xd83c88db3a6ca4a32fff1603b0f7ddce01f5f727",
      WHALE_ADDRESS: "0xf977814e90da44bfa03b6295a0616a897441acec",
    },
    crBUSD: {
      SYMBOL: "crBUSD",
      ADDRESS: "0x2bc4eb013ddee29d37920938b96d353171289b7c",
      WHALE_ADDRESS: "0x108a8b7200d044bbbe95bef6f671baec5473e05f",
    },
    iUSDT: {
      SYMBOL: "iUSDT",
      ADDRESS: "0xf326b42A237086F1De4E7D68F2d2456fC787bc01",
    },
    iBUSD: {
      SYMBOL: "iBUSD",
      ADDRESS: "0xf326b42A237086F1De4E7D68F2d2456fC787bc01",
    },
    aibUSDT: {
      SYMBOL: "aibUSDT",
      ADDRESS: "0x158Da805682BdC8ee32d52833aD41E74bb951E59",
      WHALE_ADDRESS: "0x00070cc274937836a40b4b25bc8c87ee4b12d63d",
      PID: 16,
    },
    aibUSDC: {
      SYMBOL: "aibUSDC",
      ADDRESS: "0x800933D685E7Dc753758cEb77C8bd34aBF1E26d7",
      WHALE_ADDRESS: "0xf40C2fA57A147ce4662f730497e5bc0C20Fd313f", // little balance due to initial launch
      PID: 24,
    },
    aibBUSD: {
      SYMBOL: "aibBUSD",
      ADDRESS: "0x7C9e73d4C71dae564d41F78d56439bB4ba87592f",
      WHALE_ADDRESS: "0x25cd8fddaa1d966768794590428a0e5891fb036f",
      PID: 3,
    },
    qUSDT: {
      SYMBOL: "qUSDT",
      ADDRESS: "0x99309d2e7265528dC7C3067004cC4A90d37b7CC3",
    },
    qUSDC: {
      SYMBOL: "qUSDC",
      ADDRESS: "0x1dd6E079CF9a82c91DaF3D8497B27430259d32C2",
    },
    qBUSD: {
      SYMBOL: "qBUSD",
      ADDRESS: "0xa3A155E76175920A40d2c8c765cbCB1148aeB9D1",
    },
    "kmETH/USDC-LINK": {
      SYMBOL: "kmETH/USDC-LINK",
      ADDRESS: "0x591f6fd601dad61b9565a7896977baf69aa403c2",
      WHALE_ADDRESS: "0x59e4352415cf402a912111dd248590c14b0d7c8d",
      COLLATERAL_SYMBOL: "WETH",
    },
    "kmWBNB/BUSD-LINK": {
      SYMBOL: "kmWBNB/BUSD-LINK",
      ADDRESS: "0xafa2526f518956a1fe1ff6f3aef9a90007a64052",
      WHALE_ADDRESS: "0x298edb6b8312a2730d9f15ff7baf95a87f4f320d",
      COLLATERAL_SYMBOL: "WBNB",
    },
  },
  Alpaca: {
    USDT: "aibUSDT",
    USDC: "aibUSDC",
    BUSD: "aibBUSD",
    BonusTokens: ["ALPACA"],
    INTEREST_MODEL_ADDRESS: "0xADcfBf2e8470493060FbE0A0aFAC66d2cB028e9c",
    FAIR_LAUNCH_V2_ADDRESS: "0xA625AB01B08ce023B2a342Dbb12a16f2C8489A8F",
  },
  BZx: {
    USDT: "iUSDT",
    BUSD: "iBUSD",
    BonusTokens: [],
  },
  Cream: {
    USDT: "crUSDT",
    USDC: "crUSDC",
    BUSD: "crBUSD",
    BonusTokens: [],
  },
  Qubit: {
    USDT: "qUSDT",
    USDC: "qUSDC",
    BUSD: "qBUSD",
    BonusTokens: ["QBT"],
    QORE_ADDRESS: "0xF70314eb9c7Fe7D88E6af5aa7F898b3A162dcd48",
    QUBIT_LOCKER_ADDRESS: "0xB8243be1D145a528687479723B394485cE3cE773",
    DASHBOARD_ADDRESS: "0x3BF0EbF0B846Fff73Df543bACacC542A6CE9fc15",
  },
  Rabbit: {
    USDT: "ibUSDT",
    BUSD: "ibBUSD",
    BonusTokens: ["RABBIT"],
    BANK_ADDRESS: "0xc18907269640D11E2A91D7204f33C5115Ce3419e",
    BANK_CONFIG_ADDRESS: "0x4e022ad93f05c942b68b89387f546b85fe53a8e8",
    FAIRLAUNCH_ADDRESS: "0x5ABd28694EDBD546247C2547738076a128cA1157",
  },
  Sushi: {
    USDC: ["kmETH/USDC-LINK"],
    BUSD: ["kmWBNB/BUSD-LINK", "kmWBNB/BUSD-LINK"],
    BonusTokens: [],
    BENTOBOX_ADDRESS: "0xF5BCE5077908a1b7370B9ae04AdC565EBd643966",
    MASTERKP_ADDRESS: "0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42",
    CHEF_ADDRESS: "0x0000000000000000000000000000000000000000",
  },
  Venus: {
    USDT: "vUSDT",
    USDC: "vUSDC",
    BUSD: "vBUSD",
    BonusTokens: ["XVS"],
    UNITROLLER_ADDRESS: "0xfD36E2c2a6789Db23113685031d7F16329158384",
  },
  uniswapV2: {
    UNISWAP_V2_ROUTER02_ADDRESS: "0x10ED43C718714eb63d5aA57B78B54704E256024E", // pancakeswap
    UNISWAP_V2_FACTORY_ADDRESS: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73", // pancakeswap
    UNISWAP_V2_PATH: pancakeswapBscMainnetPath, // pancakeswap, path hard-coded
  },
  kyber: {
    KYBER_ROUTER_ADDRESS: "0x78df70615ffc8066cc0887917f2Cd72092C86409",
    KYBER_FACTORY_ADDRESS: "0x878dFE971d44e9122048308301F540910Bbd934c",
  },
  kyberAggregation: {
    KYBER_AGGREGATION_ROUTER_ADDRESS: "0xDF1A1b60f2D438842916C0aDc43748768353EC25",
  },
  chainlink: {
    USDCBNB_PRICE_FEED_ADDRESS: "0x45f86CA2A8BC9EBD757225B19a1A0D7051bE46Db",
    USDTBNB_PRICE_FEED_ADDRESS: "0xD5c40f5144848Bd4EF08a9605d860e727b991513",
    BUSDBNB_PRICE_FEED_ADDRESS: "0x87Ea38c9F24264Ec1Fff41B04ec94a97Caf99941",
    USDCUSD_PRICE_FEED_ADDRESS: "0x51597f405303C4377E36123cBc172b13269EA163",
    USDTUSD_PRICE_FEED_ADDRESS: "0xB97Ad0E74fa7d920791E90258A6E2085088b4320",
    BUSDUSD_PRICE_FEED_ADDRESS: "0xcBb98864Ef56E9042e7d2efef76141f15731B82f",
    XVSUSD_PRICE_FEED_ADDRESS: "0xBF63F430A79D4036A5900C19818aFf1fa710f206",
    ALPACAUSD_PRICE_FEED_ADDRESS: "0xe0073b60833249ffd1bb2af809112c2fbf221DF6",
    BNBUSD_PRICE_FEED_ADDRESS: "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE",
  },
  keeper: {
    REGISTRY_ADDRESS: "0x7b3EC232b08BD7b4b3305BE0C044D907B2DF960B",
    LINK_ADDRESS: "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD",
  },
  safes: {
    OperationsSafe: process.env.BSC_MAINNET_OPERATIONS_SAFE!,
    UpgradesSafe: process.env.BSC_MAINNET_UPGRADES_SAFE!,
    FlurrySafe: process.env.BSC_MAINNET_FLURRY_SAFE!,
  },
  multicall: "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
  relayer: {
    API_KEY: "6neteh4q56SHYmXrdh8WvSfafavY9Hby",
    API_SECRET: process.env.DEFENDER_RELAYER_BSC_MAINNET_API_SECRET!,
    RELAYER_ADDRESS: process.env.DEFENDER_RELAYER_BSC_MAINNET_ADDRESS!,
    REBASE_AUTOTASK_ID: "30f1c051-a77c-446e-9533-53e1a519f5d9",
    COLLECT_REWARD_AUTOTASK_ID: "d968ce5a-723f-48b1-ad4d-6f3a7e5e36ab",
  },
  strategies: [
    "Alpaca",
    // "Cream", Cream is disabled due to Hack
    // "Qubit", Qubit is disabled due to Hack
    "Rabbit",
    // "Sushi", // Pending Release
    "Venus",
  ],
  depositUnwinders: [
    { protocol: "Alpaca", unwinderType: "ibToken", tokenInterface: "IIBToken" },
    // { protocol: "Cream", unwinderType: "crToken", tokenInterface: "ICERC20" },
    { protocol: "Venus", unwinderType: "vToken", tokenInterface: "IVToken" },
    { protocol: "Rabbit", unwinderType: "iRbtToken" },
  ],
};

const bscTestnet: ExternalDependency = {
  chainId: 97,
  name: "bscTestnet",
  nativeSymbol: "BNB",
  wrappedNativeSymbol: "WBNB",
  wrappedNativeAddr: "0xDfb1211E2694193df5765d54350e1145FD2404A1", //0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd
  blockTime: BSCMAINNET_BLOCK_TIME,
  blocksPerYear: Math.floor((365 * 86400) / BSCMAINNET_BLOCK_TIME),
  defaultExchange: "uniswapV2",
  // Stables for Venus
  // underlying: {
  //   USDC: {
  //     ADDRESS: "0x16227d60f7a0e586c66b005219dfc887d13c9531",
  //     WHALE_ADDRESS: "0xdf7da4b504a2dd305eca158935ff174f7cab4dfa",
  //   },
  //   USDT: {
  //     ADDRESS: "0xA11c8D9DC9b66E209Ef60F0C8D969D3CD988782c",
  //     WHALE_ADDRESS: "0xfc227dace9856602ae9d6f366c22f956a1524fce",
  //   },
  //   BUSD: {
  //     ADDRESS: "0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47",
  //     WHALE_ADDRESS: "0x383efc47c6bb813f093e9c216fdf7fccf878bee2",
  //   },
  // },
  // Stables for Alpaca
  underlying: {
    USDC: {
      ADDRESS: "0x74E6d184A8cD7d43E9b2B46b66F6Eb92d36a768B", // alpaca
      WHALE_ADDRESS: "0x212C2a2891227f39B48D655C5ecA0b1377daFF90",
    },
    USDT: {
      ADDRESS: "0xE60Fa777dEb72C364447BB18C823C4731FbeD671", // alpaca
      WHALE_ADDRESS: "0xc1594110aF71D31c7F64F1EeD1f540307964873c",
    },
    BUSD: {
      ADDRESS: "0x0266693F9Df932aD7dA8a9b44C2129Ce8a87E81f", // alpaca
      WHALE_ADDRESS: "0x212C2a2891227f39B48D655C5ecA0b1377daFF90",
    },
  },
  // Stables for Qubit
  // underlying: {
  //   USDT: {
  //     ADDRESS: "0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684", // qubit
  //     WHALE_ADDRESS: "0x352a7a5277ec7619500b06fa051974621c1acd12",
  //   },
  //   BUSD: {
  //     ADDRESS: "0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7", // qubit
  //     WHALE_ADDRESS: "0x352a7a5277ec7619500b06fa051974621c1acd12",
  //   },
  // },
  tokens: {
    ALPACA: {
      SYMBOL: "ALPACA",
      ADDRESS: "0x354b3a11D5Ea2DA89405173977E271F58bE2897D",
      WHALE_ADDRESS: "0x2DD872C6f7275DAD633d7Deb1083EDA561E9B96b",
      EXCHANGE: "uniswapV2",
      NATIVE_PAIR: "0x7549b7d0edcd411e7e5013dc74727f8dab13ab0f",
    },
    // CREAM: {
    //   ADDRESS: "0xd4CB328A82bDf5f03eB737f37Fa6B370aef3e888",
    //   WHALE_ADDRESS: "0xF977814e90dA44bFA03b6295A0616a897441aceC",
    // },
    // XVS: {
    //   SYMBOL: "XVS",
    //   ADDRESS: "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
    //   WHALE_ADDRESS: "0x2Ce1d0ffD7E869D9DF33e28552b12DdDed326706",
    //   EXCHANGE: "uniswapV2",
    // },
    // QBT: {
    //   SYMBOL: "QBT",
    //   ADDRESS: "0xF523e4478d909968090a232eB380E2dd6f802518",
    //   EXCHANGE: "uniswapV2",
    //   WHALE_ADDRESS: "0x335241eb13f7344bb3705057c8fec644310b8f3d",
    //   NATIVE_PAIR: "0xb8916502D156c61F2eBb842EA67Aa5A616cD2A2d",
    // },
  },
  depositTokens: {
    vUSDT: {
      SYMBOL: "vUSDT",
      ADDRESS: "0xb7526572FFE56AB9D7489838Bf2E18e3323b441A",
    },
    vUSDC: {
      SYMBOL: "vUSDC",
      ADDRESS: "0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7",
    },
    vBUSD: {
      SYMBOL: "vBUSD",
      ADDRESS: "0x08e0A5575De71037aE36AbfAfb516595fE68e5e4",
    },
    aibUSDT: {
      SYMBOL: "aibUSDT",
      ADDRESS: "0xb5913CD4C508f07025678CeF939BcC54D3024C39",
      PID: 15,
    },
    aibUSDC: {
      SYMBOL: "aibUSDC",
      ADDRESS: "0x10c3d6330272Fee8bf9d3E42D0b790052ebc09DF",
      WHALE_ADDRESS: "0x2DD872C6f7275DAD633d7Deb1083EDA561E9B96b", // little balance due to initial launch
      PID: 23,
    },
    aibBUSD: {
      SYMBOL: "aibBUSD",
      ADDRESS: "0xe5ed8148fE4915cE857FC648b9BdEF8Bb9491Fa5",
      PID: 3,
    },
    qBUSD: {
      SYMBOL: "qBUSD",
      ADDRESS: "0x38e2Ab4caDd92b87739aA5A71847e0B70bD4e631",
    },
    qUSDT: {
      SYMBOL: "qUSDT",
      ADDRESS: "0xB8243be1D145a528687479723B394485cE3cE773",
    },
  },
  Alpaca: {
    USDT: "aibUSDT",
    USDC: "aibUSDC",
    BUSD: "aibBUSD",
    BonusTokens: ["ALPACA"],
    INTEREST_MODEL_ADDRESS: "0x111ae8da53D0998260DfdfA2172d4f88f969d386",
    FAIR_LAUNCH_V2_ADDRESS: "0xac2fefDaF83285EA016BE3f5f1fb039eb800F43D",
  },
  // Qubit: {
  //   USDT: "qUSDT",
  //   BUSD: "qBUSD",
  //   Bonus: "QBT",
  //   QORE_ADDRESS: "0xb3f98A31A02d133f65da961086EcDa4133bdf48e",
  //   QUBIT_LOCKER_ADDRESS: "0xeA34f39DF510eAFFb789d575c9aa800d61476256",
  //   DASHBOARD_ADDRESS: "0x5bA1B272D60f46371279aE7a1C13227Fb93F99c1",
  // },
  // Venus: {
  //   USDT: "vUSDT",
  //   USDC: "vUSDC",
  //   BUSD: "vBUSD",
  //   Bonus: "XVS",
  //   UNITROLLER_ADDRESS: "0x94d1820b2D1c7c7452A163983Dc888CEC546b77D",
  // },
  // uniswapV2: {
  //   UNISWAP_V2_ROUTER02_ADDRESS: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1", // pancakeswap for Venus
  //   UNISWAP_V2_FACTORY_ADDRESS: "0x6725F303b657a9451d8BA641348b6761A6CC7a17", // pancakeswap for Venus
  //   UNISWAP_V2_PATH: pancakeswapBscTestnetPath, // pancakeswap, path hard-coded
  // },
  // uniswapV2: {
  //   UNISWAP_V2_ROUTER02_ADDRESS: "0x367633909278A3C91f4cB130D8e56382F00D1071", // pancakeswap for Alpaca
  //   UNISWAP_V2_FACTORY_ADDRESS: "0xda8EE87e2172d997a7fe05a83FC5c472B40FacCE", // pancakeswap for Alpaca
  //   UNISWAP_V2_PATH: pancakeswapBscTestnetPath, // pancakeswap, path hard-coded
  // },
  // uniswapV2: {
  //   UNISWAP_V2_ROUTER02_ADDRESS: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1", // pancakeswap for Rabbit
  //   UNISWAP_V2_FACTORY_ADDRESS: "0x6725F303b657a9451d8BA641348b6761A6CC7a17", // pancakeswap for Rabbit
  //   UNISWAP_V2_PATH: pancakeswapBscTestnetPath, // pancakeswap, path hard-coded
  // },
  uniswapV2: {
    UNISWAP_V2_ROUTER02_ADDRESS: "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3", // pancakeswap for Qubit
    UNISWAP_V2_FACTORY_ADDRESS: "0xB7926C0430Afb07AA7DEfDE6DA862aE0Bde767bc", // pancakeswap for Qubit
    UNISWAP_V2_PATH: pancakeswapBscTestnetPath, // pancakeswap, path hard-coded
  },
  kyber: {
    KYBER_ROUTER_ADDRESS: "0x19395624C030A11f58e820C3AeFb1f5960d9742a",
    KYBER_FACTORY_ADDRESS: "0x7900309d0b1c8D3d665Ae40e712E8ba4FC4F5453",
  },
  kyberAggregation: {
    KYBER_AGGREGATION_ROUTER_ADDRESS: undefined,
  },
  chainlink: {
    USDCUSD_PRICE_FEED_ADDRESS: "0x90c069C4538adAc136E051052E14c1cD799C41B7", // no "USDC / BNB"
    USDTUSD_PRICE_FEED_ADDRESS: "0xEca2605f0BCF2BA5966372C99837b1F182d3D620", // no "USDT / BNB"
    BUSDUSD_PRICE_FEED_ADDRESS: "0x9331b55D9830EF609A2aBCfAc0FBCE050A52fdEa", // no "BUSD / BNB"
    XVSUSD_PRICE_FEED_ADDRESS: "0xCfA786C17d6739CBC702693F23cA4417B5945491",
    BNBUSD_PRICE_FEED_ADDRESS: "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526",
  },
  keeper: {
    REGISTRY_ADDRESS: "0xA3E3026562a3ADAF7A761B10a45217c400a4054A",
    LINK_ADDRESS: "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06",
  },
  safes: {
    OperationsSafe: "0x30B08b79FCF71D2C3a0CE1B1545976833E4Cd581",
    UpgradesSafe: "0x6332cb8fB0C1059B9dd6B631761b7c59CCc36e5c",
    FlurrySafe: "0x5Baaac65c17C3D05151B9176CB091f376737dbEf",
  },
  multicall: "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
  relayer: {
    API_KEY: "8VTMru7wDkzG8dG5Mf4MHNeLMzjF9NDQ",
    API_SECRET: process.env.DEFENDER_RELAYER_BSC_TESTNET_API_SECRET!,
    RELAYER_ADDRESS: process.env.DEFENDER_RELAYER_BSC_TESTNET_ADDRESS!,
    REBASE_AUTOTASK_ID: "043c3931-35c5-41fb-9c2d-b76cf49825eb",
    COLLECT_REWARD_AUTOTASK_ID: "cae92e90-c145-454a-b248-6a5633b04934",
  },
  strategies: [
    "Alpaca",
    // "BZx", bZx will be rebranded to OOKI
    // "Cream", Cream is disabled currently
    // "Qubit", //Qubit is diasabled currently
    // "Rabbit",
    // "Sushi", // Sushi release is put on hold until we have a better rebalance algo
    // "Venus",
  ],
  depositUnwinders: [
    { protocol: "Alpaca", unwinderType: "ibToken", tokenInterface: "IIBToken" },
    // { protocol: "Cream", unwinderType: "crToken", tokenInterface: "ICERC20" },
    // { protocol: "Venus", unwinderType: "vToken", tokenInterface: "IVToken" },
  ],
};

const ftmMainnet: ExternalDependency = {
  chainId: 250,
  name: "ftmMainnet",
  nativeSymbol: "FTM",
  wrappedNativeSymbol: "WBNB",
  wrappedNativeAddr: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  blockTime: FTMMAINNET_BLOCK_TIME,
  blocksPerYear: Math.floor((365 * 86400) / FTMMAINNET_BLOCK_TIME),
  defaultExchange: "uniswapV2",
  underlying: {
    USDC: {
      ADDRESS: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      WHALE_ADDRESS: "0xf977814e90da44bfa03b6295a0616a897441acec",
    },
    USDT: {
      ADDRESS: "0x55d398326f99059ff775485246999027b3197955",
      WHALE_ADDRESS: "0xefdca55e4bce6c1d535cb2d0687b5567eef2ae83",
    },
    BUSD: {
      ADDRESS: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
      WHALE_ADDRESS: "0x8894E0a0c962CB723c1976a4421c95949bE2D4E3",
    },
  },
  tokens: {
    ALPACA: {
      SYMBOL: "ALPACA",
      ADDRESS: "0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F",
      WHALE_ADDRESS: "0x000000000000000000000000000000000000dEaD",
      EXCHANGE: "uniswapV2",
    },
    CREAM: {
      ADDRESS: "0xd4CB328A82bDf5f03eB737f37Fa6B370aef3e888",
      WHALE_ADDRESS: "0xF977814e90dA44bFA03b6295A0616a897441aceC",
    },
    RABBIT: {
      SYMBOL: "RABBIT",
      ADDRESS: "0x95a1199EBA84ac5f19546519e287d43D2F0E1b41",
      WHALE_ADDRESS: "0xE3893e482583104408d81756bB2d0Af1dD9c720C",
      EXCHANGE: "uniswapV2",
      NATIVE_PAIR: "0x04b56A5B3f45CFeaFbfDCFc999c14be5434f2146",
    },
    XVS: {
      SYMBOL: "XVS",
      ADDRESS: "0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63",
      WHALE_ADDRESS: "0xF977814e90dA44bFA03b6295A0616a897441aceC",
      EXCHANGE: "uniswapV2",
    },
    QBT: {
      SYMBOL: "QBT",
      ADDRESS: "0x17b7163cf1dbd286e262ddc68b553d899b93f526",
      WHALE_ADDRESS: "0xb56290befc4216dc2a526a9022a76a1e4fdf122b",
      NATIVE_PAIR: "0x67EFeF66A55c4562144B9AcfCFbc62F9E4269b3e",
      EXCHANGE: "uniswapV2",
    },
    WETH: {
      SYMBOL: "WETH",
      ADDRESS: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
    },
  },
  depositTokens: {
    vUSDT: {
      SYMBOL: "vUSDT",
      ADDRESS: "0xfD5840Cd36d94D7229439859C0112a4185BC0255",
      WHALE_ADDRESS: "0xf977814e90da44bfa03b6295a0616a897441acec",
    },
    vUSDC: {
      SYMBOL: "vUSDC",
      ADDRESS: "0xecA88125a5ADbe82614ffC12D0DB554E2e2867C8",
      WHALE_ADDRESS: "0x8fe02faff19c88c5b62c8aad0307b37596bfa5c3",
    },
    vBUSD: {
      SYMBOL: "vBUSD",
      ADDRESS: "0x95c78222B3D6e262426483D42CfA53685A67Ab9D",
      WHALE_ADDRESS: "0xf977814e90da44bfa03b6295a0616a897441acec",
    },
    ibUSDT: {
      SYMBOL: "ibUSDT",
      ADDRESS: "0xFE1622F9F594A113cd3C1A93F7F6B0d3C0588781",
      WHALE_ADDRESS: "0xe4b5b2667e049ac8c79ae6c5a7e3300815aa32be",
      PID: 2,
    },
    ibBUSD: {
      SYMBOL: "ibBUSD",
      ADDRESS: "0xE0d1130Def49C29A4793De52eac680880Fc7cB70",
      WHALE_ADDRESS: "0x0def7def5d7686fecb60318158e515d01ec14ba6",
      PID: 1,
    },
    crUSDT: {
      SYMBOL: "crUSDT",
      ADDRESS: "0xEF6d459FE81C3Ed53d292c936b2df5a8084975De",
      WHALE_ADDRESS: "0x2c78b4b5e40f78f5bfa6fce0b277d2c59ccf8545",
    },
    crUSDC: {
      SYMBOL: "crUSDC",
      ADDRESS: "0xd83c88db3a6ca4a32fff1603b0f7ddce01f5f727",
      WHALE_ADDRESS: "0xf977814e90da44bfa03b6295a0616a897441acec",
    },
    crBUSD: {
      SYMBOL: "crBUSD",
      ADDRESS: "0x2bc4eb013ddee29d37920938b96d353171289b7c",
      WHALE_ADDRESS: "0x108a8b7200d044bbbe95bef6f671baec5473e05f",
    },
    iUSDT: {
      SYMBOL: "iUSDT",
      ADDRESS: "0xf326b42A237086F1De4E7D68F2d2456fC787bc01",
    },
    iBUSD: {
      SYMBOL: "iBUSD",
      ADDRESS: "0xf326b42A237086F1De4E7D68F2d2456fC787bc01",
    },
    aibUSDT: {
      SYMBOL: "aibUSDT",
      ADDRESS: "0x158Da805682BdC8ee32d52833aD41E74bb951E59",
      WHALE_ADDRESS: "0x00070cc274937836a40b4b25bc8c87ee4b12d63d",
      PID: 16,
    },
    aibUSDC: {
      SYMBOL: "aibUSDC",
      ADDRESS: "0x800933D685E7Dc753758cEb77C8bd34aBF1E26d7",
      WHALE_ADDRESS: "0xf40C2fA57A147ce4662f730497e5bc0C20Fd313f", // little balance due to initial launch
      PID: 24,
    },
    aibBUSD: {
      SYMBOL: "aibBUSD",
      ADDRESS: "0x7C9e73d4C71dae564d41F78d56439bB4ba87592f",
      WHALE_ADDRESS: "0x25cd8fddaa1d966768794590428a0e5891fb036f",
      PID: 3,
    },
    qUSDT: {
      SYMBOL: "qUSDT",
      ADDRESS: "0x99309d2e7265528dC7C3067004cC4A90d37b7CC3",
    },
    qUSDC: {
      SYMBOL: "qUSDC",
      ADDRESS: "0x1dd6E079CF9a82c91DaF3D8497B27430259d32C2",
    },
    qBUSD: {
      SYMBOL: "qBUSD",
      ADDRESS: "0xa3A155E76175920A40d2c8c765cbCB1148aeB9D1",
    },
    "kmETH/USDC-LINK": {
      SYMBOL: "kmETH/USDC-LINK",
      ADDRESS: "0x591f6fd601dad61b9565a7896977baf69aa403c2",
      WHALE_ADDRESS: "0x59e4352415cf402a912111dd248590c14b0d7c8d",
      COLLATERAL_SYMBOL: "WETH",
    },
    "kmWBNB/BUSD-LINK": {
      SYMBOL: "kmWBNB/BUSD-LINK",
      ADDRESS: "0xafa2526f518956a1fe1ff6f3aef9a90007a64052",
      WHALE_ADDRESS: "0x298edb6b8312a2730d9f15ff7baf95a87f4f320d",
      COLLATERAL_SYMBOL: "WBNB",
    },
  },
  Alpaca: {
    USDT: "aibUSDT",
    USDC: "aibUSDC",
    BUSD: "aibBUSD",
    BonusTokens: ["ALPACA"],
    INTEREST_MODEL_ADDRESS: "0xADcfBf2e8470493060FbE0A0aFAC66d2cB028e9c",
    FAIR_LAUNCH_V2_ADDRESS: "0xA625AB01B08ce023B2a342Dbb12a16f2C8489A8F",
  },
  BZx: {
    USDT: "iUSDT",
    BUSD: "iBUSD",
    BonusTokens: [],
  },
  Cream: {
    USDT: "crUSDT",
    USDC: "crUSDC",
    BUSD: "crBUSD",
    BonusTokens: [],
  },
  Qubit: {
    USDT: "qUSDT",
    USDC: "qUSDC",
    BUSD: "qBUSD",
    BonusTokens: ["QBT"],
    QORE_ADDRESS: "0xF70314eb9c7Fe7D88E6af5aa7F898b3A162dcd48",
    QUBIT_LOCKER_ADDRESS: "0xB8243be1D145a528687479723B394485cE3cE773",
    DASHBOARD_ADDRESS: "0x3BF0EbF0B846Fff73Df543bACacC542A6CE9fc15",
  },
  Rabbit: {
    USDT: "ibUSDT",
    BUSD: "ibBUSD",
    BonusTokens: ["RABBIT"],
    BANK_ADDRESS: "0xc18907269640D11E2A91D7204f33C5115Ce3419e",
    BANK_CONFIG_ADDRESS: "0x4e022ad93f05c942b68b89387f546b85fe53a8e8",
    FAIRLAUNCH_ADDRESS: "0x5ABd28694EDBD546247C2547738076a128cA1157",
  },
  Sushi: {
    USDC: ["kmETH/USDC-LINK"],
    BUSD: ["kmWBNB/BUSD-LINK", "kmWBNB/BUSD-LINK"],
    BonusTokens: [],
    BENTOBOX_ADDRESS: "0xF5BCE5077908a1b7370B9ae04AdC565EBd643966",
    MASTERKP_ADDRESS: "0x2cBA6Ab6574646Badc84F0544d05059e57a5dc42",
    CHEF_ADDRESS: "0x0000000000000000000000000000000000000000",
  },
  Venus: {
    USDT: "vUSDT",
    USDC: "vUSDC",
    BUSD: "vBUSD",
    BonusTokens: ["XVS"],
    UNITROLLER_ADDRESS: "0xfD36E2c2a6789Db23113685031d7F16329158384",
  },
  uniswapV2: {
    UNISWAP_V2_ROUTER02_ADDRESS: "0x10ED43C718714eb63d5aA57B78B54704E256024E", // pancakeswap
    UNISWAP_V2_FACTORY_ADDRESS: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73", // pancakeswap
    UNISWAP_V2_PATH: pancakeswapBscMainnetPath, // pancakeswap, path hard-coded
  },
  kyber: {
    KYBER_ROUTER_ADDRESS: "0x78df70615ffc8066cc0887917f2Cd72092C86409",
    KYBER_FACTORY_ADDRESS: "0x878dFE971d44e9122048308301F540910Bbd934c",
  },
  kyberAggregation: {
    KYBER_AGGREGATION_ROUTER_ADDRESS: "0xDF1A1b60f2D438842916C0aDc43748768353EC25",
  },
  chainlink: {
    USDCBNB_PRICE_FEED_ADDRESS: "0x45f86CA2A8BC9EBD757225B19a1A0D7051bE46Db",
    USDTBNB_PRICE_FEED_ADDRESS: "0xD5c40f5144848Bd4EF08a9605d860e727b991513",
    BUSDBNB_PRICE_FEED_ADDRESS: "0x87Ea38c9F24264Ec1Fff41B04ec94a97Caf99941",
    USDCUSD_PRICE_FEED_ADDRESS: "0x51597f405303C4377E36123cBc172b13269EA163",
    USDTUSD_PRICE_FEED_ADDRESS: "0xB97Ad0E74fa7d920791E90258A6E2085088b4320",
    BUSDUSD_PRICE_FEED_ADDRESS: "0xcBb98864Ef56E9042e7d2efef76141f15731B82f",
    XVSUSD_PRICE_FEED_ADDRESS: "0xBF63F430A79D4036A5900C19818aFf1fa710f206",
    ALPACAUSD_PRICE_FEED_ADDRESS: "0xe0073b60833249ffd1bb2af809112c2fbf221DF6",
    BNBUSD_PRICE_FEED_ADDRESS: "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE",
  },
  keeper: {
    REGISTRY_ADDRESS: "0x7b3EC232b08BD7b4b3305BE0C044D907B2DF960B",
    LINK_ADDRESS: "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD",
  },
  safes: {
    OperationsSafe: process.env.BSC_MAINNET_OPERATIONS_SAFE!,
    UpgradesSafe: process.env.BSC_MAINNET_UPGRADES_SAFE!,
    FlurrySafe: process.env.BSC_MAINNET_FLURRY_SAFE!,
  },
  multicall: "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
  relayer: {
    API_KEY: "6neteh4q56SHYmXrdh8WvSfafavY9Hby",
    API_SECRET: process.env.DEFENDER_RELAYER_BSC_MAINNET_API_SECRET!,
    RELAYER_ADDRESS: process.env.DEFENDER_RELAYER_BSC_MAINNET_ADDRESS!,
    REBASE_AUTOTASK_ID: "30f1c051-a77c-446e-9533-53e1a519f5d9",
    COLLECT_REWARD_AUTOTASK_ID: "d968ce5a-723f-48b1-ad4d-6f3a7e5e36ab",
  },
  strategies: [
    "Alpaca",
    // "Cream", Cream is disabled due to Hack
    // "Qubit", Qubit is disabled due to Hack
    "Rabbit",
    // "Sushi", // Pending Release
    "Venus",
  ],
  depositUnwinders: [
    { protocol: "Alpaca", unwinderType: "ibToken", tokenInterface: "IIBToken" },
    // { protocol: "Cream", unwinderType: "crToken", tokenInterface: "ICERC20" },
    { protocol: "Venus", unwinderType: "vToken", tokenInterface: "IVToken" },
    { protocol: "Rabbit", unwinderType: "iRbtToken" },
  ],
};

const polygonMainnet: ExternalDependency = {
  chainId: 137,
  name: "polygonMainnet",
  nativeSymbol: "MATIC",
  wrappedNativeSymbol: "WMATIC",
  wrappedNativeAddr: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  blockTime: POLYGONMAINNET_BLOCK_TIME,
  blocksPerYear: Math.floor((365 * 86400) / POLYGONMAINNET_BLOCK_TIME),
  defaultExchange: "uniswapV2",
  underlying: {
    USDC: {
      ADDRESS: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      WHALE_ADDRESS: "0xe7804c37c13166fF0b37F5aE0BB07A3aEbb6e245",
    },
    USDT: {
      ADDRESS: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      WHALE_ADDRESS: "0x0D0707963952f2fBA59dD06f2b425ace40b492Fe",
    },
  },
  tokens: {
    WMATIC: {
      SYMBOL: "MATIC",
      ADDRESS: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      WHALE_ADDRESS: "0x8588b7ceCD39527Afb1447621Ad65c078e3f14De",
      EXCHANGE: "uniswapV2",
    },
    AAVE: {
      ADDRESS: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
      WHALE_ADDRESS: "0xB289360A2Ab9eacfFd1d7883183A6d9576DB515F",
    },
    CREAM: {
      ADDRESS: "0x8B407562B34EB832834eb57C7e1cf7E3BF45B0d9",
      WHALE_ADDRESS: "0x8F82344C2dbF4bEC81D45314b3e2C29d12DD922c",
    },
    WETH: {
      ADDRESS: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      WHALE_ADDRESS: "0xd3d176F7e4b43C70a68466949F6C64F06Ce75BB9",
    },
  },
  depositTokens: {
    amUSDT: {
      SYMBOL: "amUSDT",
      ADDRESS: "0x60D55F02A771d515e077c9C2403a1ef324885CeC",
      WHALE_ADDRESS: "0x10bf1dcb5ab7860bab1c3320163c6dddf8dcc0e4",
    },
    amUSDC: {
      SYMBOL: "amUSDC",
      ADDRESS: "0x1a13F4Ca1d028320A707D99520AbFefca3998b7F",
      WHALE_ADDRESS: "0x2b67a3c0b90f6ae4394210692f69968d02970126",
    },
    iUSDT: {
      SYMBOL: "iUSDT",
      ADDRESS: "0x18D755c981A550B0b8919F1De2CDF882f489c155",
    },
    iUSDC: {
      SYMBOL: "iUSDC",
      ADDRESS: "0x2E1A74a16e3a9F8e3d825902Ab9fb87c606cB13f",
    },
    crUSDT: {
      SYMBOL: "crUSDT",
      ADDRESS: "0xf976C9bc0E16B250E0B1523CffAa9E4c07Bc5C8a",
      WHALE_ADDRESS: "0x4e5ed30e3b4eb39abce3c150f31e180a3ae5806e",
    },
    crUSDC: {
      SYMBOL: "crUSDC",
      ADDRESS: "0x73CF8c5D14Aa0EbC89f18272A568319F5BAB6cBD",
      WHALE_ADDRESS: "0xc79df9fe252ac55af8aecc3d93d20b6a4a84527b",
    },
    "kmWETH/USDT-LINK": {
      SYMBOL: "kmWETH/USDT-LINK",
      ADDRESS: "0xEf7F30C8f0763b83D8779FB90DF99CB5E70425E8",
      WHALE_ADDRESS: "0x5348cd8822d4f43d3bce4dcb5d2664e765378dfe",
      COLLATERAL_SYMBOL: "WETH",
    },
    "kmWMATIC/USDT-LINK": {
      SYMBOL: "kmWMATIC/USDT-LINK",
      ADDRESS: "0x97D7C8AD06d08635358A35e9862adBe2727c2340",
      WHALE_ADDRESS: "0x24272bc950aa87b2f2755c6bc8517250106ff28a",
      COLLATERAL_SYMBOL: "WMATIC",
    },
    "kmUSDC/USDT-LINK": {
      SYMBOL: "kmUSDC/USDT-LINK",
      ADDRESS: "0x131e7be25Ea9A48E5291DC03D7ac2c5cd71eC343",
      COLLATERAL_SYMBOL: "USDC",
    },
    "kmWMATIC/USDC-LINK": {
      SYMBOL: "kmWMATIC/USDC-LINK",
      ADDRESS: "0xe4b3c431E29B15978556f55b2cd046Be614F558D",
      WHALE_ADDRESS: "0x4077b8235282309c6dc453a73b3ec2777efc5267",
      COLLATERAL_SYMBOL: "WMATIC",
    },
    "kmWETH/USDC-LINK": {
      SYMBOL: "kmWETH/USDC-LINK",
      ADDRESS: "0xd51B929792Cfcde30f2619e50E91513dCeC89B23",
      WHALE_ADDRESS: "0xe7049b4bc0c9e8bb3c060e691412bbbde7809ba0",
      COLLATERAL_SYMBOL: "WETH",
    },
  },
  AaveV2Polygon: {
    USDT: "amUSDT",
    USDC: "amUSDC",
    BonusTokens: ["WMATIC"],
    PROTOCOL_DATA_PROVIDER_ADDRESS: "0x7551b5D2763519d4e37e8B81929D336De671d46d",
  },
  BZx: {
    USDT: "iUSDT",
    USDC: "iUSDC",
    BonusTokens: [],
  },
  Cream: {
    USDT: "crUSDT",
    USDC: "crUSDC",
    BonusTokens: [],
  },
  Sushi: {
    USDT: ["kmWETH/USDT-LINK", "kmWMATIC/USDT-LINK", "kmUSDC/USDT-LINK"],
    USDC: ["kmWMATIC/USDC-LINK", "kmWETH/USDC-LINK"],
    BonusTokens: [],
    BENTOBOX_ADDRESS: "0x0319000133d3AdA02600f0875d2cf03D442C3367",
    MASTERKP_ADDRESS: "0xB527C5295c4Bc348cBb3a2E96B2494fD292075a7",
    CHEF_ADDRESS: "0x0000000000000000000000000000000000000000",
  },
  uniswapV2: {
    UNISWAP_V2_ROUTER02_ADDRESS: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff", // QuickSwap
    UNISWAP_V2_FACTORY_ADDRESS: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32", // QuickSwap
    UNISWAP_V2_PATH: quickSwapMaticMainnetPath, // QuickSwapswap, path hard-coded
  },
  chainlink: {
    USDCETH_PRICE_FEED_ADDRESS: "0xefb7e6be8356cCc6827799B6A7348eE674A80EaE",
    USDTETH_PRICE_FEED_ADDRESS: "0xf9d5AAC6E5572AEFa6bd64108ff86a222F69B64d",
    USDCUSD_PRICE_FEED_ADDRESS: "0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7",
    USDTUSD_PRICE_FEED_ADDRESS: "0x0A6513e40db6EB1b165753AD52E80663aeA50545",
    ETHUSD_PRICE_FEED_ADDRESS: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
    MATICETH_PRICE_FEED_ADDRESS: "0x327e23A4855b6F663a28c5161541d69Af8973302",
    MATICUSD_PRICE_FEED_ADDRESS: "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0",
  },
  keeper: {
    REGISTRY_ADDRESS: "0x7b3EC232b08BD7b4b3305BE0C044D907B2DF960B",
    LINK_ADDRESS: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
  },
  kyberAggregation: {
    KYBER_AGGREGATION_ROUTER_ADDRESS: "0xDF1A1b60f2D438842916C0aDc43748768353EC25",
  },
  safes: {
    OperationsSafe: process.env.MATIC_MAINNET_OPERATIONS_SAFE!,
    UpgradesSafe: process.env.MATIC_MAINNET_UPGRADES_SAFE!,
    FlurrySafe: process.env.MATIC_MAINNET_FLURRY_SAFE!,
  },
  multicall: "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
  relayer: {
    API_KEY: "Ey64KoorkgEsJttnUwAcMFDYxwUJp8YL",
    API_SECRET: process.env.DEFENDER_RELAYER_POLYGON_MAINNET_API_SECRET!,
    RELAYER_ADDRESS: process.env.DEFENDER_RELAYER_POLYGON_MAINNET_ADDRESS!,
    REBASE_AUTOTASK_ID: "076e73fc-c4d8-4829-8bec-5fa46f24d0de",
    COLLECT_REWARD_AUTOTASK_ID: "20b49b9c-d4ca-473f-9765-a0b369a6129e",
  },
  strategies: [
    "AaveV2Polygon",
    // "BZx", bZx will be rebranded to OOKI
    // "Cream", Cream is disabled currently
    // "Sushi", // Sushi release is put on hold until we have a better rebalance algo
  ],
  depositUnwinders: [
    { protocol: "AaveV2Polygon", unwinderType: "aTokenV2", tokenInterface: "IAToken" },
    { protocol: "Cream", unwinderType: "crToken", tokenInterface: "ICERC20" },
    { protocol: "Sushi", unwinderType: "kashiPair" },
  ],
};

const polygonMumbai: ExternalDependency = {
  chainId: 80001,
  name: "polygonMumbai",
  nativeSymbol: "MATIC",
  wrappedNativeSymbol: "WMATIC",
  wrappedNativeAddr: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
  blockTime: POLYGONMUMBAI_BLOCK_TIME,
  blocksPerYear: Math.floor((365 * 86400) / POLYGONMUMBAI_BLOCK_TIME),
  defaultExchange: "uniswapV2",
  underlying: {
    USDC: {
      ADDRESS: "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e",
      WHALE_ADDRESS: "0x25cb39a8b252b0a4b47768b57e452d714efe448a",
    },
    USDT: {
      ADDRESS: "0xBD21A10F619BE90d6066c941b04e340841F1F989",
      WHALE_ADDRESS: "0x25cb39a8b252b0a4b47768b57e452d714efe448a",
    },
  },
  tokens: {
    WMATIC: {
      SYMBOL: "MATIC",
      ADDRESS: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
      EXCHANGE: "uniswapV2",
    },
  },
  depositTokens: {
    amUSDT: {
      SYMBOL: "amUSDT",
      ADDRESS: "0xF8744C0bD8C7adeA522d6DDE2298b17284A79D1b",
    },
    amUSDC: {
      SYMBOL: "amUSDC",
      ADDRESS: "0x2271e3Fef9e15046d09E1d78a8FF038c691E9Cf9",
    },
  },
  AaveV2Polygon: {
    USDT: "amUSDT",
    USDC: "amUSDC",
    BonusTokens: ["WMATIC"],
    PROTOCOL_DATA_PROVIDER_ADDRESS: "0xFA3bD19110d986c5e5E9DD5F69362d05035D045B",
  },
  uniswapV2: undefined, // pending for uniswap v2 equivalent
  chainlink: {
    USDCUSD_PRICE_FEED_ADDRESS: "0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0",
    USDTUSD_PRICE_FEED_ADDRESS: "0x92C09849638959196E976289418e5973CC96d645",
    ETHUSD_PRICE_FEED_ADDRESS: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
    MATICUSD_PRICE_FEED_ADDRESS: "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
  },
  keeper: {
    REGISTRY_ADDRESS: "0x6179B349067af80D0c171f43E6d767E4A00775Cd",
    LINK_ADDRESS: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
  },
  strategies: [
    "AaveV2Polygon",
    // "BZx", bZx will be rebranded to OOKI
    // "Cream", Cream is disabled currently
    // "Sushi", // Sushi release is put on hold until we have a better rebalance algo
  ],
  depositUnwinders: [
    { protocol: "AaveV2Polygon", unwinderType: "aTokenV2", tokenInterface: "IAToken" },
    { protocol: "Cream", unwinderType: "crToken", tokenInterface: "ICERC20" },
  ],
};

const avaxMainnet: ExternalDependency = {
  chainId: 43114,
  name: "avaxMainnet",
  nativeSymbol: "AVAX",
  wrappedNativeSymbol: "WAVAX",
  wrappedNativeAddr: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
  blockTime: AVAXMAINNET_BLOCK_TIME,
  blocksPerYear: Math.floor((365 * 86400) / AVAXMAINNET_BLOCK_TIME),
  defaultExchange: "pangolin",
  underlying: {
    // "USDT.e": {
    //   ADDRESS: "0xc7198437980c041c805a1edcba50c1ce5db95118",
    //   WHALE_ADDRESS: "0x15938d2ac04e745424fe9a20dfd7ac98c95aa1f1",
    // },
    // "USDC.e": {
    //   ADDRESS: "0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
    //   WHALE_ADDRESS: "0xed2a7edd7413021d440b09d654f3b87712abab66",
    // },
    USDt: {
      // Not USDT!!
      ADDRESS: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
      WHALE_ADDRESS: "0x876eabf441b2ee5b5b0554fd502a8e0600950cfa",
    },
    USDC: {
      ADDRESS: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      WHALE_ADDRESS: "0x279f8940ca2a44c35ca3edf7d28945254d0f0ae6",
    },
  },
  tokens: {
    QI: {
      SYMBOL: "QI",
      ADDRESS: "0x8729438eb15e2c8b576fcc6aecda6a148776c0f5",
      WHALE_ADDRESS: "0x4aefa39caeadd662ae31ab0ce7c8c2c9c0a013e8",
      EXCHANGE: "pangolin",
    },
    WAVAX: {
      SYMBOL: "WAVAX",
      ADDRESS: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      EXCHANGE: "pangolin",
    },
  },
  depositTokens: {
    // qiUSDT: {
    //   SYMBOL: "qiUSDT",
    //   ADDRESS: "0xc9e5999b8e75C3fEB117F6f73E664b9f3C8ca65C",
    //   WHALE_ADDRESS: "0xcec87a49fec7aa9e2a4ab8db6c1c5056f3511249",
    // },
    // qiUSDC: {
    //   SYMBOL: "qiUSDC",
    //   ADDRESS: "0xBEb5d47A3f720Ec0a390d04b4d41ED7d9688bC7F",
    //   WHALE_ADDRESS: "0x50841697395e4a2ec8479261e684ae39ceed151b",
    // },
    qiUSDTn: {
      SYMBOL: "qiUSDTn",
      ADDRESS: "0xd8fcDa6ec4Bdc547C0827B8804e89aCd817d56EF",
      WHALE_ADDRESS: "0x61e2c1bbbbe4d841028965b8bfe0a2b83dd39f63",
    },
    qiUSDCn: {
      SYMBOL: "qiUSDCn",
      ADDRESS: "0xB715808a78F6041E46d61Cb123C9B4A27056AE9C",
      WHALE_ADDRESS: "0x61e2c1bbbbe4d841028965b8bfe0a2b83dd39f63",
    },
  },
  Benqi: {
    // "USDT.e": "qiUSDT",
    // "USDC.e": "qiUSDC",
    USDt: "qiUSDTn",
    USDC: "qiUSDCn",
    BonusTokens: ["QI", "WAVAX"],
    COMPTROLLER_ADDRESS: "0x486Af39519B4Dc9a7fCcd318217352830E8AD9b4",
  },
  pangolin: {
    UNISWAP_V2_ROUTER02_ADDRESS: "0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106", //Pangolin
    UNISWAP_V2_FACTORY_ADDRESS: "0xefa94DE7a4656D787667C749f7E1223D71E9FD88", // Pangolin
    UNISWAP_V2_PATH: pangolinSwapAvaxMainnetPath,
  },
  chainlink: {
    // "USDC.eUSD_PRICE_FEED_ADDRESS": "0xF096872672F44d6EBA71458D74fe67F9a77a23B9",
    // "USDT.eUSD_PRICE_FEED_ADDRESS": "0xEBE676ee90Fe1112671f19b6B7459bC678B67e8a",
    USDCUSD_PRICE_FEED_ADDRESS: "0xF096872672F44d6EBA71458D74fe67F9a77a23B9",
    USDtUSD_PRICE_FEED_ADDRESS: "0xEBE676ee90Fe1112671f19b6B7459bC678B67e8a",
    AVAXUSD_PRICE_FEED_ADDRESS: "0x0A77230d17318075983913bC2145DB16C7366156",
    WAVAXUSD_PRICE_FEED_ADDRESS: "0x0A77230d17318075983913bC2145DB16C7366156", // Not WAVAX to USD!
    QIUSD_PRICE_FEED_ADDRESS: "0x36E039e6391A5E7A7267650979fdf613f659be5D",
  },
  keeper: {
    REGISTRY_ADDRESS: "0x0656ef4a404e62cfaaf6659107ba836417616678",
    LINK_ADDRESS: "0x5947BB275c521040051D82396192181b413227A3",
  },
  safes: {
    OperationsSafe: process.env.AVAX_MAINNET_OPERATIONS_SAFE!,
    UpgradesSafe: process.env.AVAX_MAINNET_UPGRADES_SAFE!,
    FlurrySafe: process.env.AVAX_MAINNET_FLURRY_SAFE!,
  },
  multicall: "",
  relayer: {
    API_KEY: "GxRd3djzomsi7YhWuJRJBMV7tnZG2VbA",
    API_SECRET: process.env.DEFENDER_RELAYER_AVAX_MAINNET_API_SECRET!,
    RELAYER_ADDRESS: process.env.DEFENDER_RELAYER_AVAX_MAINNET_ADDRESS!,
    REBASE_AUTOTASK_ID: "9c4ee31d-6692-44ec-a5a9-05f6ecb37b24",
    COLLECT_REWARD_AUTOTASK_ID: "edee5105-aee6-4768-ba61-a8ba2ffedaa4",
  },
  strategies: ["Benqi"],
  depositUnwinders: [{ protocol: "Benqi", unwinderType: "qiToken", tokenInterface: "IQIToken" }],
};

//for unit test
const hardhat: ExternalDependency = {
  chainId: 1337,
  name: "hardhat",
  nativeSymbol: "ETH",
  wrappedNativeSymbol: "WETH",
  wrappedNativeAddr: "",
  blockTime: 1,
  blocksPerYear: Math.floor((365 * 86400) / 1),
  defaultExchange: "uniswapV2",
  underlying: {},
  tokens: {},
  depositTokens: {},
  uniswapV2: {
    UNISWAP_V2_FACTORY_ADDRESS: "0x0000000000000000000000000000000000000000",
    UNISWAP_V2_ROUTER02_ADDRESS: "0x0000000000000000000000000000000000000000",
  },
  kyber: {
    KYBER_FACTORY_ADDRESS: "0x0000000000000000000000000000000000000000",
    KYBER_ROUTER_ADDRESS: "0x0000000000000000000000000000000000000000",
  },
  kyberAggregation: {
    KYBER_AGGREGATION_ROUTER_ADDRESS: "0x0000000000000000000000000000000000000000",
  },
  chainlink: {},
  keeper: {
    REGISTRY_ADDRESS: "0x7b3EC232b08BD7b4b3305BE0C044D907B2DF960B",
    LINK_ADDRESS: "0x514910771af9ca656af840dff83e8264ecf986ca",
  },
  strategies: [],
  depositUnwinders: [],
};

export function resolveExternalDependency(network: Network): ExternalDependency {
  const externalDep = network.name;
  return getExternalDependency(externalDep);
}

export function resolveTokenInfo(dep: ExternalDependency, symbol?: string): TokenInfo | undefined {
  if (!symbol) return undefined;
  if (dep.depositTokens[symbol]) return dep.depositTokens[symbol] as TokenInfo;
  if (dep.tokens[symbol]) return dep.tokens[symbol] as TokenInfo;
  else if (dep.underlying[symbol]) return dep.underlying[symbol] as TokenInfo;
  return undefined;
}

export function resolveToken(dep: ExternalDependency, symbol: string): string | undefined {
  // special case - USD
  if (symbol == "USD") return DUMMY_USD_ADDRESS;

  // return Wrapped native addr if symbol == native symbol or symbol == wrapper native symbol
  if (symbol == dep.nativeSymbol || symbol == dep.wrappedNativeSymbol) return dep.wrappedNativeAddr;

  return resolveTokenInfo(dep, symbol)?.ADDRESS;
}

export function resolveAddress(dep: ExternalDependency, addr: string): string | undefined {
  if (addr == dep.wrappedNativeAddr) return dep.wrappedNativeSymbol;
  for (const [k, v] of Object.entries(dep.tokens)) {
    if (v.ADDRESS === addr) return k;
    if (v.WHALE_ADDRESS === addr) return `${k}_WHALE`;
  }
  for (const [k, v] of Object.entries(dep.depositTokens)) {
    if (v.ADDRESS === addr) return k;
    if (v.WHALE_ADDRESS === addr) return `${k}_WHALE`;
  }
  return undefined;
}

export function resolveTokenWhale(dep: ExternalDependency, symbol: string): string | undefined {
  return resolveTokenInfo(dep, symbol)?.WHALE_ADDRESS;
}

export function resolveUniV2Path(path: UniswapV2Path, baseSymbol: string, quoteSymbol: string): string[] | undefined {
  try {
    return path[`${baseSymbol}_${quoteSymbol}`] as string[];
  } catch {
    return undefined;
  }
}

export function resolveUniV3Path(path: UniswapV3Path, baseSymbol: string, quoteSymbol: string): string | undefined {
  try {
    return path[`${baseSymbol}_${quoteSymbol}`] as string;
  } catch {
    return undefined;
  }
}

export function resolveChainLinkFeed(dep: ChainLinkDep, baseSymbol: string, quoteSymbol: string): string | undefined {
  try {
    return dep[`${baseSymbol}${quoteSymbol}_PRICE_FEED_ADDRESS`] as string;
  } catch {
    return undefined;
  }
}

export function resolveSafeAddress(addr: string, wallets?: MultiSigWallets): string | undefined {
  let key: string | undefined;
  if (wallets) {
    if (addr == wallets.FlurrySafe) key = "FlurrySafe";
    else if (addr == wallets.OperationsSafe) key = "OperationsSafe";
    else if (addr == wallets.UpgradesSafe) key = "UpgradesSafe";
  }
  return key;
}

export function resolveStrategy(dep: ExternalDependency, strategy: string): StrategyDep | undefined {
  if (!strategy) return undefined;
  if (dep[strategy]) return dep[strategy] as StrategyDep;
  return undefined;
}

// these network use ethMainnet dependencies. Modify this if you want a different set up (deep copy)
const localhost = { ...ethMainnet, safes: undefined };
const localhost1 = { ...avaxMainnet };
const localhost2 = { ...bscMainnet, safes: undefined };
const localhost3 = { ...polygonMainnet, safes: undefined };
const flurry = { ...ethMainnet, safes: undefined };
const flurryAvax = { ...avaxMainnet, safes: undefined };
const flurryBSC = { ...bscMainnet, safes: undefined };
const flurryPolygon = { ...polygonMainnet, safes: undefined };

const externalDependency: { [key: string]: ExternalDependency } = {
  ethRopsten,
  ethRinkeby,
  ethKovan,
  ethGoerli,
  avaxMainnet,
  bscMainnet,
  bscTestnet,
  ftmMainnet,
  ethMainnet,
  polygonMainnet,
  polygonMumbai,
  hardhat,
  localhost,
  flurry,
  "flurry-avax": flurryAvax,
  "flurry-bsc": flurryBSC,
  "flurry-polygon": flurryPolygon,
  localhost1: localhost1,
  localhost2: localhost2,
  localhost3: localhost3,
};
export const getExternalDependency = (network: string) => externalDependency[network];
