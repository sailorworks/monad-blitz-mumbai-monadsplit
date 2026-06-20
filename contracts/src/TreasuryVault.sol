// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title TreasuryVault
/// @notice Holds the company's USDC pool. Only the BudgetPolicyManager can disburse funds.
contract TreasuryVault is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant POLICY_MANAGER_ROLE = keccak256("POLICY_MANAGER_ROLE");

    IERC20 public immutable usdc;

    event Deposited(address indexed depositor, uint256 amount);
    event Withdrawn(address indexed recipient, uint256 amount);
    event Disbursed(bytes32 indexed agentId, address indexed vendor, uint256 amount);

    error InsufficientVaultBalance(uint256 requested, uint256 available);
    error ZeroAmount();

    constructor(address admin, address _usdc) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        usdc = IERC20(_usdc);
    }

    /// @notice Grant the BudgetPolicyManager permission to disburse funds
    function setPolicyManager(address policyManager) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(POLICY_MANAGER_ROLE, policyManager);
    }

    /// @notice Company deposits USDC into the vault
    function deposit(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        emit Deposited(msg.sender, amount);
    }

    /// @notice Company withdraws excess USDC from the vault
    function withdraw(address to, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        if (amount == 0) revert ZeroAmount();
        uint256 balance = usdc.balanceOf(address(this));
        if (amount > balance) revert InsufficientVaultBalance(amount, balance);
        usdc.safeTransfer(to, amount);
        emit Withdrawn(to, amount);
    }

    /// @notice Called exclusively by BudgetPolicyManager after a successful checkSpend()
    function disburse(bytes32 agentId, address vendor, uint256 amount)
        external
        onlyRole(POLICY_MANAGER_ROLE)
        nonReentrant
    {
        if (amount == 0) revert ZeroAmount();
        uint256 balance = usdc.balanceOf(address(this));
        if (amount > balance) revert InsufficientVaultBalance(amount, balance);
        usdc.safeTransfer(vendor, amount);
        emit Disbursed(agentId, vendor, amount);
    }

    /// @notice View vault USDC balance
    function vaultBalance() external view returns (uint256) {
        return usdc.balanceOf(address(this));
    }
}
