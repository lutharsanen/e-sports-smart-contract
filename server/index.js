const Web3 = require("web3");
const express = require("express");
const fs = require("fs");
const solc = require("solc");

// global vars
const backendPort = 3000;
const url = "ws://127.0.0.1:7545";
const owner = "0xaf0831CaBCcBb78168520f3128171B24607e49A2";

// Compile smart contract
let bettingSource = fs.readFileSync("../contract/bet.sol", "utf8");
let oracleSource = fs.readFileSync("../contract/bugiclize.sol", "utf8");

var input = {
  language: "Solidity",
  sources: {
    "bet.sol": {
      content: bettingSource,
    },
    "bugiclize.sol": {
      content: oracleSource,
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

bytecode = compiledContract.contracts["bet.sol"]["Betting"].evm.bytecode.object;
abi = compiledContract.contracts["bet.sol"]["Betting"].abi;

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
  .send(
    {
      value: "1",
    },
    (err, res) => {
      console.log("tx sent to deploy contract", res);
    }
  )
  .then(function (newContractInstance) {
    console.log(
      "new contract deployed at address",
      newContractInstance._address
    );
    contract = newContractInstance; // overwrite the "old" intance

    // Connect to GameInfo Event
    contract.events.Gamecreated((err, event) => {
      const createdId = JSON.parse(JSON.stringify(event)).returnValues.gameid;
      console.log("game created with id", createdId);

      contract.methods
        .createNewGame(createdId)
        .send({
          from: owner,
          gas: 6721975,
        })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    });

    contract.events.Gamefinished((err, event) => {
      const finishedId = JSON.parse(JSON.stringify(event)).returnValues.gameid;
      console.log("game finished with id", finishedId);

      contract.methods
        ._payout(finishedId)
        .send({
          from: owner,
          gas: 6721975,
          value: web3.utils.toWei("0.51", "ether"),
        })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Setup express and convert payloads to json automatically
const app = express();
app.use(express.json());

// Endpoints
app.get("/owner", (req, res) => {
  res.send(owner);
});

app.get("/abi", (req, res) => {
  res.send(abi);
});

app.get("/games/:id", (req, res) => {
  // get certain game from contract
  contract.methods
    .betInfo(req.params.id)
    .call()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.listen(backendPort, () => {
  console.log(`started server on port ${backendPort}`);
});
