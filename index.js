const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    app.get("/reviews/highest", async (req, res) => {
      const cursor = ReviewsCollection.find().sort({ rating: -1 }).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    // GET ALL REVIEWS //

    app.get("/reviews", async (req, res) => {
      const cursor = ReviewsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // GET HIGHEST RATED SINGLE GAME INFO //
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ReviewsCollection.findOne(query);
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

    // GET REVIEWS FROM MONGODB //

    app.get("/reviews", async (req, res) => {
      const cursor = ReviewsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // GET SINGLE REVIEW INFO //
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ReviewsCollection.findOne(query);
      res.send(result);
    });

    // GET SINGLE GAME DETAILS IN MONGODB USING EMAIL //

    app.get("/myWatchlist", async (req, res) => {
      const userEmail = req.query.userEmail;

      const result = await MyGameWatchListCollection.find({ userEmail })
        .sort({ userEmail: 1 })
        .toArray();
      res.send(result);
    });

    // GET SINGLE USERS REVIEWS FROM MONGODB USING EMAIL //

    app.get("/reviews", async (req, res) => {
      const userEmail = req.body.userEmail;
      const result = await ReviewsCollection.find({ userEmail })
        .sort({ userEmail: 1 })
        .toArray();
      res.send(result);
    });

    // POST NEW REVIEW IN MONGODB //

    const ReviewsCollection = client.db("GameLoom").collection("Reviews");

    app.post("/reviews", async (req, res) => {
      const newReview = req.body;
      const result = await ReviewsCollection.insertOne(newReview);
      res.send(result);
    });

    // POST SINGLE GAME DETAILS IN MONGODB //

    const MyGameWatchListCollection = client
      .db("GameLoom")
      .collection("GameWatchlist");
    app.post("/myWatchlist", async (req, res) => {
      const myWatchList = req.body;
      const result = await MyGameWatchListCollection.insertOne(myWatchList);
      res.send(result);
    });

    //UPDATE A REVIEW //

    app.put("/reviews/:id", async (req, res) => {
      const { id } = req.params;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedReview = req.body;
      const review = {
        $set: {
          gameName: updatedReview.gameName,
          genreSelect: updatedReview.genreSelect,
          publicationYear: updatedReview.publicationYear,
          reviewDescription: updatedReview.reviewDescription,
          rating: updatedReview.rating,
          gameThumbnail: updatedReview.gameThumbnail,
        },
      };
      const result = await ReviewsCollection.updateOne(filter, review, options);
      res.send(result);
    });

    // DELETE A REVIEW //

    app.delete("/reviews/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await ReviewsCollection.deleteOne(query);
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
