# BCON Challange Task Group Monero

## Setup

In order to get everything up and running you can simply follow all the steps listed:

1. Clone repository: git clone https://github.com/lutharsanen/e-sports-smart-contract.git
2. Install Node.js (https://nodejs.org)
3. Setup Ganache: Create a new workspace and set the Mnemonic to “oppose panther put grant end shy twin crunch limb armor dragon snap”. Also, make it run on 127.0.0.1:7545. Then you don’t need to manually adjust any addresses in the contracts.
4. Setup our server:
 * Navigate into the “server” directory and run the following command: “npm install” to install all dependencies.
 * To start the server run “npm run dev”. This command will compile the contracts and deploy it to the blockchain. Copy the contract address you can see in the terminal (needed for setting up the provider in the next step).
5. Setup provider:
 * Navigate into the “provider” directory and run the following command: “npm install” to install all dependencies.
 * Copy the address from step 4 into the variable “oracleContract” at line 13.
 * Run “npm run dev” to start the provider. Some sample games will automatically be added to the database and the contract oracle, which then also emits an event, which our betting contract listens for and therefore our betting contract offers now some games to bet on.
6. Setup frontend:
 * Navigate into the “client” directory and run the following command: “npm install” to install all dependencies.
 * Install “Metamask”
 * Set BETTING_CONTRACT_ADDRESS inside src/main/contracts.js (contract address from step 4)
 * Run “npm start”
 * Open localhost:3000 in a supported browser (Chrome, Firefox or Brave)

Now you can interact with our smart contract in the frontend and place your bet. As soon as the provider indicates that a game has finished (using POST /games/:id and sending the winner (0 or 1) in the body), the payout function will be called automatically.

