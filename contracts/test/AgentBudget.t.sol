// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/AgentRegistry.sol";
import "../src/VendorAllowlist.sol";
import "../src/AuditLogger.sol";
import "../src/TreasuryVault.sol";
import "../src/EmergencyKillSwitch.sol";
import "../src/BudgetPolicyManager.sol";

/// @dev Minimal ERC20 mock for USDC in tests
contract MockUSDC {
    string public name = "USD Coin";
    string public symbol = "USDC";
    uint8 public decimals = 6;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }
}

/// @title AgentBudgetTest
/// @notice Full integration tests for the AgentBudget contract suite
contract AgentBudgetTest is Test {
    // Contracts
    AgentRegistry public registry;
    VendorAllowlist public allowlist;
    AuditLogger public auditLogger;
    TreasuryVault public vault;
    EmergencyKillSwitch public killSwitch;
    BudgetPolicyManager public policyManager;
    MockUSDC public usdc;

    // Actors
    address public admin = address(0xA11CE);
    address public company = address(0xC0FFEE);
    address public agentWallet = address(0xA9E11);
    address public vendorOpenAI = address(0x0A1);
    address public vendorFirecrawl = address(0x0F1);
    address public unknownVendor = address(0xBAD);

    // Agent
    bytes32 public agentId = keccak256("research-agent");

    // Budget: 100 USDC daily, 2000 USDC monthly, 10 USDC per-tx, 0 cooldown
    uint256 constant DAILY_LIMIT   = 100e6;
    uint256 constant MONTHLY_LIMIT = 2000e6;
    uint256 constant PER_TX_LIMIT  = 10e6;
    uint256 constant COOLDOWN      = 0;
    uint256 constant VAULT_DEPOSIT = 1000e6;

    function setUp() public {
        vm.startPrank(admin);

        // 1. Deploy all contracts
        usdc = new MockUSDC();
        registry = new AgentRegistry(admin);
        allowlist = new VendorAllowlist(admin);
        auditLogger = new AuditLogger(admin);
        vault = new TreasuryVault(admin, address(usdc));
        killSwitch = new EmergencyKillSwitch(admin, address(registry), address(auditLogger));
        policyManager = new BudgetPolicyManager(
            admin,
            address(registry),
            address(allowlist),
            address(vault),
            address(auditLogger),
            address(killSwitch)
        );

        // 2. Wire up roles
        vault.setPolicyManager(address(policyManager));
        registry.grantRole(registry.OPERATOR_ROLE(), address(killSwitch));
        registry.grantRole(registry.OPERATOR_ROLE(), address(policyManager)); // needed for incrementRiskScore
        auditLogger.grantRole(auditLogger.LOGGER_ROLE(), address(policyManager));
        auditLogger.grantRole(auditLogger.LOGGER_ROLE(), address(killSwitch));

        // 3. Register agent
        registry.registerAgent(agentId, agentWallet, company);

        // 4. Add approved vendors
        allowlist.addVendor(vendorOpenAI, "OpenAI");
        allowlist.addVendor(vendorFirecrawl, "Firecrawl");

        // 5. Set budget policy for agent
        policyManager.setPolicy(agentId, DAILY_LIMIT, MONTHLY_LIMIT, PER_TX_LIMIT, COOLDOWN, false);

        // 6. Fund vault (company deposits USDC)
        usdc.mint(company, VAULT_DEPOSIT);

        // 7. Grant AGENT_ROLE to admin AND to address(this) so tests can call checkSpend directly.
        //    vm.expectRevert inside vm.startPrank sends the reverted call as address(this),
        //    so both addresses need the role.
        policyManager.grantRole(policyManager.AGENT_ROLE(), admin);
        policyManager.grantRole(policyManager.AGENT_ROLE(), address(this));

        vm.stopPrank();

        vm.startPrank(company);
        usdc.approve(address(vault), VAULT_DEPOSIT);
        vault.deposit(VAULT_DEPOSIT);
        vm.stopPrank();
    }

    // ─────────────────────────────────────────────────────────
    //  AgentRegistry Tests
    // ─────────────────────────────────────────────────────────

    function test_AgentRegistered() public view {
        AgentRegistry.Agent memory agent = registry.getAgent(agentId);
        assertEq(agent.wallet, agentWallet);
        assertEq(agent.owner, company);
        assertEq(uint8(agent.status), uint8(AgentRegistry.AgentStatus.Active));
        assertEq(agent.riskScore, 0);
    }

    function test_DuplicateRegistration_Reverts() public {
        vm.prank(admin);
        vm.expectRevert(abi.encodeWithSelector(AgentRegistry.AgentAlreadyExists.selector, agentId));
        registry.registerAgent(agentId, agentWallet, company);
    }

    function test_AgentStatusUpdate() public {
        vm.prank(admin);
        registry.updateAgentStatus(agentId, AgentRegistry.AgentStatus.Paused);
        assertFalse(registry.isAgentActive(agentId));
    }

    function test_RiskScoreIncrement() public {
        vm.prank(admin);
        registry.incrementRiskScore(agentId, 10);
        AgentRegistry.Agent memory agent = registry.getAgent(agentId);
        assertEq(agent.riskScore, 10);
    }

    // ─────────────────────────────────────────────────────────
    //  VendorAllowlist Tests
    // ─────────────────────────────────────────────────────────

    function test_VendorApproved() public view {
        assertTrue(allowlist.isApprovedVendor(vendorOpenAI));
        assertTrue(allowlist.isApprovedVendor(vendorFirecrawl));
    }

    function test_UnknownVendorNotApproved() public view {
        assertFalse(allowlist.isApprovedVendor(unknownVendor));
    }

    function test_RemoveVendor() public {
        vm.prank(admin);
        allowlist.removeVendor(vendorOpenAI);
        assertFalse(allowlist.isApprovedVendor(vendorOpenAI));
    }

    function test_DuplicateVendor_Reverts() public {
        vm.prank(admin);
        vm.expectRevert(abi.encodeWithSelector(VendorAllowlist.VendorAlreadyApproved.selector, vendorOpenAI));
        allowlist.addVendor(vendorOpenAI, "OpenAI Duplicate");
    }

    // ─────────────────────────────────────────────────────────
    //  TreasuryVault Tests
    // ─────────────────────────────────────────────────────────

    function test_VaultDepositedCorrectly() public view {
        assertEq(vault.vaultBalance(), VAULT_DEPOSIT);
    }

    function test_VaultWithdraw() public {
        vm.prank(admin);
        vault.withdraw(company, 100e6);
        assertEq(vault.vaultBalance(), VAULT_DEPOSIT - 100e6);
    }

    function test_DirectDisburse_OnlyPolicyManager() public {
        vm.prank(company); // not policy manager
        vm.expectRevert();
        vault.disburse(agentId, vendorOpenAI, 5e6);
    }

    // ─────────────────────────────────────────────────────────
    //  BudgetPolicyManager — Happy Path Tests
    // ─────────────────────────────────────────────────────────

    function test_HappyPath_SpendApproved() public {
        uint256 spendAmount = 5e6; // 5 USDC
        uint256 vendorBalanceBefore = usdc.balanceOf(vendorOpenAI);

        vm.prank(admin);
        bool success = policyManager.checkSpend(agentId, vendorOpenAI, spendAmount);
        assertTrue(success);

        // Vendor received USDC
        assertEq(usdc.balanceOf(vendorOpenAI), vendorBalanceBefore + spendAmount);
        // Vault decreased
        assertEq(vault.vaultBalance(), VAULT_DEPOSIT - spendAmount);
        // Daily spend recorded
        (uint256 daily,,,) = policyManager.getSpend(agentId);
        assertEq(daily, spendAmount);
    }

    function test_MultipleSpends_AccumulateCorrectly() public {
        vm.startPrank(admin);
        assertTrue(policyManager.checkSpend(agentId, vendorOpenAI, 5e6));
        assertTrue(policyManager.checkSpend(agentId, vendorFirecrawl, 3e6));
        vm.stopPrank();

        (uint256 daily,,,) = policyManager.getSpend(agentId);
        assertEq(daily, 8e6);
    }

    // ─────────────────────────────────────────────────────────
    //  BudgetPolicyManager — Rejection Tests
    // ─────────────────────────────────────────────────────────

    function test_Reject_UnknownVendor() public {
        vm.prank(admin);
        bool success = policyManager.checkSpend(agentId, unknownVendor, 5e6);
        assertFalse(success);

        // Verify risk score was persisted on-chain (not reverted)
        AgentRegistry.Agent memory agent = registry.getAgent(agentId);
        assertEq(agent.riskScore, 5);

        // Verify no USDC was transferred
        assertEq(vault.vaultBalance(), VAULT_DEPOSIT);
    }

    function test_Reject_ExceedsPerTxLimit() public {
        vm.prank(admin);
        bool success = policyManager.checkSpend(agentId, vendorOpenAI, 11e6); // limit is 10
        assertFalse(success);

        // Verify risk score was persisted on-chain
        AgentRegistry.Agent memory agent = registry.getAgent(agentId);
        assertEq(agent.riskScore, 3);

        // Verify no USDC was transferred
        assertEq(vault.vaultBalance(), VAULT_DEPOSIT);
    }

    function test_Reject_ExceedsDailyLimit() public {
        vm.startPrank(admin);
        // Burn through daily limit in chunks
        for (uint256 i = 0; i < 10; i++) {
            assertTrue(policyManager.checkSpend(agentId, vendorOpenAI, 10e6)); // 10 * 10 = 100 USDC = daily limit
        }
        // Next spend should fail but NOT revert — rejection is persisted
        bool success = policyManager.checkSpend(agentId, vendorOpenAI, 1e6);
        assertFalse(success);
        vm.stopPrank();

        // Verify risk score was persisted on-chain
        AgentRegistry.Agent memory agent = registry.getAgent(agentId);
        assertEq(agent.riskScore, 2);
    }

    function test_Reject_AgentNotActive() public {
        // Pause agent first
        vm.prank(admin);
        killSwitch.pauseAgent(agentId);

        vm.prank(admin);
        bool success = policyManager.checkSpend(agentId, vendorOpenAI, 5e6);
        assertFalse(success);

        // Verify no USDC was transferred
        assertEq(vault.vaultBalance(), VAULT_DEPOSIT);
    }

    function test_Reject_CooldownNotElapsed() public {
        // Set policy with a 60 second cooldown
        vm.startPrank(admin);
        policyManager.setPolicy(agentId, DAILY_LIMIT, MONTHLY_LIMIT, PER_TX_LIMIT, 60, false);
        assertTrue(policyManager.checkSpend(agentId, vendorOpenAI, 5e6)); // first spend OK
        // Second spend immediately should fail but persist rejection log
        bool success = policyManager.checkSpend(agentId, vendorOpenAI, 5e6);
        assertFalse(success);
        vm.stopPrank();
    }

    function test_Cooldown_PassesAfterWait() public {
        vm.startPrank(admin);
        policyManager.setPolicy(agentId, DAILY_LIMIT, MONTHLY_LIMIT, PER_TX_LIMIT, 60, false);
        assertTrue(policyManager.checkSpend(agentId, vendorOpenAI, 5e6));
        // Fast-forward 61 seconds
        vm.warp(block.timestamp + 61);
        // Should succeed now
        assertTrue(policyManager.checkSpend(agentId, vendorOpenAI, 5e6));
        vm.stopPrank();
    }

    function test_DailyCycleReset() public {
        // Burn through most of daily limit
        vm.startPrank(admin);
        for (uint256 i = 0; i < 9; i++) {
            assertTrue(policyManager.checkSpend(agentId, vendorOpenAI, 10e6));
        }
        // Warp 1 day forward — cycle should reset
        vm.warp(block.timestamp + 1 days + 1);
        // Should be able to spend again
        assertTrue(policyManager.checkSpend(agentId, vendorOpenAI, 10e6));
        vm.stopPrank();
        (uint256 daily,,,) = policyManager.getSpend(agentId);
        assertEq(daily, 10e6);
    }

    // ─────────────────────────────────────────────────────────
    //  EmergencyKillSwitch Tests
    // ─────────────────────────────────────────────────────────

    function test_GlobalPause_BlocksAllSpends() public {
        vm.prank(admin);
        killSwitch.pauseAll();
        assertTrue(killSwitch.isGloballyPaused());

        vm.prank(admin);
        bool success = policyManager.checkSpend(agentId, vendorOpenAI, 5e6);
        assertFalse(success);

        // Verify no USDC was transferred
        assertEq(vault.vaultBalance(), VAULT_DEPOSIT);
    }

    function test_GlobalUnpause_ResumesSpends() public {
        vm.startPrank(admin);
        killSwitch.pauseAll();
        killSwitch.unpauseAll();
        assertFalse(killSwitch.isGloballyPaused());
        // Spend should work again
        assertTrue(policyManager.checkSpend(agentId, vendorOpenAI, 5e6));
        vm.stopPrank();
    }

    function test_KillAgent_IsPermanent() public {
        vm.prank(admin);
        killSwitch.killAgent(agentId);

        AgentRegistry.Agent memory agent = registry.getAgent(agentId);
        assertEq(uint8(agent.status), uint8(AgentRegistry.AgentStatus.Killed));

        vm.prank(admin);
        bool success = policyManager.checkSpend(agentId, vendorOpenAI, 5e6);
        assertFalse(success);
    }

    function test_PauseAndUnpauseSingleAgent() public {
        vm.startPrank(admin);
        killSwitch.pauseAgent(agentId);
        assertFalse(registry.isAgentActive(agentId));
        killSwitch.unpauseAgent(agentId);
        assertTrue(registry.isAgentActive(agentId));
        vm.stopPrank();
    }

    // ─────────────────────────────────────────────────────────
    //  Risk Score Tests (incremented on bad behaviour)
    // ─────────────────────────────────────────────────────────

    function test_RiskScore_IncreasesOnUnknownVendor() public {
        // With the non-reverting pattern, risk score is now persisted end-to-end
        vm.prank(admin);
        bool success = policyManager.checkSpend(agentId, unknownVendor, 5e6);
        assertFalse(success);

        AgentRegistry.Agent memory agent = registry.getAgent(agentId);
        assertEq(agent.riskScore, 5); // +5 for unknown vendor
    }

    function test_RiskScore_IncreasesOnExceedLimit() public {
        // With the non-reverting pattern, risk score is now persisted end-to-end
        vm.prank(admin);
        bool success = policyManager.checkSpend(agentId, vendorOpenAI, 11e6); // exceeds per-tx limit
        assertFalse(success);

        AgentRegistry.Agent memory agent = registry.getAgent(agentId);
        assertEq(agent.riskScore, 3); // +3 for exceeding per-tx limit
    }
}
