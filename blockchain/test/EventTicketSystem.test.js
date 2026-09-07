const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EventTicketSystem", function () {
    let contract;
    let owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        const EventTicketSystem = await ethers.getContractFactory("EventTicketSystem");
        contract = await EventTicketSystem.deploy();
        await contract.waitForDeployment();
    });

    it("Should create an event", async function () {
        const startDate = Math.floor(Date.now() / 1000) + 86400;
        const endDate = startDate + 86400 * 3;

        await contract.createEvent(
            "Test Event",
            "Test Description",
            startDate,
            endDate,
            "Test Venue",
            "Test Location",
            100,
            "ipfs://test",
            500
        );

        const event = await contract.getEventDetails(1);
        expect(event.name).to.equal("Test Event");
        expect(event.totalTickets).to.equal(100);
    });

    it("Should add ticket tier", async function () {
        const startDate = Math.floor(Date.now() / 1000) + 86400;
        const endDate = startDate + 86400 * 3;

        await contract.createEvent(
            "Test Event",
            "Test Description",
            startDate,
            endDate,
            "Test Venue",
            "Test Location",
            100,
            "ipfs://test",
            500
        );

        await contract.addTicketTier(1, "VIP", ethers.parseEther("0.1"), 10, 2);
        const tiers = await contract.getEventTiers(1);
        expect(tiers[0].name).to.equal("VIP");
        expect(tiers[0].price).to.equal(ethers.parseEther("0.1"));
    });

    it("Should purchase a ticket", async function () {
        const startDate = Math.floor(Date.now() / 1000) + 86400;
        const endDate = startDate + 86400 * 3;

        await contract.createEvent(
            "Test Event",
            "Test Description",
            startDate,
            endDate,
            "Test Venue",
            "Test Location",
            100,
            "ipfs://test",
            500
        );

        await contract.addTicketTier(1, "General", ethers.parseEther("0.05"), 50, 5);

        const tx = await contract.connect(addr1).purchaseTicket(1, 0, {
            value: ethers.parseEther("0.05")
        });

        await tx.wait();

        const userTickets = await contract.getUserTickets(addr1.address);
        expect(userTickets.length).to.equal(1);
    });
});