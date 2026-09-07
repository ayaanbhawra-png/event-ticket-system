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
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});