#!/bin/bash
set -e


echo -e "\n\n======================= (BEGIN) - CONTRACT DEPENDENCIES ===================\n\n"
npm install
echo -e "\n\n======================= (END) - CONTRACT DEPENDENCIES ===================\n\n"

echo -e "\n\n======================= (BEGIN) - COMPILING CONTRACT ===================\n\n"
npx hardhat compile
echo -e "\n\n======================= (END) - COMPILING CONTRACT ===================\n\n"

echo -e "\n\n----------------------------------------------------------------------\n\n"
echo -e "\n\n----------------------------------------------------------------------\n\n"
echo -e "\n\n----------------------------------------------------------------------\n\n"

echo -e "\n\n========================== Starting node... ==========================\n\n"
npx hardhat node

echo -e "\n\n----------------------------------------------------------------------\n\n"
echo -e "\n\n------------------------ Waiting for node... -------------------------\n\n"
until curl -s http://localhost:8545 >/dev/null; do
    sleep 1
done
echo -e "\n\n----------------------------------------------------------------------\n\n"
echo -e "\n\n----------------------- Deploying contract... ------------------------\n\n"
npx hardhat run scripts/deploy.js --network localhost

wait
