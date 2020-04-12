const Web3 = require("web3");
const express = require("express");
const fs = require("fs");
const solc = require("solc");

// global vars
const backendPort = 3000;
const url = "ws://127.0.0.1:7545";
const owner = "0xaf0831CaBCcBb78168520f3128171B24607e49A2";

// Compile smart contract
let source = fs.readFileSync("../contract/bet.sol", "utf8");
let provable = fs.readFileSync("../contract/provableAPI_0.5.sol", "utf8");

var input = {
  language: "Solidity",
  sources: {
    "bet.sol": {
      content: source,
    },
    "provableAPI_0.5.sol": {
      content: provable,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

let compiledContract = JSON.parse(solc.compile(JSON.stringify(input)));
let bytecode;
let abi;

for (var contractName in compiledContract.contracts["bet.sol"]) {
  bytecode =
    compiledContract.contracts["bet.sol"][contractName].evm.bytecode.object;
  abi = compiledContract.contracts["bet.sol"]["Betting"].abi;
}

// Connect to Blockchain
const web3 = new Web3(url);

// Create smart contract
let contract = new web3.eth.Contract(abi, {
  gasPrice: "20000000000",
  gas: 6721975,
  from: owner,
  data: bytecode,
});

// Deploy smart contract
contract
  .deploy()
  .send({}, (err, res) => {
    console.log("contract deployed", res);
  })
  .then(function (newContractInstance) {
    contract = newContractInstance; // overwrite the "old" intance

    // Connect to GameInfo Event
    contract.events.GameInfo((err, event) => {
      console.log(event);
    });
  });

// Setup express and convert payloads to json automatically
const app = express();
app.use(express.json());

// Endpoints
app.get("/owner", (req, res) => {
  res.send(owner);
});

app.post("/games", (req, res) => {
  res.send("Hello from the games endpoint");
  const { team1, team2 } = req.body;
  contract.methods
    ._createNewGame(team1, team2)
    .send({ from: owner }, (err, res) => {
      console.log("game created ", res);
    });
});

app.listen(backendPort, () => {
  console.log(`started server on port ${backendPort}`);
});
