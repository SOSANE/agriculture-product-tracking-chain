const hre = require("hardhat");

const main = async () => {
    const accounts = await hre.ethers.getSigners();


    const Contract = await hre.ethers.getContractFactory("Agrichain");
    const agrichainContract = await Contract.deploy();

    console.log("Contract deployed by:", accounts[0].address);
    console.log("-----------------")
    console.log("Contract address:", await agrichainContract.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});