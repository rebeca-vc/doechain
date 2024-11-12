const { CONTRACT_ADDR } = process.env;

async function main() {
    const contractAddress = CONTRACT_ADDR; 
    const DonationManager = await ethers.getContractFactory("DonationManager");
    const contract = DonationManager.attach(contractAddress);

    // Organization Address that will receive the donation
    const orgAddress = "0xc35d99522804772ad580ab6400753e589bb32952";

    // Send the transaction
    const tx = await contract.getDonationsByOrganization(orgAddress);

    console.log(tx);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
