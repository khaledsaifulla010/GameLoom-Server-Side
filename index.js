const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5000;

// Middlewares //

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("GameLoom Server is Running");
});

app.listen(port, () => {
  console.log(`GameLoom Server is Running on ${port}`);
});
