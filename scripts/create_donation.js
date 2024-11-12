async function main() {
    const contractAddress = "0xC8c03647d39a96f02f6Ce8999bc22493C290e734"; 
    const DonationManager = await ethers.getContractFactory("DonationManager");
    const contract = DonationManager.attach(contractAddress);

    // Organization Address that will receive the donation
    const orgAddress = "0xc35d99522804772ad580ab6400753e589bb32952";

    // Donation value (Ether)
    const donationAmount = ethers.parseEther("0.1"); // Donation of 0.1 ETH

    console.log(`Starting the donation of ${ethers.formatEther(donationAmount)} ETH to the Organization ${orgAddress}`);

    // Send the transaction
    const tx = await contract.donate(orgAddress, {
        value: donationAmount.toString(), // Defines the donation value
    });

    await tx.wait();

    contract.on("LogData", (sender, value) => {
        console.log(`Sender: ${sender}, Value: ${ethers.utils.formatEther(value)}`);
    });
    
    console.log(`Donation of ${ethers.formatEther(donationAmount)} ETH successfully made to ${orgAddress}`);
    
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
