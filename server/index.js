const Web3 = require("web3");
const express = require("express");
const fs = require("fs");
const solc = require("solc");

// global vars
const serverPort = 3000;
const blockchain = "ws://127.0.0.1:7545";
const bettingOwner = "0xbC8089083768a4894FCBB309A2D568f8990C0900";

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
const web3 = new Web3(blockchain);

// Create smart contract
let contract = new web3.eth.Contract(abi, {
  gasPrice: "20000000000",
  gas: 6721975,
  from: bettingOwner,
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
      if (err) {
        console.log(err);
      }
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
          from: bettingOwner,
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
          from: bettingOwner,
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
  res.send(bettingOwner);
});

app.get("/abi", (req, res) => {
  res.send(abi);
});

// get all game id's from contract
app.get("/games", (req, res) => {
  contract.methods
    .getstoredGames()
    .call()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
});

// get betting info for a single game from contract
app.get("/games/:id", (req, res) => {
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

app.post("/bet", (req, res) => {
  const { fromAccount, gameId, winner, amount } = req.body;

  contract.methods
    .bet(winner, gameId)
    .send({
      from: fromAccount,
      value: amount,
      gas: 6721975,
    })
    .then((result) => {
      console.log(result);
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

app.listen(serverPort, () => {
  console.log(`started server on port ${serverPort}`);
});
