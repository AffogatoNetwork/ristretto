require("dotenv").config();
const HDWalletProvider = require("truffle-hdwallet-provider");
const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!compilers: {
  compilers: {
    solc: {
      version: "0.5.7" // Fetch exact version from solc-bin (default: truffle's version)
    }
  },
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    xdai: {
      provider: function() {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          "https://dai.poa.network"
        );
      },
      network_id: 100
    },
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // match any network
      websockets: true
    }
  }
};
