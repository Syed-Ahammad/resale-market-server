const express = require("express");
const cors = require("cors");
const Port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zvgiq1x.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true,
serverApi: ServerApiVersion.v1,
});

// console.log(uri);

async function run() {
  try {
    const usersCollection = client.db('resaleMarket').collection('users');
    const productsCollection = client.db('resaleMarket').collection('products');

    // get api for get all product from database
    app.get('/products', async(req, res)=>{
      const query = {};
      const allproducts = await productsCollection.find(query).toArray();
      req.res(allproducts);
    });

    // api for specific user product finding
    app.get('/seller/myproduct', async (req, res)=>{
      const email = req.query.email;
      // console.log(email)
      const query = {email: email};
      const products = await productsCollection.find(query).toArray();
      console.log(products)
  

      res.send(products);
  });

    //  get api create for testing admin
    app.get('/user/admin/:email', async(req,res)=>{
      const email = req.params.email;
      console.log(email)
      const query = {email: email}
      const user = await usersCollection.findOne(query);
      res.send({isAdmin: user?.role === 'admin'});
  });

    // api for save user in mongodb
    app.post('/users', async(req, res)=>{
      const user = req.body;
      const adminQuery = {role: "admin"}
      const adminGet = await usersCollection.findOne(adminQuery);
      if(adminGet == null){
        user.role = "admin"
      }
      const result = await usersCollection.insertOne(user);
      console.log(user)
      res.send(user);

  });

    // api for save product in mongodb
    app.post('/addproduct', async(req, res)=>{
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      console.log(product)
      res.send(result);

  });
    

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
