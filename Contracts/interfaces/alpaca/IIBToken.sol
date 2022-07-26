//SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

interface IIBToken is IERC20Upgradeable {
    function decimals() external view returns (uint8);

    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function config() external view returns (address);

    function totalToken() external view returns (uint256);

    function vaultDebtVal() external view returns (uint256);

    function pendingInterest(uint256 value) external view returns (uint256);

    function deposit(uint256 amountToken) external;

    function withdraw(uint256 share) external;

    function increaseAllowance(address spender, uint256 addedValue) external;
}
