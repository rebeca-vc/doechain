async function main() {
    const DonationManager = await ethers.deployContract("DonationManager");
    await DonationManager.waitForDeployment();
    console.log("DonationManager deployed to:", DonationManager.target);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
