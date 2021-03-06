require("dotenv").config();
const HDWalletProvider = require("truffle-hdwallet-provider");
const path = require("path");

var mnemonic = process.env.MNENOMIC;
var mnemonic_poa = process.env.MNENOMIC_POA;

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
    poa: {
      provider: function() {
        return new HDWalletProvider(mnemonic_poa, "https://core.poa.network");
      },
      network_id: "99",
      skipDryRun: true
    },
    sokol: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://sokol.poa.network");
      },
      network_id: "77",
      skipDryRun: true
    },
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // match any network
      websockets: true
    },
    rinkeby: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider(mnemonic, process.env.RINKEBY_API_URL),
      network_id: "4"
    },
    xdai: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () => new HDWalletProvider(mnemonic, "https://dai.poa.network"),
      network_id: "100"
    }
  }
};
