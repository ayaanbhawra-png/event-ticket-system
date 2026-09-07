require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.25",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            },
            evmVersion: "cancun",
            viaIR: true
        }
    },
    networks: {
        hardhat: {
            chainId: 1337,
            blockGasLimit: 30000000,
            gas: 30000000,
            gasPrice: 20000000000
        },
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 1337,
            blockGasLimit: 30000000,
            gas: 30000000,
            gasPrice: 20000000000
        },
        ganache: {
            url: "http://127.0.0.1:7545",  // ← Ganache RPC URL
            chainId: 1337,                 // ← Ganache chain ID
            gasPrice: 20000000000,
            gas: 30000000,
            accounts: {
                mnemonic: "test test test test test test test test test test test junk"  // ← Ganache default mnemonic
            }
        },
        sepolia: {
            url: process.env.SEPOLIA_RPC_URL || "",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 11155111
        },
        polygonAmoy: {
            url: process.env.POLYGON_AMOY_RPC_URL || "",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 80002
        }
    },
    etherscan: {
        apiKey: {
            sepolia: process.env.ETHERSCAN_API_KEY || "",
            polygonAmoy: process.env.POLYGONSCAN_API_KEY || ""
        }
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    },
    mocha: {
        timeout: 40000
    }
};