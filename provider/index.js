const express = require("express");
const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const WebSocket = require("ws");

// global vars
const httpPort = 8080;
const webSocketPort = 9000;

// Creating web socket server
const wss = new WebSocket.Server({ port: webSocketPort }, () => {
  console.log(`websocket running at port ${webSocketPort}`);
});

wss.on("connection", function connection(ws) {
  ws.send("Welcome to the fake api provider");
});

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

// Setup express and convert payloads to json automatically
const app = express();
app.use(express.json());

// Endpoints
app.get("/games", (req, res) => {
  const games = games_collection.find().toArray((err, result) => {
    console.log(result);
    res.send(result);
  });
});

app.get("/games/:id", (req, res) => {
  const id = new mongo.ObjectID(req.params.id);
  const games = games_collection.find({ _id: id }).toArray((err, result) => {
    if (!err) {
      // send to all clients over websockets
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(inserted));
        }
      });
      // send http response to sender of the request
      res.send(result);
    }
    console.log(err);
  });
});

app.post("/games", (req, res) => {
  const { team1, team2, start } = req.body;
  games_collection.insertOne(
    {
      team1: team1,
      team2: team2,
      start: new Date(start),
      end: null,
      winner: null,
    },
    (err, result) => {
      if (!err) {
        const inserted = result.ops[0];
        // send to all clients over websockets
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(inserted));
          }
        });
        // send http response to sender of the request
        res.send(inserted);
      }
      console.log(err);
    }
  );
});

app.post("/games/:id", (req, res) => {
  const { winner } = req.body;
  const id = new mongo.ObjectID(req.params.id);

  games_collection.findOneAndUpdate(
    { _id: id },
    {
      $set: { winner: winner, end: new Date() },
    },
    {
      returnOriginal: false,
    },
    (err, result) => {
      if (!err) {
        res.send(result.value);
      }
      console.log(err);
    }
  );
});

app.listen(httpPort, () => {
  console.log(`started server on port ${httpPort}`);
});
