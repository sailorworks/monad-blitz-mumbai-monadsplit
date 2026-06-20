export const CONTRACTS = {
  TestnetUSDC:        '0xc8940dd62f5c47c098f575b4cf0e65b091e9ac9e',
  AgentRegistry:      '0x4c3c777a41a03b205f76b0a645f790c247fbf65a',
  VendorAllowlist:    '0x6a25a092f42a4fdfd3d3734d830c55e30c414260',
  AuditLogger:        '0xeedbf11f9c25ef36bb4e04f509844de6753d4d2d',
  TreasuryVault:      '0x77fa2731d57eb6b6af683491c2c3ec81fa7e8792',
  EmergencyKillSwitch:'0xb3746adc212d6a62aa85c9bd2909c5d46de06378',
  BudgetPolicyManager:'0x40a7f83c20e6038426a0130e39bf26908e52db09',
} as const;

// Minimal ABIs required for the frontend
export const AGENT_REGISTRY_ABI = [
  "function getAgent(uint256 agentId) external view returns (address owner, uint256 riskScore, bool isActive, uint256 registeredAt)",
  "function getAllAgentIds() external view returns (uint256[])",
  "function registerAgent(address owner) external returns (uint256)",
] as const;

export const BUDGET_POLICY_MANAGER_ABI = [
  "function getSpend(uint256 agentId) external view returns (uint256 daily, uint256 monthly)",
  "function setPolicy(uint256 agentId, uint256 dailyLimit, uint256 monthlyLimit) external",
] as const;

export const EMERGENCY_KILL_SWITCH_ABI = [
  "function isGloballyPaused() external view returns (bool)",
  "function pauseAgent(uint256 agentId) external",
  "function killAgent(uint256 agentId) external",
] as const;

export const TREASURY_VAULT_ABI = [
  "function vaultBalance() external view returns (uint256)",
] as const;

export const AUDIT_LOGGER_ABI = [
  "event SpendApproved(uint256 indexed agentId, address indexed vendor, uint256 amount, uint256 timestamp)",
  "event SpendRejected(uint256 indexed agentId, address indexed vendor, uint256 amount, string reason, uint256 timestamp)",
  "event AgentPaused(uint256 indexed agentId, string reason, uint256 timestamp)",
  "event GlobalPause(bool paused, uint256 timestamp)",
] as const;
