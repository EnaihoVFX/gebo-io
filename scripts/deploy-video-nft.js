const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying VideoNFT contract to Amoy testnet...");

  // For testing purposes only - this is a test account
  // In production, use your own private key from your wallet
  const testPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  
  // Create a wallet instance
  const wallet = new ethers.Wallet(testPrivateKey, ethers.provider);
  
  // Get the contract factory
  const VideoNFT = await ethers.getContractFactory("VideoNFT");
  
  // Deploy the contract using the test wallet
  const videoNFT = await VideoNFT.connect(wallet).deploy();
  
  // Wait for deployment to finish
  await videoNFT.waitForDeployment();
  
  const address = await videoNFT.getAddress();
  
  console.log("VideoNFT deployed to:", address);
  console.log("Contract address for .env file:");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
  console.log("\n⚠️  WARNING: This uses a test private key. For production, use your own wallet!");
  console.log("🌐 Network: Polygon Amoy Testnet (Chain ID: 80002)");
  
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