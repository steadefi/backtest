//SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface IFairLaunchV2 {
    struct UserInfo {
        uint256 amount;
        uint256 rewardDebt;
        uint256 bonusDebt;
        address fundedBy;
    }
    struct PoolInfo {
        address stakeToken;
        uint256 allocPoint;
        uint256 lastRewardBlock;
        uint256 accAlpacaPerShare;
        uint256 accAlpacaPerShareTilBonusEnd;
    }

    /**
     * @return ALPACA tokens distributed per block for user who stake ibTokens in fairLaunch
     */
    function alpacaPerBlock() external view returns (uint256);

    /**
     * @return total allocation point for all staking pool
     */
    function totalAllocPoint() external view returns (uint256);

    /**
     * @param _pid pool ID of the ibTokens
     * @param _user user address
     * @return the amount of ALPACA tokens pending for withdrawal
     */
    function pendingAlpaca(uint256 _pid, address _user) external view returns (uint256);

    /**
     * @dev mainly used for receiving allocation point of a staking pool
     * @param pid pool ID of the ibTokens
     * @return the info of the ibToken staking pool
     */
    function poolInfo(uint256 pid) external view returns (IFairLaunchV2.PoolInfo memory);

    /**
     * @dev mainly used for receiveing amount of ibTokens currently being staked
     * @param pid pool ID of the ibTokens
     * @param user user address
     * @return the user information in the ibToken staking pool
     */
    function userInfo(uint256 pid, address user) external view returns (IFairLaunchV2.UserInfo memory);

    /**
     * @dev stake ibTokens
     * @param _for the address which stake the ibTokens
     * @param _pid pool ID of the ibTokens
     * @param _amount the amount of ibTokens being staked
     */
    function deposit(
        address _for,
        uint256 _pid,
        uint256 _amount
    ) external;

    /**
     * @dev unstake ibTokens
     * @param _for the address which stake the ibTokens
     * @param _pid pool ID of the ibTokens
     * @param _amount the amount of ibTokens being unstaked
     */
    function withdraw(
        address _for,
        uint256 _pid,
        uint256 _amount
    ) external;

    /**
     * @dev unstake all ibTokens
     * @param _for the address which stake the ibTokens
     * @param _pid pool ID of the ibTokens
     */
    function withdrawAll(address _for, uint256 _pid) external;

    /**
     * @dev collect pending ALPACA tokens
     * @param _pid pool ID of the ibTokens
     */
    function harvest(uint256 _pid) external;
}
