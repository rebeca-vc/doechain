const { CONTRACT_ADDR, BESU_NODE_URL } = process.env;
const hardhat = require("hardhat");
const { ethers } = hardhat;
const inquirer = require("inquirer").default;

const contractAddress = CONTRACT_ADDR;

// Connect to the contract
async function getContract() {
    const DonationManager = await ethers.getContractFactory("DonationManager");
    return DonationManager.attach(contractAddress);;
}

// Register Org.
async function registerOrganization() {
    try{
        const answers = await inquirer.prompt([
            { name: "orgAddress", message: "Organization address:", type: "input" },
            { name: "name", message: "Organization name:", type: "input" }
        ]);
        const { orgAddress, name } = answers;

        const contract = await getContract();
        const tx = await contract.registerOrganization(name, orgAddress);
        await tx.wait();
        console.log(`Organization ${name} successfully registered.`);

    }catch(e){
        console.log(`Error: ${e}`);
    }
}

// Register Milestone.
async function registerMilestone() {
    try{
        const answers = await inquirer.prompt([
            { name: "orgAddress", message: "Organization address:", type: "input" },
            { name: "targetAmount", message: "Target Amount:", type: "input" }
        ]);
        const { orgAddress, targetAmount } = answers;

        const contract = await getContract();
        const tx = await contract.addMilestone(orgAddress, ethers.parseEther(targetAmount) );
        await tx.wait();
        console.log(`Milestone for ${orgAddress} successfully registered with target amount of ${targetAmount} ETH.`);

    }catch(e){
        console.log(`Error: ${e}`);
    }
}

// Donation Function
async function donate() {
    try{
        const answers = await inquirer.prompt([
            { name: "orgAddress", message: "Organization Address:", type: "input" },
            { name: "amount", message: "Donation Value (ETH):", type: "input" }
        ]);
        const { orgAddress, amount } = answers;

        const contract = await getContract();
        const tx = await contract.donate(orgAddress, { value: ethers.parseEther(amount) });
        await tx.wait();
        console.log(`Donation of ${amount} ETH sucessfully made to ${orgAddress}.`);

    }catch(e){
        console.log(`Error: ${e}`);
    }
}

// Show balance of and Address
async function getAccountBalance() {
    const provider = new ethers.JsonRpcProvider(BESU_NODE_URL); 

    const answers = await inquirer.prompt([
        { name: "accountAddress", message: "Account address:", type: "input" }
    ]);
    const { accountAddress } = answers;

    const balance = await provider.getBalance(accountAddress);
    console.log(`Balance of ${accountAddress}: ${ethers.formatEther(balance)} ETH`);
}

// Show All Donations by Org.
async function listDonationsByOrganization() {
    try{
        const answers = await inquirer.prompt([
            { name: "orgAddress", message: "Organization address:", type: "input" }
        ]);
        const { orgAddress } = answers;

        const contract = await getContract();
        const donations = await contract.getDonationsByOrganization(orgAddress);
        donations.forEach((donation, index) => {
            console.log(`Donation ${index + 1}:`);
            console.log(`- Donor: ${donation.donor}`);
            console.log(`- Amount: ${ethers.formatEther(donation.amount)} ETH`);
            console.log(`- Timestamp: ${new Date(Number(donation.timestamp) * 1000).toLocaleString()}`);
        });
    }catch(e){
        console.log(`Error: ${e}`);
    }
}

// Show All Donations by Donor
async function listDonationsByDonor() {
    try{
        const answers = await inquirer.prompt([
            { name: "donorAddress", message: "Donor address:", type: "input" }
        ]);
        const { donorAddress } = answers;

        const contract = await getContract();
        const donations = await contract.getDonationsByDonor(donorAddress);
        console.log("\n");
        donations.forEach((donation, index) => {
            console.log(`Donation ${index + 1}:`);
            console.log(`- Organization: ${donation.organization}`);
            console.log(`- Amount: ${ethers.formatEther(donation.amount)} ETH`);
            console.log(`- Timestamp: ${new Date(Number(donation.timestamp) * 1000).toLocaleString()}`);
            console.log("\n");
        });
        console.log("\n");
    }catch(e){
        console.log(`Error: ${e}`);
    }
}

// Show All Milestones by Organization
async function listMilestoneByOrganization() {
    try{
        const answers = await inquirer.prompt([
            { name: "orgAddress", message: "Organization address:", type: "input" }
        ]);
        const { orgAddress } = answers;

        const contract = await getContract();
        const donations = await contract.getMilestonesByOrganization(orgAddress);
        donations.forEach((donation, index) => {
            console.log(`Donation ${index + 1}:`);
            console.log(`- Target Amout: ${ethers.formatEther(donation.targetAmount)}`);
            console.log(`- Achieved: ${donation.isAchieved}`);
        });
    }catch(e){
        console.log(`Error: ${e}`);
    }
}

// Main Menu
async function mainMenu() {

    const answer = await inquirer.prompt({
        type: "list",
        name: "option",
        message: "Choose an option:",
        choices: [
            { name: "Register Organization", value: "register" },
            { name: "Add Milestone by Organization", value: "milestone" },
            { name: "Donate", value: "donate" },
            { name: "List Donations by Organization", value: "listorg" },
            { name: "List Donations by Donor", value: "listdonor" },
            { name: "List Milestone Organization", value: "listmilestone" },
            { name: "Get Account Balance", value: "balance" },
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
        case "milestone":
            await registerMilestone();
            break;
        case "listorg":
            await listDonationsByOrganization();
            break;
        case "listdonor":
            await listDonationsByDonor();
            break;
        case "listmilestone":
            await listMilestoneByOrganization();
            break;
        case "balance":
            await getAccountBalance();
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