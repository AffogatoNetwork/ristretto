const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!compilers: {
  compilers: {
    solc: {
      version: "0.5.7" // Fetch exact version from solc-bin (default: truffle's version)
    }
  },
  contracts_build_directory: path.join(__dirname, "client/src/contracts")
};
