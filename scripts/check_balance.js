const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545"); // URL Besu

async function getAccountBalance(address) {
    const balance = await provider.getBalance(address);
    console.log(`Balance of ${address}: ${ethers.formatEther(balance)} ETH`);
}

const accountAddress = "0xc35d99522804772ad580ab6400753e589bb32952";
getAccountBalance(accountAddress);