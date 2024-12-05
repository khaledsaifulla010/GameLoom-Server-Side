const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;

// MIDDLEWIRES //

app.use(cors());
app.use(express.json());

// CONNECT WITH MONGOBD//

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ugbxhsw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // GET HIGHEST RATED GAMES //

    const HighRatedGamesCollection = client
      .db("GameLoom")
      .collection("HighRatedGames");

    app.get("/highRatedGames", async (req, res) => {
      const cursor = HighRatedGamesCollection.find()
        .sort({ rating: -1 })
        .limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    // GET COMMING SOON GAMES //

    const ComingSoonGamesCollection = client
      .db("GameLoom")
      .collection("ComingSoonGames");

    app.get("/comingSoonGames", async (req, res) => {
      const cursor = ComingSoonGamesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // GET TOP PLAYERS GAME REVIEW //

    const TopPlayerGameReviewCollection = client
      .db("GameLoom")
      .collection("TopPlayerGameReview");

    app.get("/topPlayerGameReview", async (req, res) => {
      const cursor = TopPlayerGameReviewCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

// SERVER RUNNING //

app.get("/", (req, res) => {
  res.send("GameLoom Server is Running");
});

app.listen(port, () => {
  console.log(`GameLoom Server is Running on ${port}`);
});
