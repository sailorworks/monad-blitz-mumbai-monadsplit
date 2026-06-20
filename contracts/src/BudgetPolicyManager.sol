// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./AgentRegistry.sol";
import "./VendorAllowlist.sol";
import "./TreasuryVault.sol";
import "./AuditLogger.sol";
import "./EmergencyKillSwitch.sol";

/// @title BudgetPolicyManager
/// @notice The core engine. Enforces spending limits and orchestrates the x402 payment flow.
/// @dev This is the single entry point for every spend attempt. It coordinates all other contracts.
contract BudgetPolicyManager is AccessControl {
    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");

    AgentRegistry public immutable agentRegistry;
    VendorAllowlist public immutable vendorAllowlist;
    TreasuryVault public immutable treasuryVault;
    AuditLogger public immutable auditLogger;
    EmergencyKillSwitch public immutable killSwitch;

    struct BudgetPolicy {
        uint256 dailyLimit;       // in USDC (6 decimals)
        uint256 monthlyLimit;     // in USDC (6 decimals)
        uint256 perTxLimit;       // in USDC (6 decimals)
        uint256 cooldown;         // seconds between spends
        uint256 lastSpendTimestamp;
        uint256 currentDailySpend;
        uint256 currentMonthlySpend;
        uint256 dailyCycleStart;
        uint256 monthlyCycleStart;
    }

    mapping(bytes32 => BudgetPolicy) public policies;

    event PolicySet(bytes32 indexed agentId, uint256 dailyLimit, uint256 monthlyLimit, uint256 perTxLimit);
    event SpendExecuted(bytes32 indexed agentId, address indexed vendor, uint256 amount);
    event SpendBlocked(bytes32 indexed agentId, address indexed vendor, uint256 amount, string reason);

    error PolicyNotSet(bytes32 agentId);
    error CheckFailed(string reason);

    constructor(
        address admin,
        address _agentRegistry,
        address _vendorAllowlist,
        address _treasuryVault,
        address _auditLogger,
        address _killSwitch
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(AGENT_ROLE, admin);
        agentRegistry = AgentRegistry(_agentRegistry);
        vendorAllowlist = VendorAllowlist(_vendorAllowlist);
        treasuryVault = TreasuryVault(_treasuryVault);
        auditLogger = AuditLogger(_auditLogger);
        killSwitch = EmergencyKillSwitch(_killSwitch);
    }

    /// @notice Set or update a budget policy for an agent
    function setPolicy(
        bytes32 agentId,
        uint256 dailyLimit,
        uint256 monthlyLimit,
        uint256 perTxLimit,
        uint256 cooldown,
        bool resetSpend
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        BudgetPolicy storage p = policies[agentId];
        p.dailyLimit = dailyLimit;
        p.monthlyLimit = monthlyLimit;
        p.perTxLimit = perTxLimit;
        p.cooldown = cooldown;
        // Initialize cycle timestamps if first time
        if (p.dailyCycleStart == 0) {
            p.dailyCycleStart = block.timestamp;
            p.monthlyCycleStart = block.timestamp;
        }

        if (resetSpend) {
            p.currentDailySpend = 0;
            p.currentMonthlySpend = 0;
            p.dailyCycleStart = block.timestamp;
            p.monthlyCycleStart = block.timestamp;
            p.lastSpendTimestamp = 0;
        }

        emit PolicySet(agentId, dailyLimit, monthlyLimit, perTxLimit);
    }

    /// @notice Main entry point for the x402 payment flow.
    /// @dev Called by the agent after receiving HTTP 402 from a vendor.
    ///      Returns true if approved and USDC is disbursed, false if rejected.
    ///      On rejection, the audit log and risk score updates are persisted on-chain
    ///      (no revert), ensuring an immutable trail of all spend attempts.
    function checkSpend(bytes32 agentId, address vendor, uint256 amount) external onlyRole(AGENT_ROLE) returns (bool) {
        BudgetPolicy storage p = policies[agentId];

        // --- Guard: Policy must exist ---
        if (p.dailyLimit == 0 && p.monthlyLimit == 0 && p.perTxLimit == 0) {
            string memory reason = "No policy set for agent";
            auditLogger.logRejection(agentId, vendor, amount, reason);
            agentRegistry.incrementRiskScore(agentId, 1);
            emit SpendBlocked(agentId, vendor, amount, reason);
            return false;
        }

        // --- Check 1: Global kill switch ---
        if (killSwitch.isGloballyPaused()) {
            string memory reason = "Protocol globally paused";
            auditLogger.logRejection(agentId, vendor, amount, reason);
            emit SpendBlocked(agentId, vendor, amount, reason);
            return false;
        }

        // --- Check 2: Agent active ---
        if (!agentRegistry.isAgentActive(agentId)) {
            string memory reason = "Agent not active";
            auditLogger.logRejection(agentId, vendor, amount, reason);
            emit SpendBlocked(agentId, vendor, amount, reason);
            return false;
        }

        // --- Check 3: Vendor approved ---
        if (!vendorAllowlist.isApprovedVendor(vendor)) {
            string memory reason = "Vendor not on allowlist";
            auditLogger.logRejection(agentId, vendor, amount, reason);
            agentRegistry.incrementRiskScore(agentId, 5);
            emit SpendBlocked(agentId, vendor, amount, reason);
            return false;
        }

        // --- Check 4: Per-tx limit ---
        if (amount > p.perTxLimit) {
            string memory reason = "Exceeds per-tx limit";
            auditLogger.logRejection(agentId, vendor, amount, reason);
            agentRegistry.incrementRiskScore(agentId, 3);
            emit SpendBlocked(agentId, vendor, amount, reason);
            return false;
        }

        // --- Check 5: Cooldown ---
        if (p.lastSpendTimestamp > 0 && block.timestamp < p.lastSpendTimestamp + p.cooldown) {
            string memory reason = "Cooldown period not elapsed";
            auditLogger.logRejection(agentId, vendor, amount, reason);
            emit SpendBlocked(agentId, vendor, amount, reason);
            return false;
        }

        // --- Reset daily/monthly cycles if needed ---
        _resetCyclesIfNeeded(p);

        // --- Check 6: Daily limit ---
        if (p.currentDailySpend + amount > p.dailyLimit) {
            string memory reason = "Exceeds daily limit";
            auditLogger.logRejection(agentId, vendor, amount, reason);
            agentRegistry.incrementRiskScore(agentId, 2);
            emit SpendBlocked(agentId, vendor, amount, reason);
            return false;
        }

        // --- Check 7: Monthly limit ---
        if (p.currentMonthlySpend + amount > p.monthlyLimit) {
            string memory reason = "Exceeds monthly limit";
            auditLogger.logRejection(agentId, vendor, amount, reason);
            agentRegistry.incrementRiskScore(agentId, 2);
            emit SpendBlocked(agentId, vendor, amount, reason);
            return false;
        }

        // --- All checks passed: execute payment ---
        p.currentDailySpend += amount;
        p.currentMonthlySpend += amount;
        p.lastSpendTimestamp = block.timestamp;

        treasuryVault.disburse(agentId, vendor, amount);
        auditLogger.logApproval(agentId, vendor, amount);
        emit SpendExecuted(agentId, vendor, amount);
        return true;
    }

    /// @notice Get current spend for an agent
    function getSpend(bytes32 agentId)
        external
        view
        returns (uint256 dailySpend, uint256 monthlySpend, uint256 dailyLimit, uint256 monthlyLimit)
    {
        BudgetPolicy storage p = policies[agentId];
        return (p.currentDailySpend, p.currentMonthlySpend, p.dailyLimit, p.monthlyLimit);
    }

    /// @dev Reset daily/monthly accumulators if the cycle period has elapsed
    function _resetCyclesIfNeeded(BudgetPolicy storage p) internal {
        if (block.timestamp >= p.dailyCycleStart + 1 days) {
            p.currentDailySpend = 0;
            p.dailyCycleStart = block.timestamp;
        }
        if (block.timestamp >= p.monthlyCycleStart + 30 days) {
            p.currentMonthlySpend = 0;
            p.monthlyCycleStart = block.timestamp;
        }
    }
}
