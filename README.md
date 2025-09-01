<h1 align="center"><i>AgriChain</i> : Product Tracking and Identification in the Supply Chain Using Blockchain Technology 
<br>
<img width="24" height="24" alt="box" src="https://github.com/user-attachments/assets/08323b8d-3291-4c78-949d-d94035830350" />
</h1>

<h5 align="center"> A decentralized solution for tracking agricultural products through their lifecycle using blockchain technology. </h5>

<div align="center">

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
</div>

The product tracking and identification in the supply chain that uses blockchain technology, the ethereum network, smart contracts and QR codes to provide transparency and security and promote decentralisation.

Designing blockchain model for agriculture product tracking involves using the inherent characteristics of blockchain - decentralisation, immutability and transparency - to track agricultural products through every stage of their lifecycle. This include everything from production, processing, transportation, and distribution, to retail.



[Legacy setup guide in old README.md](./README.old.md)

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Guide](#setup-guide)
- [Running the system with Docker](#running-the-system-with-docker)
- [Hardhat Accounts](#add-hardhat-accounts-to-metamask-wallet)
- [Test Accounts](#test-accounts)
- [License](#licence)

## Features
- **QR codes** are used by the system to promote product authenticity. Scan a QR code to verify the history, origin and information of a product by fetching supply chain information in the Ethereum's decentralized database.
- Product traceability with **blockchain verification** using the **Ethereum network** via **Hardhat** and **smart contracts**.
- **PostgreSQL** used for database backend.
- **React** frontend dashboard for the web interface.
- **Docker** for easy build & testing of the application.
- **Nginx** as a reverse proxy.

## Project Structure
```
agriculture-product-tracking-chain/
├── backend/
├── database/
├── frontend/
├── nginx/
└── smartcontract/
```

## Prerequisites
- Docker
- MetaMask
- Git

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




## Running the system with Docker
1. Navigate to root project
2. **Run the following command**
```shell
docker compose up --build
```
**After build & start is completed, access the application on http://localhost:5173.**

## Add Hardhat accounts to MetaMask Wallet

- Hardhat gives 20 accounts with their private keys, each account have a wallet with 10000 ETH (Testnet). **PS. All hardhat accounts and their private keys are PUBLIC INFORMATION. For example, account #0's address is always ``0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266`` & ``0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`` is the private key** → ***[Read more on Harhat (docs)](https://hardhat.org/hardhat-network/docs/overview)***
- For testing purposes (`transactions`), import a few Hardhat accounts including **account #0** to **Metamask wallet** using their private keys by adding a **personal network with the following parameters:**
  - **Local network (default RPC URL)**: ``http://localhost:8545/``
  - **Chain ID**: ``1337``
  - **Currency symbol**: ``ETH``
- ``ADMIN_PRIVATE_KEY`` variable is associated to **account #0 private key**.


Log in using the [test accounts](#test-accounts).

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
