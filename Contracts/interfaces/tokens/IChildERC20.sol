//SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/IAccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

interface IChildERC20 is IAccessControl, IERC20Metadata {
    function deposit(address user, bytes calldata depositData) external;
}
