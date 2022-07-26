//SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface IWorker {
    function shares(uint256 id) external view returns (uint256);

    function health(uint256 id) external view returns (uint256);

    function shareToBalance(uint256 share) external view returns (uint256);

    function balanceToShare(uint256 balance) external view returns (uint256);
}
