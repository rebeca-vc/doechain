const { CONTRACT_ADDR, BESU_NODE_URL } = process.env;
const ethers = require("ethers");
const inquirer = require("inquirer").default;


// Contract and inicialization
const contractAddress = CONTRACT_ADDR;
const contractABI = [
  "function registerOrganization(address orgAddress, string memory name) public",
  "function donate(address orgAddress) public payable",
  "function getDonationsByOrganization(address orgAddress) public view returns (tuple(address donor, uint256 amount, uint256 timestamp)[])",
  "function getDonationsByDonor(address orgAddress) public view returns (tuple(address donor, uint256 amount, uint256 timestamp)[])",
  "function getTotalReceivedByOrganization(address _orgAddress) public view returns (uint256)",
  "function addMilestone(address _orgAddress, uint256 _targetAmount)",
  "function getMilestonesByOrganization(address _orgAddress) public view returns (tuple(address donor, uint256 amount, uint256 timestamp)[] memory)"
];


// Connect to the contract
async function getContract() {
    const provider = new ethers.providers.JsonRpcProvider(BESU_NODE_URL); 
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
}

// Register Org.
async function registerOrganization() {
    const answers = await inquirer.prompt([
        { name: "orgAddress", message: "Organization address:", type: "input" },
        { name: "name", message: "Organization name:", type: "input" }
    ]);
    const { orgAddress, name } = answers;

    const contract = await getContract();
    const tx = await contract.registerOrganization(orgAddress, name);
    await tx.wait();
    console.log(`Organization ${name} successfully registered.`);
}

// Donation Function
async function donate() {
    const answers = await inquirer.prompt([
        { name: "orgAddress", message: "Organization Address:", type: "input" },
        { name: "amount", message: "Donation Value (ETH):", type: "input" }
    ]);
    const { orgAddress, amount } = answers;

    const contract = await getContract();
    const tx = await contract.donate(orgAddress, { value: ethers.utils.parseEther(amount) });
    await tx.wait();
    console.log(`Donation of ${amount} ETH sucessfully made to ${orgAddress}.`);
}

// Show All Donations by Org.
async function listDonations() {
    const answers = await inquirer.prompt([
        { name: "orgAddress", message: "Organization address:", type: "input" }
    ]);
    const { orgAddress } = answers;

    const contract = await getContract();
    const donations = await contract.getDonationsByOrganization(orgAddress);
    donations.forEach((donation, index) => {
        console.log(`Donation ${index + 1}:`);
        console.log(`- Donor: ${donation.donor}`);
        console.log(`- Amount: ${ethers.utils.formatEther(donation.amount)} ETH`);
        console.log(`- Timestamp: ${new Date(donation.timestamp * 1000).toLocaleString()}`);
    });
}

// Main Menu
async function mainMenu() {
    const answer = await inquirer.prompt({
        type: "list",
        name: "option",
        message: "Choose an option:",
        choices: [
            { name: "Register Organization", value: "register" },
            { name: "Donate", value: "donate" },
            { name: "List Donations", value: "list" },
            { name: "Exit", value: "exit" }
        ]
    });

    // Options
    switch (answer.option) {
        case "register":
            await registerOrganization();
            break;
        case "donate":
            await donate();
            break;
        case "list":
            await listDonations();
            break;
        case "exit":
            console.log("Leaving DoechainApp...");
            process.exit();
        default:
            console.log("Invalid option");
    }

    await mainMenu();
}

// Main menu execution
mainMenu().catch(error => {
    console.error("Erro:", error);
});