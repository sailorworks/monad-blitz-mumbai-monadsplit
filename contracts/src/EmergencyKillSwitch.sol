// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./AgentRegistry.sol";
import "./AuditLogger.sol";

/// @title EmergencyKillSwitch
/// @notice The "big red button" - allows the owner to halt all or individual agent activity instantly.
contract EmergencyKillSwitch is AccessControl, Pausable {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    AgentRegistry public immutable agentRegistry;
    AuditLogger public immutable auditLogger;

    event AgentKilled(bytes32 indexed agentId, address indexed triggeredBy);
    event AgentPaused(bytes32 indexed agentId, address indexed triggeredBy);
    event AgentUnpaused(bytes32 indexed agentId, address indexed triggeredBy);

    constructor(address admin, address _agentRegistry, address _auditLogger) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
        agentRegistry = AgentRegistry(_agentRegistry);
        auditLogger = AuditLogger(_auditLogger);
    }

    /// @notice Pause a single agent
    function pauseAgent(bytes32 agentId) external onlyRole(OPERATOR_ROLE) {
        agentRegistry.updateAgentStatus(agentId, AgentRegistry.AgentStatus.Paused);
        auditLogger.logAgentPause(agentId, "Manually paused via kill switch");
        emit AgentPaused(agentId, msg.sender);
    }

    /// @notice Permanently kill a single agent (irreversible)
    function killAgent(bytes32 agentId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        agentRegistry.updateAgentStatus(agentId, AgentRegistry.AgentStatus.Killed);
        auditLogger.logAgentPause(agentId, "Agent permanently killed");
        emit AgentKilled(agentId, msg.sender);
    }

    /// @notice Reactivate a paused agent
    function unpauseAgent(bytes32 agentId) external onlyRole(OPERATOR_ROLE) {
        agentRegistry.updateAgentStatus(agentId, AgentRegistry.AgentStatus.Active);
        emit AgentUnpaused(agentId, msg.sender);
    }

    /// @notice Globally pause ALL agent activity (protocol-wide pause)
    function pauseAll() external onlyRole(OPERATOR_ROLE) {
        _pause();
        auditLogger.logGlobalPause(true);
    }

    /// @notice Resume protocol-wide activity
    function unpauseAll() external onlyRole(OPERATOR_ROLE) {
        _unpause();
        auditLogger.logGlobalPause(false);
    }

    /// @notice Check if protocol is globally paused
    function isGloballyPaused() external view returns (bool) {
        return paused();
    }
}
