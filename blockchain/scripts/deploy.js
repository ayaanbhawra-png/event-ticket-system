const hre = require("hardhat");

async function main() {
    console.log("Deploying EventTicketSystem...");
    console.log("Network:", hre.network.name);

    const EventTicketSystem = await hre.ethers.getContractFactory("EventTicketSystem");
    const eventTicketSystem = await EventTicketSystem.deploy({
        gasLimit: 5000000  // ← Added for Ganache compatibility
    });

    await eventTicketSystem.waitForDeployment();

    const address = await eventTicketSystem.getAddress();
    console.log(`✅ EventTicketSystem deployed to: ${address}`);

    // Save deployment info
    const fs = require("fs");
    const path = require("path");
    const deploymentInfo = {
        contractAddress: address,
        network: hre.network.name,
        timestamp: new Date().toISOString()
    };

    fs.writeFileSync(
        "deployment.json",
        JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("📁 Deployment info saved to deployment.json");

    // Update backend/.env
    const backendEnvPath = path.resolve(__dirname, "../../backend/.env");
    if (fs.existsSync(backendEnvPath)) {
        let backendEnv = fs.readFileSync(backendEnvPath, "utf8");
        backendEnv = backendEnv.replace(/CONTRACT_ADDRESS=.*/, `CONTRACT_ADDRESS=${address}`);
        fs.writeFileSync(backendEnvPath, backendEnv);
        console.log("📝 Updated backend/.env with contract address");
    }

    // Update frontend/.env.local
    const frontendEnvPath = path.resolve(__dirname, "../../frontend/.env.local");
    if (fs.existsSync(frontendEnvPath)) {
        let frontendEnv = fs.readFileSync(frontendEnvPath, "utf8");
        frontendEnv = frontendEnv.replace(/NEXT_PUBLIC_CONTRACT_ADDRESS=.*/, `NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
        fs.writeFileSync(frontendEnvPath, frontendEnv);
        console.log("📝 Updated frontend/.env.local with contract address");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});