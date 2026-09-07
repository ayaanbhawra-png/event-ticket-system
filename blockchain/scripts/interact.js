const hre = require("hardhat");

async function main() {
    const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
    const EventTicketSystem = await hre.ethers.getContractFactory("EventTicketSystem");
    const contract = EventTicketSystem.attach(contractAddress);

    // Example: Create an event
    console.log("Creating event...");
    const startDate = Math.floor(Date.now() / 1000) + 86400; // Tomorrow
    const endDate = startDate + 86400 * 3; // 3 days later

    const tx = await contract.createEvent(
        "Summer Music Fest 2026",
        "The biggest music festival of the year!",
        startDate,
        endDate,
        "Madison Square Garden",
        "New York, NY",
        1000,
        "ipfs://QmExampleMetadata",
        500 // 5% royalty
    );

    await tx.wait();
    console.log("✅ Event created!");
}

main().catch(console.error);