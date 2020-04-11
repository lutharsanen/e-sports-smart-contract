const Web3 = require("web3");
const express = require("express");
const abi = require("../contract/ABI.json");

// global vars
const backendPort = 3000;
const contractAddress = "0x52446b39697e17834A633eB68711F55f2110E8Fb";
const url = "ws://127.0.0.1:7545";
let owner;

// Connect to Blockchain
const web3 = new Web3(url);

// Connect to a smart contract
// set the default account (owner address)
const contract = new web3.eth.Contract(abi, contractAddress);
contract.methods.owner().call((err, res) => {
  owner = res;
});

// connect to GameInfo Event
contract.events.GameInfo((err, event) => {
  console.log("error " + err);
  console.log("event " + event);
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
      console.log(res);
    });
});

app.listen(backendPort, () => {
  console.log(`started server on port ${backendPort}`);
});
