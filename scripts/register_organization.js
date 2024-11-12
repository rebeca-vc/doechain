
const { CONTRACT_ADDR } = process.env;

async function main() {
    const contractAddress = CONTRACT_ADDR;
    const DonationManager = await ethers.getContractFactory("DonationManager");
    const contract = DonationManager.attach(contractAddress);

    const name = "Doe Org.";
    const walletAddress = "0xc35d99522804772ad580ab6400753e589bb32952";

    console.log(`Register Organization with address: ${walletAddress}`);

    const tx = await contract.registerOrganization(name, walletAddress);
    await tx.wait();

    console.log(`Organization registered: ${name}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });