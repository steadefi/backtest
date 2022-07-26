//SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface IIBTokenConfig {
    function getReservePoolBps() external view returns (uint256);
}
