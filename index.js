const express = require("express");
const cors = require("cors");
const Port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zvgiq1x.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

console.log(uri);

async function run() {
  try {
  } finally {
  }
}
run().catch(() => {});

app.get("/", (req, res) => {
  res.send("resale market running on server");
});

app.listen(Port, () => {
  console.log(`Resale Market running on port ${Port}`);
});
