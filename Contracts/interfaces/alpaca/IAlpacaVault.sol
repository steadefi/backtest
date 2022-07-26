//SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface IAlpacaVault {
    struct Position {
        address worker;
        address owner;
        uint256 debtShare;
    }

    function nextPositionID() external view returns (uint256);

    function positionInfo(uint256 id) external view returns (uint256 positionVal, uint256 debtVal);

    function debtShareToVal(uint256 debtShare) external view returns (uint256);

    function debtValToShare(uint256 debtVal) external view returns (uint256);

    function positions(uint256 id) external view returns (Position memory);

    function token() external view returns (address);
}
