import { default as USDTABI } from "./abi/usdt.abi.json";
import { default as BEP20USDTABI } from "./abi/bep20usdt.abi.json";
import { default as CUSDTABI } from "./abi/cusdt.abi.json";
import { default as CRUSDTABI } from "./abi/crusdt.abi.json";
import { default as AUSDTABI } from "./abi/ausdt.abi.json";
import { default as VUSDTABI } from "./abi/vusdt.abi.json";
import { default as IBUSDTABI } from "./abi/ibusdt.abi.json";
import { default as USDCABI } from "./abi/usdc.abi.json";
import { default as CUSDCABI } from "./abi/cusdc.abi.json";
import { default as CRUSDCABI } from "./abi/crusdt.abi.json";
import { default as AUSDCABI } from "./abi/ausdc.abi.json";
import { default as VUSDCABI } from "./abi/vusdc.abi.json";
import { default as BUSDABI } from "./abi/busd.abi.json";
import { default as CRBUSDABI } from "./abi/crbusd.abi.json";
import { default as VBUSDABI } from "./abi/vbusd.abi.json";
import { default as IBBUSDABI } from "./abi/ibbusd.abi.json";
import { default as UNISWAPV2PAIRABI } from "./abi/uniswapV2Pair.abi.json";
import { default as IERC20 } from "./abi/ierc20.abi.json";
import { default as KeeperRegistry } from "./abi/keeperRegistry.abi.json";
import { default as LINKABI } from "./abi/link.abi.json";
import { default as GNOSISSAFEABI } from "./abi/gnosisSafe.abi.json";
import { default as MULTICALLABI } from "./abi/multicall.abi.json";
import { default as PROXYADMINABI } from "./abi/proxyAdmin.abi.json";
import { default as WETH9ABI } from "./abi/weth9.abi.json";
import { default as USDTEABI } from "./abi/usdt.e.abi.json";
import { default as USDCEABI } from "./abi/usdc.e.abi.json";

import fs from "fs";

export interface jsonElement {
  key: string;
  label: string;
  contractName?: string; // Optional Contract Name param for identifying it
  contractCreationBlock?: number;
  address: string;
  abi: any;
}

export interface interfaceABIElement {
  key: string;
  abi: any;
}

/*  Loop through Array in JSON;
    Get specified element.*/
export function getElementFromContracts(array: jsonElement[], keyword: string): jsonElement | undefined {
  for (let element of array) {
    if (keyword == element.key) {
      return element;
    }
  }
}

// Loop through Array in JSON;
// Check if element has been deployed.
export function isExistingContract(array: jsonElement[], keyword: string): boolean {
  let isExisting = false;
  for (let element of array) {
    if (keyword == element.key) {
      isExisting = true;
    }
  }
  return isExisting;
}

let ABIObject: any = {
  USDT: USDTABI,
  BEP20USDT: BEP20USDTABI,
  CUSDT: CUSDTABI,
  CRUSDT: CRUSDTABI,
  AUSDT: AUSDTABI,
  VUSDT: VUSDTABI,
  IBUSDT: IBUSDTABI,
  USDC: USDCABI,
  CUSDC: CUSDCABI,
  CRUSDC: CRUSDCABI,
  VUSDC: VUSDCABI,
  AUSDC: AUSDCABI,
  BUSD: BUSDABI,
  CRBUSD: CRBUSDABI,
  VBUSD: VBUSDABI,
  IBBUSD: IBBUSDABI,
  "USDT.e": USDTEABI,
  "USDC.e": USDCEABI,
  USDt: USDTABI,
  WETH9: WETH9ABI,

  UniswapV2Pair: UNISWAPV2PAIRABI,
  IERC20: IERC20,
  KeeperRegistry: KeeperRegistry,
  LINK: LINKABI,
  GnosisSafe: GNOSISSAFEABI,
  Multicall: MULTICALLABI,
  ProxyAdmin: PROXYADMINABI,
};

export function getABI(key: string, artifacts: any) {
  if (ABIObject[key]) {
    return ABIObject[key];
  } else {
    return artifacts.readArtifactSync(key).abi;
  }
}

/**
 * Get Item by specific address, refer to @function getItemFromJSON .
 * */
export function getItemByAddr(obj: any, address: string): any {
  return getItemFromJSON(obj, "address", address);
}

/**
 * Get Item by search key-pair
 *
 * @param obj : The contracts.json passed in as a JSON Object.
 * @param toSearch : Key-pair to SEARCH, e.g. "key", "label", "address".
 * @param searchData : Key-pair value corresponding to the previously selected key, e.g. a key name, a label or an address.
 * @param needPrint : Optional param for console logging the object taken from search.
 * @returns : return the desired object; return false if nothing is updated.
 */
export function getItemFromJSON(obj: any, toSearch: string, searchData: any, needPrint: boolean = false): any {
  let isFound = false;
  if (typeof obj === "object") {
    if (obj[toSearch]) {
      if (searchData == obj[toSearch]) {
        isFound = true;
        if (obj.label && needPrint == true) {
          console.log(`Item taken from section ${obj.label.yellow}.`);
        }
        return obj;
      } else {
        for (let key in obj) {
          if (key !== "abi") {
            isFound = getItemFromJSON(obj[key], toSearch, searchData, needPrint);
            if (isFound) {
              break;
            }
          }
        }
      }
    } else {
      for (let key in obj) {
        if (key !== "abi") {
          isFound = getItemFromJSON(obj[key], toSearch, searchData, needPrint);
          if (isFound) {
            break;
          }
        }
      }
    }
  }
  return isFound;
}

/**
 * Get Item by search key-pair
 *
 * @param obj : The contracts.json passed in as a JSON Object.
 * @param toSearch : Key-pair to SEARCH, e.g. "key", "label", "address".
 * @param searchData : Key-pair value corresponding to the previously selected key, e.g. a key name, a label or an address.
 * @param needPrint : Optional param for console logging the object taken from search.
 * @returns : return the desired object; return false if nothing is updated.
 */
export function getItemsFromJSON(obj: any, toSearch: string, searchData: any, needPrint: boolean = false): any[] {
  let matches: any[] = [];

  if (typeof obj === "object") {
    if (obj[toSearch]) {
      if (searchData == obj[toSearch]) {
        if (needPrint == true) {
          console.log(obj);
        }
        matches.push(obj);
      } else {
        for (let key in obj) {
          matches = matches.concat(getItemsFromJSON(obj[key], toSearch, searchData, needPrint));
        }
      }
    } else {
      for (let key in obj) {
        matches = matches.concat(getItemsFromJSON(obj[key], toSearch, searchData, needPrint));
      }
      // console.log(matches);
    }
  } else if (Array.isArray(obj)) {
    for (let item of obj) {
      matches = matches.concat(getItemsFromJSON(obj, toSearch, searchData, needPrint));
    }
  }
  return matches;
}

/**
 * Get Parent Item by search key-pair
 *
 * @param obj : The contracts.json passed in as a JSON Object.
 * @param toSearch : Key-pair to SEARCH, e.g. "key", "label", "address".
 * @param searchData : Key-pair value corresponding to the previously selected key, e.g. a key name, a label or an address.
 * @param needPrint : Optional param for console logging the object taken from search.
 * @returns : return the Parent of the found object; return false if nothing is updated.
 */
export function getParentItemFromJSON(obj: any, toSearch: string, searchData: any, needPrint: boolean = false): any {
  let result: any = false;
  // console.log("--obj:", obj, typeof obj, "isArray:", Array.isArray(obj));

  if (typeof obj === "object") {
    if (obj[toSearch] == searchData) {
      if (needPrint) console.log("Matched:", obj);
      return true;
    } else {
      for (let key in obj) {
        if (Array.isArray(obj[key])) {
          for (let item of obj[key]) {
            let child = getParentItemFromJSON(item, toSearch, searchData, needPrint);
            if (typeof child === "boolean") {
              if (child) {
                // console.log("obj:", obj, "return (obj)", obj);
                return obj;
              }
            } else {
              // console.log("obj:", obj, "return (child)", child);
              return child;
            }
          }
        } else {
          let child = getParentItemFromJSON(obj[key], toSearch, searchData, needPrint);
          if (typeof child === "boolean") {
            if (child) {
              // console.log("obj:", obj, "return (obj)", obj);
              return obj;
            }
          } else {
            // console.log("obj:", obj, "return (child)", child);
            return child;
          }
        }
      }
    }
  }
  return result;
}

/**
 * Update any items from any search:
 * @param obj : The contracts.json passed in as a JSON Object
 * @param toCheck : Key-pair to CHECK, e.g. "key", "label", "address".
 * @param checkData : Key-pair value corresponding to the previously selected key, e.g. a key name, a label or an address.
 * @param toChange : Key-pair to CHANGE
 * @param changeData : Key-pair value corresponding to the previously selected key
 * @returns : console.log a successful message upon update; return false if nothing is updated.
 */
export function updateItemInArray(obj: any, toCheck: string, checkData: any, replaceItem: jsonElement): boolean {
  let index = obj.findIndex((item: any) => item[toCheck] == checkData);
  if (index >= 0) {
    obj[index] = replaceItem;
    return true;
  } else return false;
}

/**
 * Update any items from any search:
 * @param obj : The contracts.json passed in as a JSON Object
 * @param toCheck : Key-pair to CHECK, e.g. "key", "label", "address".
 * @param checkData : Key-pair value corresponding to the previously selected key, e.g. a key name, a label or an address.
 * @param toChange : Key-pair to CHANGE
 * @param changeData : Key-pair value corresponding to the previously selected key
 * @returns : console.log a successful message upon update; return false if nothing is updated.
 */
export function updateJSONItem(obj: any, toCheck: string, checkData: any, toChange: string, changeData: any): boolean {
  // console.log("updateJSONItem() called")
  let isChanged = false;
  if (typeof obj === "object") {
    // console.log(Object.getOwnPropertyNames(obj));
    if (obj[toCheck]) {
      if (checkData == obj[toCheck]) {
        obj[toChange] = changeData;
        isChanged = true;
        if (obj.label) {
          console.log(`Item changed at section ${obj.label.yellow}.`);
        }
        return isChanged;
      } else {
        for (let key in obj) {
          if (key !== "abi") {
            isChanged = updateJSONItem(obj[key], toCheck, checkData, toChange, changeData) || isChanged;
          }
        }
      }
    } else {
      for (let key in obj) {
        if (key !== "abi") {
          isChanged = updateJSONItem(obj[key], toCheck, checkData, toChange, changeData) || isChanged;
        }
      }
    }
  }
  return isChanged;
}

/**
 * Set ABI from address search:
 * @param address : search address in contracts.json
 * @param newABI : new ABI to replace the old one, usually taken from @artifacts or @function getABI above.
 * @param networkName : network.name
 */
export function setABIFromAddr(address: string, newABI: any, networkName: string) {
  // const dep = getExternalDependency(networkName);
  const newDeployedAddr = require(`${__dirname}/../deployment/${networkName}/contracts.json`);
  const deployedAddresses = require(`${__dirname}/../deployment/${networkName}/contract-address.json`);
  if (newDeployedAddr && deployedAddresses) {
    let key;
    for (let item in deployedAddresses) {
      if (deployedAddresses[item] == address) {
        key = item;
        break;
      }
    }
    if (key) {
      const abiChanged = updateJSONItem(newDeployedAddr, "address", address, "abi", newABI);
      if (abiChanged) {
        console.log(`Updated ABI at address ${address.green}.`, "\n");
        fs.writeFileSync(
          `${__dirname}/../deployment/${networkName}/contracts.json`,
          JSON.stringify(newDeployedAddr, null, 2)
        );
      } else {
        console.log(`Address ${address.red} is in ${"contract-address.json".blue} but not in ${"contract.json".blue}.`);
        console.log(`You are advised to re-deploy in network ${networkName.blue}.`);
      }
    } else {
      console.log(`No keys are found from the search address: ${address.red}.`);
    }
  } else {
    console.log(`Files ${"contracts.json".red} or ${"contract-address.json".red} missing, please check deployment.`);
  }
}

// export function isJsonElement(element: jsonElement | any): element is jsonElement {
//   return (<jsonElement>element).key !== undefined;
// }
