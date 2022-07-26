//SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface ConfigurableInterestVaultConfig {
    function interestModel() external view returns (address);
}
