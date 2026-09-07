const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    // Read deployment info
    const deploymentPath = path.resolve(__dirname, "../deployment.json");
    if (!fs.existsSync(deploymentPath)) {
        console.error("❌ deployment.json not found! Run deploy.js first.");
        process.exit(1);
    }
    const deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
    const contractAddress = deploymentInfo.contractAddress;
    console.log(`Connecting to EventTicketSystem at ${contractAddress}...`);

    const EventTicketSystem = await hre.ethers.getContractFactory("EventTicketSystem");
    const contract = EventTicketSystem.attach(contractAddress);

    const now = Math.floor(Date.now() / 1000);
    const day = 86400;

    // Event 1
    console.log("Creating Event 1: Web3 Tech Conference 2026...");
    let tx = await contract.createEvent(
        "Web3 Tech Conference 2026",
        "Join leading developers and creators for 3 days of blockchain, smart contract, and AI workshops.",
        now + day * 2,
        now + day * 5,
        "Silicon Valley Convention Center",
        "San Francisco, CA",
        500,
        "ipfs://QmWeb3ConferenceMetadata",
        500 // 5% royalty
    );
    await tx.wait();
    console.log("✅ Event 1 created!");

    console.log("Adding tiers for Event 1...");
    tx = await contract.addTicketTier(1, "General Pass", hre.ethers.parseEther("0.01"), 300, 5);
    await tx.wait();
    tx = await contract.addTicketTier(1, "VIP Developer Pass", hre.ethers.parseEther("0.05"), 200, 2);
    await tx.wait();
    console.log("✅ Tiers added for Event 1!");

    // Event 2
    console.log("Creating Event 2: Summer Music Fest 2026...");
    tx = await contract.createEvent(
        "Summer Music Fest 2026",
        "An unforgettable outdoor music festival featuring world-renowned EDM and Pop artists.",
        now + day * 7,
        now + day * 9,
        "Central Park Arena",
        "New York, NY",
        1000,
        "ipfs://QmSummerFestMetadata",
        500
    );
    await tx.wait();
    console.log("✅ Event 2 created!");

    console.log("Adding tiers for Event 2...");
    tx = await contract.addTicketTier(2, "Early Bird Pass", hre.ethers.parseEther("0.02"), 500, 4);
    await tx.wait();
    tx = await contract.addTicketTier(2, "Backstage Access", hre.ethers.parseEther("0.1"), 100, 2);
    await tx.wait();
    console.log("✅ Tiers added for Event 2!");

    console.log("🎉 Seeding complete! 2 sample events live on blockchain.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
