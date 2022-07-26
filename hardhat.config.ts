import * as dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/.env` });
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { task } from "hardhat/config";
import "./tasks";



task("accounts", "Prints the list of accounts").setAction(async (_, { ethers }) => {
  const accounts = await ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            // Optimize for how many times you intend to run the code.
            // Lower values will optimize more for initial deployment cost, higher
            // values will optimize more for high-frequency usage.
            runs: 100,
          },
          outputSelection: {
            "*": {
              "*": ["storageLayout"],
            },
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: parseInt(process.env.HARDHAT_NETWORK_CHAINID as string),
      accounts: { accountsBalance: "50000000000000000000000", mnemonic: process.env.HARDHAT_MNEMONIC, count: 10 },
      hardfork: "london",
      initialBaseFeePerGas: 1000000000, // 1 gwei
      gas: "auto",
      gasPrice: "auto",
      mining: {
        auto: process.env.AUTO_MINE == "true",
        interval: parseInt(process.env.MINING_INTERVAL as string),
      },
    },
    localhost: {
      chainId: 1337,
      url: "http://127.0.0.1:7545",
    },
    ftmMainnet: {
      url: process.env.FTM_MAINNET_URL,
      httpHeaders: { "x-api-key" : process.env.GETBLOCK_API_KEY as string},
      chainId: 250,
      gas: "auto",
      timeout: 300000,
    },
    bscMainnet: {
      url: process.env.BSC_MAINNET_URL,
      chainId: 56,
      accounts: { mnemonic: process.env.BSC_MAINNET_MNEMONIC, count: 5 },
      gas: "auto",
      timeout: 300000,
    },
  },
};

export default config;
