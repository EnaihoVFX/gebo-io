const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying VideoToken contract...");

  // Get the contract factory
  const VideoToken = await ethers.getContractFactory("VideoToken");
  
  // Deploy the contract
  const videoToken = await VideoToken.deploy();
  
  // Wait for deployment to finish
  await videoToken.waitForDeployment();
  
  const address = await videoToken.getAddress();
  
  console.log("VideoToken deployed to:", address);
  console.log("Network:", network.name);
  console.log("Block Explorer:", network.config.blockExplorer);
  
  // Verify the contract on block explorer
  if (network.config.blockExplorer) {
    console.log("Waiting for block confirmations...");
    await videoToken.deployTransaction.wait(6);
    await verify(address, []);
  }
}

async function verify(contractAddress, args) {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 