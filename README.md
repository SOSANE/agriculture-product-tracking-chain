# *AgriChain* : Blockchain for product tracking

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A decentralized solution for tracking agricultural products through their lifecycle using blockchain technology.

Designing blockchain model for agriculture product tracking involves using the inherent characteristics of blockchain - decentralisation, immutability and transparency - to track agricultural products through every stage of their lifecycle. This include everything from production, processing, transportation, and distribution, to retail. Below are the essential details for building such a blockchain system.

<h5 align="center"> Home page </h5>

![AgrichainHomepage](./assets/agrichain-homepage.png)

<h5 align="center"> Authentification page </h5>

![AgrichainAuthentification](./assets/agrichain-authentication.png)

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Guide](#setup-guide)
- [Running the System](#running-the-system)
- [Test Accounts](#test-accounts)
- [License](#license)

## Features
- Role-based authentication (Admin, Farmer, Processor, Distributor, Retailer, Regulator)
- Product traceability with blockchain verification
- PostgreSQL database backend
- React frontend dashboard

## Project Structure
```
agriculture-product-tracking-chain/
├── agrichain-backend/ # Node.js API server (port 5000)
├── agrichain-database/ # PostgreSQL schemas and scripts
├── agrichain-frontend-react/ # React Vite frontend (port 5173)
└── agrichain-smartcontract/ # Future smart contracts
```

## Prerequisites
- Node.js v18+
- npm v9+
- PostgreSQL 15+ (running on port 5432)
- Git

## Setup Guide
### 1. Clone Repository
```bash
git clone https://github.com/SOSANE/agriculture-product-tracking-chain
cd agriculture-product-tracking-chain
```

### 2. Backend Setup
```bash
cd agrichain-backend
npm install
cp .env.example .env
```

**Edit .env**: 
```dotenv
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=agrichain
DB_PASSWORD=your_postgres_password
DB_PORT=5432
SESSION_SECRET=your_session_secret
```

### 3. Database Setup
1. Initialize the database:
```bash
createdb agrichain
psql -U postgres -d agrichain -f agrichain-database/commands/init.sql
```

Hash the passwords (run once):
```bash
cd agrichain-backend
node hash-passwords.js
```

### 4. Frontend Setup
```bash
cd ../agrichain-frontend-react/agrichain-frontend
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:5000" > .env
```

## Running the System
### 1. Start Backend:
```bash
cd agrichain-backend
npm start
```
### 2. Start Frontend:
```bash
cd ../agrichain-frontend-react/agrichain-frontend
npm run dev
```

Access: http://localhost:5173

## Test Accounts
| Role        | Username     | Password      |
|-------------|--------------|---------------|
| Admin       | admin        | admin123      |
| Farmer      | farmer1      | password123   |
| Regulator   | regulator1   | securepass    |
| Processor   | processor1   | process123    |
| Distributor | distributor1 | distribute123 |
| Retailer    | retailer1    | retail123     |

## Licence
MIT © 2025 AgriChain