const express = require("express");
const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const Web3 = require("web3");
const fs = require("fs");
const solc = require("solc");
const matches = require("./matches.json");

// global vars
const providerPort = 8080;
const blockchain = "ws://127.0.0.1:7545";
const oracleOwner = "0x77d7f9fD92691D56fDd0DBB735eC961840a624A5";
const oracleContract = "0xE61D3BD9b792F36e8A21ae01CFD4e66a6A909046";

// Connect to the blockchain
const web3 = new Web3(blockchain);

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

// Connect do db
let db;
let games_collection;

const uri =
  "mongodb+srv://dario:Test123@bcon-rkrmy.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
});
client.connect((err) => {
  if (!err) {
    console.log("connected to db");

    db = client.db("api-provider");
    games_collection = db.collection("games");

    // clear collection at startup
    games_collection.deleteMany({}, () => {
      // insert dummy games
      insertingTestGames();
    });
  }
});

// Setup express and convert payloads to json automatically
const app = express();
app.use(express.json());

// return all games stored off-chain for more information
app.get("/games", (req, res) => {
  games_collection.find({}, (err, games) => {
    if (!err) {
      games.toArray().then((games_arr) => {
        res.send(games_arr);
      });
      return;
    }
    res.send(err);
    return;
  });
});

app.get("/games/:id", (req, res) => {
  games_collection.findOne({ _id: parseInt(req.params.id) }, (err, game) => {
    if (!err) {
      res.send(game);
      return;
    }
    res.send(err);
    return;
  });
});

app.post("/games", (req, res) => {
  const { teamA, teamB, start, id, type } = req.body;
  insertGame(teamA, teamB, start, id, type, (result) => {
    res.send(result);
  });
});

app.post("/games/:id", (req, res) => {
  const { winner } = req.body;
  const id = req.params.id;

  updateGame(id, winner, (result) => {
    res.send(result);
  });
});

function insertGame(teamA, teamB, start, id, type, cb) {
  games_collection.insertOne(
    {
      _id: id,
      teamA,
      teamB,
      start: new Date(start),
      end: null,
      winner: null,
      type,
    },
    (err, result) => {
      if (!err) {
        const inserted = result.ops[0];
        // update contract
        contract.methods
          .Bugiclize_createGame(id)
          .send({
            from: oracleOwner,
            gas: 6721975,
          })
          .then((result) => {
            cb(inserted);
          })
          .catch((err) => {
            cb(err);
          });
        return;
      }
      cb(err);
    }
  );
}

function updateGame(id, winner, cb) {
  games_collection.findOneAndUpdate(
    { _id: parseInt(id) },
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
            from: oracleOwner,
            gas: 6721975,
          })
          .then((result) => {
            cb(updated.value);
          })
          .catch((err) => {
            cb(err);
          });
        return;
      }
      cb(err);
    }
  );
}

function insertingTestGames() {
  matches.forEach((match) => {
    const { teamA, teamB, start, id, type } = match;
    insertGame(teamA, teamB, start, id, type, (result) => console.log(result));
  });
}

app.listen(providerPort, () => {
  console.log(`started server on port ${providerPort}`);
});
