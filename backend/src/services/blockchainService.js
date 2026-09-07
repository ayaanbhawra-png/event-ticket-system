const { ethers } = require('ethers');
const contractABI = require('./EventTicketSystem.json');

class BlockchainService {
    constructor() {
        // Use Hardhat RPC URL (port 8545)
        this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://127.0.0.1:8545');
        this.adminWallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, this.provider);
        this.contractAddress = process.env.CONTRACT_ADDRESS;
        
        console.log('✅ RPC URL:', process.env.RPC_URL || 'http://127.0.0.1:8545');
        console.log('✅ Contract Address:', this.contractAddress);
        
        this.contract = new ethers.Contract(
            this.contractAddress,
            contractABI,
            this.adminWallet
        );
    }

    async createEvent(eventData) {
        try {
            console.log('📝 Creating event with data:', eventData);
            
            const tx = await this.contract.createEvent(
                eventData.name,
                eventData.description,
                eventData.startDate,
                eventData.endDate,
                eventData.venue,
                eventData.location,
                eventData.totalTickets,
                eventData.metadataURI || '',
                eventData.royaltyPercentage || 500,
                { gasLimit: 5000000 }
            );
            
            console.log('⏳ Waiting for transaction confirmation...');
            const receipt = await tx.wait();
            console.log('✅ Transaction confirmed:', receipt.hash);
            
            // Find EventCreated event
            let eventId = null;
            try {
                const eventTopic = this.contract.interface.getEvent('EventCreated').topicHash;
                const eventLog = receipt.logs.find(log => {
                    try {
                        return log.topics && log.topics[0] === eventTopic;
                    } catch (e) {
                        return false;
                    }
                });
                
                if (eventLog) {
                    const parsedLog = this.contract.interface.parseLog(eventLog);
                    if (parsedLog && parsedLog.args) {
                        eventId = parsedLog.args.eventId ? parsedLog.args.eventId.toString() : null;
                    }
                }
            } catch (parseError) {
                console.warn('⚠️ Could not parse event logs:', parseError.message);
            }
            
            console.log('📊 Event ID:', eventId);
            
            return {
                success: true,
                eventId: eventId || 'pending_' + receipt.hash.slice(0, 8),
                txHash: receipt.hash,
                receipt: receipt
            };
        } catch (error) {
            console.error('❌ Error creating event:', error);
            throw new Error(error.message);
        }
    }

    async addTicketTier(eventId, tierData) {
        try {
            console.log('📝 Adding ticket tier for event:', eventId);
            
            const tx = await this.contract.addTicketTier(
                parseInt(eventId),
                tierData.name,
                ethers.parseEther(tierData.price.toString()),
                parseInt(tierData.maxSupply),
                parseInt(tierData.maxPerUser),
                { gasLimit: 5000000 }
            );
            
            console.log('⏳ Waiting for transaction confirmation...');
            const receipt = await tx.wait();
            console.log('✅ Ticket tier added:', receipt.hash);
            
            return {
                success: true,
                txHash: receipt.hash
            };
        } catch (error) {
            console.error('❌ Error adding ticket tier:', error);
            throw new Error(error.message);
        }
    }

    async purchaseTicket(userWallet, eventId, tierIndex, value) {
        try {
            console.log('🎟️ Purchasing ticket for event:', eventId, 'tier:', tierIndex);
            
            const userContract = this.contract.connect(userWallet);
            const tx = await userContract.purchaseTicket(
                parseInt(eventId),
                parseInt(tierIndex),
                {
                    value: ethers.parseEther(value.toString()),
                    gasLimit: 5000000
                }
            );
            
            console.log('⏳ Waiting for transaction confirmation...');
            const receipt = await tx.wait();
            console.log('✅ Ticket purchased:', receipt.hash);
            
            let ticketId = null;
            try {
                const eventTopic = this.contract.interface.getEvent('TicketMinted').topicHash;
                const eventLog = receipt.logs.find(log => {
                    try {
                        return log.topics && log.topics[0] === eventTopic;
                    } catch (e) {
                        return false;
                    }
                });
                
                if (eventLog) {
                    const parsedLog = this.contract.interface.parseLog(eventLog);
                    if (parsedLog && parsedLog.args) {
                        ticketId = parsedLog.args.ticketId ? parsedLog.args.ticketId.toString() : null;
                    }
                }
            } catch (parseError) {
                console.warn('⚠️ Could not parse TicketMinted event:', parseError.message);
            }

            return {
                success: true,
                ticketId: ticketId || 'pending_' + receipt.hash.slice(0, 8),
                txHash: receipt.hash
            };
        } catch (error) {
            console.error('❌ Error purchasing ticket:', error);
            throw new Error(error.message);
        }
    }

    async getUserTickets(address) {
        try {
            console.log('👤 Getting tickets for address:', address);
            
            const ticketIds = await this.contract.getUserTickets(address);
            const tickets = [];

            for (const id of ticketIds) {
                try {
                    const details = await this.contract.getTicketDetails(id);
                    const event = await this.contract.getEventDetails(details.eventId);
                    const tier = await this.contract.eventTiers(details.eventId, details.tierIndex);

                    tickets.push({
                        ticketId: id.toString(),
                        eventName: event.name,
                        eventDate: event.startDate,
                        venue: event.venue,
                        tierName: tier.name,
                        price: ethers.formatEther(details.price),
                        isUsed: details.isUsed,
                        isValid: details.isValid,
                        eventId: details.eventId.toString()
                    });
                } catch (err) {
                    console.warn('⚠️ Error fetching ticket details:', err.message);
                }
            }

            return tickets;
        } catch (error) {
            console.error('❌ Error getting user tickets:', error);
            throw new Error(error.message);
        }
    }

    async verifyTicket(ticketId, verifierAddress) {
        try {
            console.log('🔍 Verifying ticket:', ticketId, 'by:', verifierAddress);
            
            const tx = await this.contract.verifyTicket(
                parseInt(ticketId),
                verifierAddress,
                { gasLimit: 5000000 }
            );
            
            console.log('⏳ Waiting for verification confirmation...');
            const receipt = await tx.wait();
            console.log('✅ Ticket verified:', receipt.hash);
            
            return {
                success: true,
                txHash: receipt.hash
            };
        } catch (error) {
            console.error('❌ Error verifying ticket:', error);
            throw new Error(error.message);
        }
    }

    async checkTicketValidity(ticketId) {
        try {
            console.log('🔍 Checking ticket validity:', ticketId);
            
            const result = await this.contract.checkTicketValidity(parseInt(ticketId));
            return {
                isValid: result[0],
                isUsed: result[1],
                owner: result[2],
                eventId: result[3].toString()
            };
        } catch (error) {
            console.error('❌ Error checking ticket validity:', error);
            throw new Error(error.message);
        }
    }

    async getEventDetails(eventId) {
        try {
            console.log('📊 Getting event details for:', eventId);
            
            const event = await this.contract.getEventDetails(parseInt(eventId));
            const tiers = await this.contract.getEventTiers(parseInt(eventId));

            return {
                id: eventId.toString(),
                name: event.name,
                description: event.description,
                startDate: event.startDate.toString(),
                endDate: event.endDate.toString(),
                venue: event.venue,
                location: event.location,
                totalTickets: event.totalTickets.toString(),
                ticketsSold: event.ticketsSold.toString(),
                isActive: event.isActive,
                isCancelled: event.isCancelled,
                tiers: tiers.map(t => ({
                    name: t.name,
                    price: ethers.formatEther(t.price),
                    maxSupply: t.maxSupply.toString(),
                    sold: t.sold.toString(),
                    maxPerUser: t.maxPerUser.toString(),
                    isActive: t.isActive
                }))
            };
        } catch (error) {
            console.error('❌ Error getting event details:', error);
            throw new Error(error.message);
        }
    }

    async getAllEvents() {
        try {
            console.log('📊 Fetching all events from blockchain...');
            
            const filter = this.contract.filters.EventCreated();
            const events = await this.contract.queryFilter(filter, 0, 'latest');
            
            console.log(`📊 Found ${events.length} events`);
            
            const eventList = [];
            
            for (const event of events) {
                try {
                    const eventId = event.args.eventId.toString();
                    const eventDetails = await this.getEventDetails(eventId);
                    
                    eventList.push({
                        id: eventId,
                        name: eventDetails.name,
                        description: eventDetails.description,
                        venue: eventDetails.venue,
                        location: eventDetails.location,
                        startDate: eventDetails.startDate,
                        endDate: eventDetails.endDate,
                        totalTickets: eventDetails.totalTickets,
                        ticketsSold: eventDetails.ticketsSold,
                        isActive: eventDetails.isActive,
                        isCancelled: eventDetails.isCancelled,
                        organizer: event.args.organizer,
                        createdAt: event.blockNumber
                    });
                } catch (err) {
                    console.warn(`⚠️ Error fetching event:`, err.message);
                }
            }
            
            return eventList;
        } catch (error) {
            console.error('❌ Error getting all events:', error);
            return [];
        }
    }

    async getContractBalance() {
        try {
            const balance = await this.provider.getBalance(this.contractAddress);
            return ethers.formatEther(balance);
        } catch (error) {
            console.error('❌ Error getting contract balance:', error);
            throw new Error(error.message);
        }
    }
}

module.exports = new BlockchainService();