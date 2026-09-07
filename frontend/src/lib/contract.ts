// Contract Address - Update this after deployment to Ganache
export const contractAddress = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    '0x5FbDB2315678afecb367f032d93F642f64180aa3') as `0x${string}`

// Contract ABI
export const contractABI = [
    // Events
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "uint256", "name": "eventId", "type": "uint256" },
            { "indexed": true, "internalType": "address", "name": "organizer", "type": "address" },
            { "indexed": false, "internalType": "string", "name": "name", "type": "string" }
        ],
        "name": "EventCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "uint256", "name": "ticketId", "type": "uint256" },
            { "indexed": true, "internalType": "uint256", "name": "eventId", "type": "uint256" },
            { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }
        ],
        "name": "TicketMinted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "uint256", "name": "ticketId", "type": "uint256" },
            { "indexed": true, "internalType": "uint256", "name": "eventId", "type": "uint256" },
            { "indexed": false, "internalType": "address", "name": "verifier", "type": "address" }
        ],
        "name": "TicketVerified",
        "type": "event"
    },

    // Write Functions
    {
        "inputs": [
            { "internalType": "string", "name": "_name", "type": "string" },
            { "internalType": "string", "name": "_description", "type": "string" },
            { "internalType": "uint256", "name": "_startDate", "type": "uint256" },
            { "internalType": "uint256", "name": "_endDate", "type": "uint256" },
            { "internalType": "string", "name": "_venue", "type": "string" },
            { "internalType": "string", "name": "_location", "type": "string" },
            { "internalType": "uint256", "name": "_totalTickets", "type": "uint256" },
            { "internalType": "string", "name": "_metadataURI", "type": "string" },
            { "internalType": "uint256", "name": "_royaltyPercentage", "type": "uint256" }
        ],
        "name": "createEvent",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "_eventId", "type": "uint256" },
            { "internalType": "string", "name": "_name", "type": "string" },
            { "internalType": "uint256", "name": "_price", "type": "uint256" },
            { "internalType": "uint256", "name": "_maxSupply", "type": "uint256" },
            { "internalType": "uint256", "name": "_maxPerUser", "type": "uint256" }
        ],
        "name": "addTicketTier",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "_eventId", "type": "uint256" },
            { "internalType": "uint256", "name": "_tierIndex", "type": "uint256" }
        ],
        "name": "purchaseTicket",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "_ticketId", "type": "uint256" },
            { "internalType": "address", "name": "_verifier", "type": "address" }
        ],
        "name": "verifyTicket",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_eventId", "type": "uint256" }],
        "name": "cancelEvent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_ticketId", "type": "uint256" }],
        "name": "requestRefund",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },

    // Read Functions
    {
        "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
        "name": "getUserTickets",
        "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_eventId", "type": "uint256" }],
        "name": "getEventDetails",
        "outputs": [
            {
                "components": [
                    { "internalType": "uint256", "name": "id", "type": "uint256" },
                    { "internalType": "string", "name": "name", "type": "string" },
                    { "internalType": "string", "name": "description", "type": "string" },
                    { "internalType": "uint256", "name": "startDate", "type": "uint256" },
                    { "internalType": "uint256", "name": "endDate", "type": "uint256" },
                    { "internalType": "address", "name": "organizer", "type": "address" },
                    { "internalType": "string", "name": "venue", "type": "string" },
                    { "internalType": "string", "name": "location", "type": "string" },
                    { "internalType": "uint256", "name": "totalTickets", "type": "uint256" },
                    { "internalType": "uint256", "name": "ticketsSold", "type": "uint256" },
                    { "internalType": "bool", "name": "isActive", "type": "bool" },
                    { "internalType": "bool", "name": "isCancelled", "type": "bool" },
                    { "internalType": "string", "name": "metadataURI", "type": "string" },
                    { "internalType": "uint256", "name": "royaltyPercentage", "type": "uint256" },
                    { "internalType": "uint256", "name": "createdAt", "type": "uint256" }
                ],
                "internalType": "struct EventTicketSystem.Event",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_eventId", "type": "uint256" }],
        "name": "getEventTiers",
        "outputs": [
            {
                "components": [
                    { "internalType": "string", "name": "name", "type": "string" },
                    { "internalType": "uint256", "name": "price", "type": "uint256" },
                    { "internalType": "uint256", "name": "maxSupply", "type": "uint256" },
                    { "internalType": "uint256", "name": "sold", "type": "uint256" },
                    { "internalType": "uint256", "name": "maxPerUser", "type": "uint256" },
                    { "internalType": "bool", "name": "isActive", "type": "bool" }
                ],
                "internalType": "struct EventTicketSystem.TicketTier[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_ticketId", "type": "uint256" }],
        "name": "checkTicketValidity",
        "outputs": [
            { "internalType": "bool", "name": "isValid", "type": "bool" },
            { "internalType": "bool", "name": "isUsed", "type": "bool" },
            { "internalType": "address", "name": "owner", "type": "address" },
            { "internalType": "uint256", "name": "eventId", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "_ticketId", "type": "uint256" }],
        "name": "getTicketDetails",
        "outputs": [
            {
                "components": [
                    { "internalType": "uint256", "name": "id", "type": "uint256" },
                    { "internalType": "uint256", "name": "eventId", "type": "uint256" },
                    { "internalType": "address", "name": "owner", "type": "address" },
                    { "internalType": "uint256", "name": "tierIndex", "type": "uint256" },
                    { "internalType": "uint256", "name": "price", "type": "uint256" },
                    { "internalType": "bool", "name": "isUsed", "type": "bool" },
                    { "internalType": "bool", "name": "isValid", "type": "bool" },
                    { "internalType": "uint256", "name": "transferCount", "type": "uint256" },
                    { "internalType": "uint256", "name": "mintedAt", "type": "uint256" },
                    { "internalType": "string", "name": "qrHash", "type": "string" },
                    { "internalType": "bytes32", "name": "verificationHash", "type": "bytes32" }
                ],
                "internalType": "struct EventTicketSystem.Ticket",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] as const