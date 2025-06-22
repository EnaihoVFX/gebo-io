const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  console.log("🚀 Deploying VideoToken contract to Polygon Mumbai...");
  
  // Connect to Polygon Mumbai
  const provider = new ethers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com");
  
  // Check if we have a private key
  if (!process.env.PRIVATE_KEY) {
    console.log("❌ No private key found in .env.local");
    console.log("📝 Please add your private key to .env.local:");
    console.log("   PRIVATE_KEY=your_private_key_here");
    console.log("");
    console.log("🔑 To get your private key from MetaMask:");
    console.log("   1. Open MetaMask");
    console.log("   2. Go to Account Details");
    console.log("   3. Export Private Key");
    console.log("   4. Copy the private key");
    return;
  }
  
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  console.log("👤 Deploying from address:", wallet.address);
  
  // Check balance
  const balance = await provider.getBalance(wallet.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "MATIC");
  
  if (balance < ethers.parseEther("0.01")) {
    console.log("❌ Insufficient balance for deployment");
    console.log("💧 Get test MATIC from: https://faucet.polygon.technology/");
    return;
  }
  
  console.log("📄 Contract source code prepared");
  console.log("⚠️  For full deployment, please use Remix IDE:");
  console.log("   1. Go to https://remix.ethereum.org/");
  console.log("   2. Create new file 'VideoToken.sol'");
  console.log("   3. Copy the contract code from contracts/VideoToken.sol");
  console.log("   4. Compile (Ctrl+S)");
  console.log("   5. Deploy to Polygon Mumbai");
  console.log("   6. Copy the deployed address");
  console.log("");
  console.log("🔗 Polygon Mumbai RPC: https://rpc-mumbai.maticvigil.com");
  console.log("🔗 Block Explorer: https://mumbai.polygonscan.com");
  console.log("💧 Faucet: https://faucet.polygon.technology/");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 