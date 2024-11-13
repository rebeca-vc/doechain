require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const { PRIVATE_KEY, BESU_NODE_URL } = process.env

module.exports = {
  defaultNetwork: "besu",
  networks: {
    hardhat: {},
    besu: {
      url: BESU_NODE_URL,
      accounts: [PRIVATE_KEY]
    }
  },
  solidity: "0.8.4",
};
