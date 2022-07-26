//SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

/**
 * @title Compound's InterestRateModel Interface
 * @author Compound
 */
interface IAlpacaInterestRateModel {
    /**
     * @notice Calculates the current borrow interest rate per second
     * @param debt The total amount of cash the market has
     * @param floating The total amount of reserves the market has
     * @return The borrow rate per second (as a percentage, and scaled by 1e18)
     */
    function getInterestRate(uint256 debt, uint256 floating) external view returns (uint256);
}
