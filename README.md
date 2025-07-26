# *AgriChain* : Product Tracking and Identification in the Supply Chain Using Blockchain Technology
<h5 align="center"> A decentralized solution for tracking agricultural products through their lifecycle using blockchain technology. </h5>

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

The product tracking and identification in the supply chain that uses blockchain technology, the ethereum network, smart contracts and QR codes to provide transparency and security and promote decentralisation.

Designing blockchain model for agriculture product tracking involves using the inherent characteristics of blockchain - decentralisation, immutability and transparency - to track agricultural products through every stage of their lifecycle. This include everything from production, processing, transportation, and distribution, to retail.


[Consult old README.md to see legacy setup guide](./README.old.md)

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Guide](#setup-guide)
- [Running the System with Docker](#running-the-system-with-docker)
- [Test Accounts](#test-accounts)
- [License](#licence)

## Features
- **QR codes** are used by the system to promote product authenticity. Scan a QR code to verify the history, origin and information of a product by fetching supply chain information in the Ethereum's decentralized database.
- Product traceability with **blockchain verification** using the **Ethereum network** via **Hardhat** and **smart contracts**.
- **PostgreSQL** used for database backend.
- **React** frontend dashboard for the web interface.

## Project Structure
```
agriculture-product-tracking-chain/
├── agrichain-backend/
├── agrichain-database/
├── agrichain-frontend-react/
└── agrichain-smartcontract/
```

## Prerequisites
- **Docker**
- **Metamask** wallet

## Setup Guide
### 1. Clone Repository
```bash
git clone https://github.com/SOSANE/agriculture-product-tracking-chain
cd agriculture-product-tracking-chain
```

### 2. MetaMask Setup
1. **Create a [MetaMask](https://portfolio.metamask.io/)** wallet if you do not own one.
2. **Download the [Metamask's browser extension](https://metamask.io/download)** and connect your wallet.

<br>

- Hardhat gives 20 accounts with their private keys, each account have a wallet with 10000 ETH (Testnet). **PS. All hardhat accounts and their private keys are PUBLIC INFORMATION. For example, account #0's address is always``0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266``** → ***[Read more on Harhat (docs)](https://hardhat.org/hardhat-network/docs/overview)***
- For testing purposes (transactions), import 1-3 account to Metamask wallet using any of the hardhat private keys by adding a **personal network with the following parameters:**
  - **Local network**: ``http://localhost:8545/``
  - **Chain ID**: ``1337``
  - **Currency symbol**: ``ETH``
- One of the imported accounts' private key can be used for the ``ADMIN_PRIVATE_KEY``
- ``CONTRACT_ADDRESS`` & ``ADMIN_PRIVATE_KEY``'s values can now be replaced in the ``.env`` files.
### 3. Environment variables changes
Edit the `.env.*` files

`agrichain-backend/.env.backend`
```dotenv
PORT=5000
DB_USER=your_postgres_username
DB_HOST=localhost
DB_NAME=agrichain
DB_PASSWORD=your_postgres_password
DB_PORT=5432
CORS_ORIGIN=http://localhost:5173
SESSION_SECRET=your_session_secret
CONTRACT_ADDRESS=your_deployed_address
ADMIN_PRIVATE_KEY=your_private_admin_key
BLOCKCHAIN_PROVIDER_URL=http://localhost:8545
```
`agrichain-frontend/.env.frontend`
```dotenv
VITE_ADMIN_PRIVATE_KEY=your_private_admin_key    # Can be obtained after starting hardhat node
VITE_CONTRACT_ADDRESS=your_deployed_address      # Contract address can be obtained by running scripts/deploy.js
VITE_BLOCKCHAIN_PROVIDER_URL=http://localhost:8545
```
`agrichain-smartcontract/.env.contract`
```dotenv
CONTRACT_ADDRESS=your_deployed_address
BLOCKCHAIN_PROVIDER_URL=http://localhost:8545
ADMIN_PRIVATE_KEY=your_private_admin_key
```

Rename all of the `.env.*` files (`.env.db`, `.env.contract`, etc.) to `.env`
## Running the System with Docker
1. Navigate to root project
2. **Run the following command**
```sh
docker compose up --build
```
**After build, access the application on http://localhost:5173**

Log in using the [test accounts](#test-accounts)

## Test Accounts
Several accounts pre-made for testing purposes:

| Role        | Username     | Password      |
|-------------|--------------|---------------|
| Admin       | admin        | admin123      |
| Farmer      | farmer1      | password123   |
| Farmer      | farmer2      | password123   |
| Farmer      | farmer3      | password123   |
| Farmer      | farmer4      | password123   |
| Regulator   | regulator1   | securepass    |
| Regulator   | regulator2   | securepass    |
| Regulator   | regulator3   | securepass    |
| Processor   | processor1   | process123    |
| Processor   | processor2   | process321    |
| Distributor | distributor1 | distribute123 |
| Distributor | distributor2 | distribute321 |
| Retailer    | retailer1    | retail123     |

## Licence
MIT © 2025 AgriChain