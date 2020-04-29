const express = require("express");
const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const Web3 = require("web3");
const fs = require("fs");
const solc = require("solc");

// global vars
const providerPort = 8080;
const url = "ws://127.0.0.1:7545";
const oracleProvider = "0xeFb4666BA4394AeF0351F24335BD80b2e0c75FE5";
const oracleContract = "0xF3F21A633339EE49E1A560154DEbc721b3256992";

// Connect do db
let db;
let games_collection;

const uri = "mongodb://localhost:27017/api-provider";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  if (!err) {
    console.log("connected to db");

    db = client.db("api-provider");
    games_collection = db.collection("games");
  }
});

// Connect to the blockchain
const web3 = new Web3(url);

// let bettingSource = fs.readFileSync("../contract/bet.sol", "utf8");
let oracleSource = fs.readFileSync("../contract/bugiclize.sol", "utf8");

var input = {
  language: "Solidity",
  sources: {
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
let abi;

abi = compiledContract.contracts["bugiclize.sol"]["usingBugiclize"].abi;

// Connect to Oracle contract
const contract = new web3.eth.Contract(abi, oracleContract);

// Setup express and convert payloads to json automatically
const app = express();
app.use(express.json());

// Get all games that are on oracle smart contract
app.get("/games", (req, res) => {
  contract.methods.Bugiclize_getstoredGames().call((err, result) => {
    if (!err) {
      res.send(result);
      return;
    }
    console.log(err);
    res.send(err);
  });
});

app.post("/games", (req, res) => {
  const { teamA, teamB, start, id } = req.body;
  games_collection.insertOne(
    {
      _id: id,
      teamA,
      teamB,
      start: new Date(start),
      end: null,
      winner: null,
    },
    (err, result) => {
      if (!err) {
        const inserted = result.ops[0];
        // update contract
        contract.methods
          .Bugiclize_createGame(id)
          .send({
            from: oracleProvider,
            gas: 6721975,
          })
          .then((result) => {
            // send http response
            res.send(inserted);
          })
          .catch((err) => {
            res.send(err);
          });
        return;
      }
      console.log(err);
      res.send(err);
    }
  );
});

app.post("/games/:id", (req, res) => {
  const { winner } = req.body;
  const id = req.params.id;

  games_collection.findOneAndUpdate(
    { _id: id },
    {
      $set: { winner: winner, end: new Date() },
    },
    {
      returnOriginal: false,
    },
    (err, updated) => {
      if (!err) {
        contract.methods
          .Bugiclize_updateResult(winner, id)
          .send({
            from: oracleProvider,
            gas: 6721975,
          })
          .then((result) => {
            // send http response
            res.send(updated.value);
          })
          .catch((err) => {
            res.send(err);
          });
        return;
      }
      console.log(err);
      res.send(err);
    }
  );
});

app.listen(providerPort, () => {
  console.log(`started server on port ${providerPort}`);
});
