// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title AgentRegistry
/// @notice Manages the lifecycle, ownership, and status of autonomous AI agents.
contract AgentRegistry is AccessControl {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    enum AgentStatus {
        Active,
        Paused,
        Killed
    }

    struct Agent {
        address wallet;
        address owner;
        AgentStatus status;
        uint256 riskScore;
        uint256 registeredAt;
    }

    mapping(bytes32 => Agent) public agents;
    bytes32[] public agentIds;

    event AgentRegistered(bytes32 indexed agentId, address indexed wallet, address indexed owner);
    event AgentStatusUpdated(bytes32 indexed agentId, AgentStatus newStatus);
    event RiskScoreIncremented(bytes32 indexed agentId, uint256 newScore);

    error AgentAlreadyExists(bytes32 agentId);
    error AgentNotFound(bytes32 agentId);
    error AgentNotActive(bytes32 agentId);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
    }

    /// @notice Register a new agent
    function registerAgent(bytes32 agentId, address wallet, address owner) external onlyRole(OPERATOR_ROLE) {
        if (agents[agentId].wallet != address(0)) revert AgentAlreadyExists(agentId);
        agents[agentId] = Agent({
            wallet: wallet,
            owner: owner,
            status: AgentStatus.Active,
            riskScore: 0,
            registeredAt: block.timestamp
        });
        agentIds.push(agentId);
        emit AgentRegistered(agentId, wallet, owner);
    }

    /// @notice Update agent status (pause/kill/reactivate)
    function updateAgentStatus(bytes32 agentId, AgentStatus newStatus) external onlyRole(OPERATOR_ROLE) {
        if (agents[agentId].wallet == address(0)) revert AgentNotFound(agentId);
        agents[agentId].status = newStatus;
        emit AgentStatusUpdated(agentId, newStatus);
    }

    /// @notice Increment agent risk score after a rejected spend attempt
    function incrementRiskScore(bytes32 agentId, uint256 amount) external onlyRole(OPERATOR_ROLE) {
        if (agents[agentId].wallet == address(0)) revert AgentNotFound(agentId);
        agents[agentId].riskScore += amount;
        emit RiskScoreIncremented(agentId, agents[agentId].riskScore);
    }

    /// @notice Check if agent is active
    function isAgentActive(bytes32 agentId) external view returns (bool) {
        return agents[agentId].status == AgentStatus.Active;
    }

    /// @notice Get all registered agent IDs
    function getAllAgentIds() external view returns (bytes32[] memory) {
        return agentIds;
    }

    /// @notice Get agent details
    function getAgent(bytes32 agentId) external view returns (Agent memory) {
        if (agents[agentId].wallet == address(0)) revert AgentNotFound(agentId);
        return agents[agentId];
    }
}
