const {ethers} = require("hardhat");

async function main() {
    const Agrichain = await ethers.getContractFactory("Agrichain");
    console.log("Deploying Agrichain Contract...");
    const agrichain = await Agrichain.deploy();
    await agrichain.waitForDeployment();
    console.log("Agrichain deployed to: ", await agrichain.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });