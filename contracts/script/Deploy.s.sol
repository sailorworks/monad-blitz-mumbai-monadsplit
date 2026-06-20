// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TestnetUSDC.sol";
import "../src/AgentRegistry.sol";
import "../src/VendorAllowlist.sol";
import "../src/AuditLogger.sol";
import "../src/TreasuryVault.sol";
import "../src/EmergencyKillSwitch.sol";
import "../src/BudgetPolicyManager.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        TestnetUSDC usdc = new TestnetUSDC();
        AgentRegistry registry = new AgentRegistry(deployerAddress);
        VendorAllowlist allowlist = new VendorAllowlist(deployerAddress);
        AuditLogger auditLogger = new AuditLogger(deployerAddress);
        TreasuryVault vault = new TreasuryVault(deployerAddress, address(usdc));
        EmergencyKillSwitch killSwitch = new EmergencyKillSwitch(deployerAddress, address(registry), address(auditLogger));
        
        BudgetPolicyManager policyManager = new BudgetPolicyManager(
            deployerAddress,
            address(registry),
            address(allowlist),
            address(vault),
            address(auditLogger),
            address(killSwitch)
        );

        // Roles wiring
        vault.setPolicyManager(address(policyManager));
        registry.grantRole(registry.OPERATOR_ROLE(), address(killSwitch));
        registry.grantRole(registry.OPERATOR_ROLE(), address(policyManager));
        auditLogger.grantRole(auditLogger.LOGGER_ROLE(), address(policyManager));
        auditLogger.grantRole(auditLogger.LOGGER_ROLE(), address(killSwitch));

        vm.stopBroadcast();
        
        console.log("Mock TestnetUSDC deployed at:", address(usdc));
        console.log("AgentRegistry deployed at:", address(registry));
        console.log("VendorAllowlist deployed at:", address(allowlist));
        console.log("AuditLogger deployed at:", address(auditLogger));
        console.log("TreasuryVault deployed at:", address(vault));
        console.log("EmergencyKillSwitch deployed at:", address(killSwitch));
        console.log("BudgetPolicyManager deployed at:", address(policyManager));
    }
}
