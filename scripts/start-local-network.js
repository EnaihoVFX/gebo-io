const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting local Hardhat network...");
  
  // Get the signers
  const [deployer] = await ethers.getSigners();
  
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy VideoNFT contract
  const VideoNFT = await ethers.getContractFactory("VideoNFT");
  const videoNFT = await VideoNFT.deploy();
  await videoNFT.waitForDeployment();
  
  const videoNFTAddress = await videoNFT.getAddress();
  console.log("🎬 VideoNFT deployed to:", videoNFTAddress);

  // Deploy CreatorToken contract
  const CreatorToken = await ethers.getContractFactory("CreatorToken");
  const creatorToken = await CreatorToken.deploy();
  await creatorToken.waitForDeployment();
  
  const creatorTokenAddress = await creatorToken.getAddress();
  console.log("🎭 CreatorToken deployed to:", creatorTokenAddress);

  console.log("\n✅ Local network setup complete!");
  console.log("\n📋 Next steps:");
  console.log("1. Copy the VideoNFT address above");
  console.log("2. Update your .env.local file:");
  console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS=${videoNFTAddress}`);
  console.log("3. Restart your Next.js app");
  console.log("4. Use the 'Switch to Local Hardhat Network' button in the test page");
  console.log("5. Test minting with much lower gas costs!");
  
  console.log("\n🔗 Network details:");
  console.log("   Chain ID: 31337");
  console.log("   RPC URL: http://127.0.0.1:8545");
  console.log("   Currency: ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error starting local network:", error);
    process.exit(1);
  }); 