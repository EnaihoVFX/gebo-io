const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying VideoToken to Polygon Mumbai...");
  
  // Get the contract factory
  const VideoToken = await ethers.getContractFactory("VideoToken");
  
  console.log("📄 Compiling contract...");
  
  // Deploy the contract
  const videoToken = await VideoToken.deploy();
  
  console.log("⏳ Waiting for deployment...");
  
  // Wait for deployment to finish
  await videoToken.waitForDeployment();
  
  const address = await videoToken.getAddress();
  
  console.log("✅ VideoToken deployed successfully!");
  console.log("📍 Contract Address:", address);
  console.log("🔗 Polygon Mumbai Explorer: https://mumbai.polygonscan.com/address/" + address);
  console.log("");
  console.log("📝 Add this to your .env.local file:");
  console.log("NEXT_PUBLIC_CONTRACT_ADDRESS=" + address);
  console.log("");
  console.log("🎉 Your Gebo platform is ready for Polygon Mumbai!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 