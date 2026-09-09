const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const deploymentPath = path.resolve(__dirname, "../deployment.json");
    const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
    const contractAddress = deploymentInfo.contractAddress;

    const EventTicketSystem = await hre.ethers.getContractFactory("EventTicketSystem");
    const contract = EventTicketSystem.attach(contractAddress);

    const [signer] = await hre.ethers.getSigners();
    console.log(`Purchasing ticket for account ${signer.address}...`);

    const tx = await contract.purchaseTicket(1, 0, {
        value: hre.ethers.parseEther("0.01")
    });
    await tx.wait();
    console.log("✅ Ticket #1 purchased successfully on-chain!");

    const userTickets = await contract.getUserTickets(signer.address);
    console.log(`🎉 Account ${signer.address} now owns ticket IDs:`, userTickets.map(t => t.toString()));
}

main().catch(console.error);
