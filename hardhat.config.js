require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

module.exports = {
  defaultNetwork: "besu",
  networks: {
    hardhat: {},
    besu: {
      url: process.env.BESU_NODE_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  solidity: "0.8.4",
};
