// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title VendorAllowlist
/// @notice Maintains the registry of approved vendors an agent can pay.
contract VendorAllowlist is AccessControl {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    struct Vendor {
        string name;
        bool approved;
        uint256 addedAt;
    }

    mapping(address => Vendor) public vendors;
    address[] public vendorList;

    event VendorAdded(address indexed vendor, string name);
    event VendorRemoved(address indexed vendor);

    error VendorAlreadyApproved(address vendor);
    error VendorNotFound(address vendor);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
    }

    /// @notice Add a new approved vendor
    function addVendor(address vendor, string calldata name) external onlyRole(OPERATOR_ROLE) {
        if (vendors[vendor].approved) revert VendorAlreadyApproved(vendor);
        vendors[vendor] = Vendor({ name: name, approved: true, addedAt: block.timestamp });
        vendorList.push(vendor);
        emit VendorAdded(vendor, name);
    }

    /// @notice Remove a vendor from the allowlist
    function removeVendor(address vendor) external onlyRole(OPERATOR_ROLE) {
        if (!vendors[vendor].approved) revert VendorNotFound(vendor);
        vendors[vendor].approved = false;
        emit VendorRemoved(vendor);
    }

    /// @notice Check if a vendor is approved
    function isApprovedVendor(address vendor) external view returns (bool) {
        return vendors[vendor].approved;
    }

    /// @notice Get all vendors (including removed)
    function getAllVendors() external view returns (address[] memory) {
        return vendorList;
    }
}
