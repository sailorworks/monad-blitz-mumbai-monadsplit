// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title AuditLogger
/// @notice Records every spend attempt immutably on-chain via events.
contract AuditLogger is AccessControl {
    bytes32 public constant LOGGER_ROLE = keccak256("LOGGER_ROLE");

    event SpendApproved(
        bytes32 indexed agentId,
        address indexed vendor,
        uint256 amount,
        uint256 timestamp
    );

    event SpendRejected(
        bytes32 indexed agentId,
        address indexed vendor,
        uint256 amount,
        string reason,
        uint256 timestamp
    );

    event AgentPaused(bytes32 indexed agentId, string reason, uint256 timestamp);
    event GlobalPause(bool paused, uint256 timestamp);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(LOGGER_ROLE, admin);
    }

    /// @notice Log a successful spend approval
    function logApproval(bytes32 agentId, address vendor, uint256 amount) external onlyRole(LOGGER_ROLE) {
        emit SpendApproved(agentId, vendor, amount, block.timestamp);
    }

    /// @notice Log a rejected spend attempt
    function logRejection(bytes32 agentId, address vendor, uint256 amount, string calldata reason)
        external
        onlyRole(LOGGER_ROLE)
    {
        emit SpendRejected(agentId, vendor, amount, reason, block.timestamp);
    }

    /// @notice Log an agent pause event
    function logAgentPause(bytes32 agentId, string calldata reason) external onlyRole(LOGGER_ROLE) {
        emit AgentPaused(agentId, reason, block.timestamp);
    }

    /// @notice Log a global pause/unpause
    function logGlobalPause(bool paused) external onlyRole(LOGGER_ROLE) {
        emit GlobalPause(paused, block.timestamp);
    }
}
