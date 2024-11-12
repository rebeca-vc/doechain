async function main() {
    const DonationManager = await ethers.getContractFactory("DonationManager");
    const donationManager = await DonationManager.deploy();
    await donationManager.deployed();
    console.log("DonationManager deployed to:", donationManager.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });