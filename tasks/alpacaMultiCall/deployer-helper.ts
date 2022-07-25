import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { JsonRpcProvider } from "@ethersproject/providers";
import { HttpNetworkUserConfig } from "hardhat/types";

export async function getDeployer(ethers: any, network: any): Promise<SignerWithAddress> {
  const [defaultDeployer] = await ethers.getSigners();

  if (isFork(network)) {
    const provider = ethers.getDefaultProvider((network.config as HttpNetworkUserConfig).url) as JsonRpcProvider;
    const signer = provider.getSigner(process.env.DEPLOYER_ADDRESS);
    const mainnetForkDeployer = await SignerWithAddress.create(signer);

    return mainnetForkDeployer;
  }

  return defaultDeployer;
}

export function isFork(network: any) {
  const networkUrl = (network.config as HttpNetworkUserConfig).url;
  if (networkUrl) {
    return networkUrl.indexOf("https://rpc.tenderly.co/fork/") !== -1;
  }
  throw new Error("invalid Network Url");
}
