const fs = require('fs');
const { execSync } = require('child_process');

async function main() {
    console.log("Starting Verification process...");
    const runData = JSON.parse(fs.readFileSync('broadcast/Deploy.s.sol/10143/run-latest.json', 'utf8'));
    
    const deployments = runData.transactions.filter(t => t.transactionType === "CREATE").map(t => {
        return {
            contractName: t.contractName,
            address: t.contractAddress,
        };
    });

    console.log("Found deployments:", deployments.map(d => d.contractName).join(', '));

    for (const dep of deployments) {
        console.log(`\nVerifying ${dep.contractName} at ${dep.address}...`);
        
        try {
            // 1. Get standard JSON input
            console.log("Getting standard JSON input...");
            execSync(`forge verify-contract ${dep.address} ${dep.contractName} --chain 10143 --show-standard-json-input > /tmp/standard-input.json`);
            const standardInput = JSON.parse(fs.readFileSync('/tmp/standard-input.json', 'utf8'));

            // 2. Get Foundry metadata & extract compilation target and compiler version
            const outPath = `out/${dep.contractName}.sol/${dep.contractName}.json`;
            const outData = JSON.parse(fs.readFileSync(outPath, 'utf8'));
            const metadata = outData.metadata;
            
            // Extract the path from compilationTarget (e.g., {"src/TestnetUSDC.sol": "TestnetUSDC"})
            const targets = Object.keys(metadata.settings.compilationTarget);
            const contractFile = targets.find(t => metadata.settings.compilationTarget[t] === dep.contractName);
            const fullContractName = `${contractFile}:${dep.contractName}`;
            const compilerVersion = `v${metadata.compiler.version}`;

            // Prepare payload
            const payload = {
                chainId: 10143,
                contractAddress: dep.address,
                contractName: fullContractName,
                compilerVersion: compilerVersion,
                standardJsonInput: standardInput,
                foundryMetadata: metadata
            };

            fs.writeFileSync('/tmp/verify.json', JSON.stringify(payload));

            // Call API
            console.log(`Calling verification API for ${dep.contractName}...`);
            const result = execSync(`curl -s -X POST https://agents.devnads.com/v1/verify -H "Content-Type: application/json" -d @/tmp/verify.json`).toString();
            console.log(`Result: ${result}`);

        } catch (error) {
            console.error(`Failed to verify ${dep.contractName}:`, error.message);
            if (error.stdout) console.log(error.stdout.toString());
            if (error.stderr) console.error(error.stderr.toString());
        }
    }
}

main().catch(console.error);
