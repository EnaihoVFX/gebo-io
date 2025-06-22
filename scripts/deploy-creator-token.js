const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying CreatorToken contract...");

  // Get the contract factory
  const CreatorToken = await ethers.getContractFactory("CreatorToken");
  
  // Deploy the contract
  const creatorToken = await CreatorToken.deploy();
  
  // Wait for deployment to finish
  await creatorToken.waitForDeployment();
  
  const address = await creatorToken.getAddress();
  
  console.log("CreatorToken deployed to:", address);
  console.log("Contract address for .env file:");
  console.log(`NEXT_PUBLIC_CREATOR_TOKEN_ADDRESS=${address}`);
  
  // Verify the deployment
  console.log("\nVerifying deployment...");
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
    console.log("Contract verified on PolygonScan!");
  } catch (error) {
    console.log("Verification failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 