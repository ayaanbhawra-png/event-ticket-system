const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const deploymentPath = path.resolve(__dirname, "../deployment.json");
    const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
    const contractAddress = deploymentInfo.contractAddress;

    const EventTicketSystem = await hre.ethers.getContractFactory("EventTicketSystem");
    const contract = EventTicketSystem.attach(contractAddress);

    const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    const userTickets = await contract.getUserTickets(address);
    console.log(`User ${address} ticket IDs:`, userTickets.map(t => t.toString()));

    const ticketCounter = await contract.getTicketDetails(1).catch(() => null);
    console.log("Ticket #1 details on-chain:", ticketCounter);
}

main().catch(console.error);
