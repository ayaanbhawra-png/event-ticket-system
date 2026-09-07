# Event Ticket System (Web3 & Blockchain)

A decentralized event ticketing and verification system built with Next.js, Express, and Ethereum Smart Contracts (Solidity + Hardhat).

---

## 🚀 Running Services

| Service | Technology | Port / URL | Status |
|---|---|---|---|
| **Frontend** | Next.js 14 + Wagmi + RainbowKit | [http://localhost:3000](http://localhost:3000) | Running |
| **Backend API** | Node.js + Express + Ethers.js | [http://localhost:5000](http://localhost:5000) | Running |
| **Blockchain RPC** | Hardhat Local Node | [http://127.0.0.1:8545](http://127.0.0.1:8545) | Running |

---

## 📜 Deployed Smart Contract

- **Contract Name**: `EventTicketSystem`
- **Contract Address**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`
- **Network**: Localhost (Chain ID: `1337`)

---

## 🛠 Project Structure

```
event-ticket-system/
├── blockchain/         # Hardhat smart contracts, tests, and deployment scripts
│   ├── contracts/      # EventTicketSystem.sol
│   ├── scripts/        # deploy.js & interact.js
│   └── test/           # Mocha & Chai test suites
├── backend/            # Express API service
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   └── .env
└── frontend/           # Next.js App Router Web Application
    ├── src/
    │   ├── app/        # Pages (admin, user, verify, events)
    │   ├── components/ # Reusable UI components
    │   ├── context/    # Auth & State context
    │   └── lib/        # Wagmi & Contract integration
    └── .env.local
```

---

## 💻 Manual Commands (For Future Reference)

### 1. Blockchain
```bash
cd blockchain
npx hardhat node                                    # Start local node (Port 8545)
npx hardhat run scripts/deploy.js --network localhost  # Deploy contract
npm test                                            # Run test suite
```

### 2. Backend
```bash
cd backend
npm run dev                                         # Start Express API server (Port 5000)
```

### 3. Frontend
```bash
cd frontend
npm run dev                                         # Start Next.js frontend (Port 3000)
```
