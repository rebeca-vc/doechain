// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;


contract DonationManager {

    // Organization Struct
    struct Organization {
        string name;
        address payable walletAddress;
        uint256 totalReceived;
        bool isRegistered;
    }

    // Donation Struct
    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }
    
    // Contract state
    address public owner;
    mapping(address => Organization) public organizations;
    mapping(address => Donation[]) public donationsByDonor; // Donation history by Donor
    mapping(address => Donation[]) public donationsByOrganization; // Donation history by Organization

    // Events
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event OrganizationRegistered(address indexed orgAddress, string name);
    event DonationReceived(address indexed orgAddress, address indexed donor, uint256 amount);

    // Defines the deployer as the inicial owner
    constructor() {
        owner = msg.sender;
    }

    // Access modifier: Only the owner can execute this function
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can execute this function.");
        _;
    }

    // Function to transfer Ownership
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid New Owner."); // Validates address
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    // Function to register a new Organization
    function registerOrganization(string memory _name, address payable _walletAddress) public onlyOwner {
        require(!organizations[_walletAddress].isRegistered, "Organizacao ja registrada.");
        organizations[_walletAddress] = Organization({
            name: _name,
            walletAddress: _walletAddress,
            totalReceived: 0,
            isRegistered: true
        });
        emit OrganizationRegistered(_walletAddress, _name);
    }

    // Donate to a Specific Organization
    function donate(address _orgAddress) public payable {
        require(organizations[_orgAddress].isRegistered, "Org not found.");
        require(msg.value > 0, "Donation must be greater than zero.");

        // Updates the organization funds
        organizations[_orgAddress].totalReceived += msg.value;

        // Donor and Organization history is registered
        donationsByDonor[msg.sender].push(Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        }));
        donationsByOrganization[_orgAddress].push(Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        }));

        // Transfers the value directly to the Organization
        organizations[_orgAddress].walletAddress.transfer(msg.value);

        emit DonationReceived(_orgAddress, msg.sender, msg.value);
    }

     // See total amount received by an Organization
    function getTotalReceivedByOrganization(address _orgAddress) public view returns (uint256) {
        require(organizations[_orgAddress].isRegistered, "Org. not found.");
        return organizations[_orgAddress].totalReceived;
    }

    // All donations made by a Donor
    function getDonationsByDonor(address _donor) public view returns (Donation[] memory) {
        return donationsByDonor[_donor];
    }

    // All donations made to an Organization
    function getDonationsByOrganization(address _orgAddress) public view returns (Donation[] memory) {
        require(organizations[_orgAddress].isRegistered, "Org. not found.");
        return donationsByOrganization[_orgAddress];
    }
}