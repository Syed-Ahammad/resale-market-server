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

// console.log(uri);

async function run() {
  try {
    const usersCollection = client.db("resaleMarket").collection("users");
    const productsCollection = client.db("resaleMarket").collection("products");
    const blogsCollection = client.db("resaleMarket").collection("blogs");
    const bookedProductCollection = client.db("resaleMarket").collection("productBooked");

    // get api for get all product from database
    app.get("/products", async (req, res) => {
      const query = {};
      const allProducts = await productsCollection.find(query).toArray();
      req.res(allProducts);
    });

    // api for specific user product finding
    app.get("/seller/myproduct", async (req, res) => {
      const email = req.query.email;
      // console.log(email)
      const query = { email: email };
      const products = await productsCollection.find(query).toArray();
      // console.log(products);

      res.send(products);
    });

    // get product by category

    app.get('/dashboard/products/:category', async(req, res)=>{
      const category = req.params.category;
      const query = {category: category};
      const result = await productsCollection.find(query).toArray();

      // console.log(result);
      res.send(result);
    })

    //  get api create for testing admin
    app.get("/user/admin/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email);
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });

    // api for loading all products 
    app.get("/admin/allproducts/:email", async(req, res)=>{
      const email = req.params.email;
      const query = {email: email};
      const user = await usersCollection.findOne(query);
      const isAdmin = user?.role === "admin";
      const queryProduct = {};
      const allProducts = await productsCollection.find(queryProduct).toArray()
      // console.log(allProducts)
      if(isAdmin){
        res.send(allProducts);
      }
      else{
        res.send([]);
      }
    })
    // api for loading all sellers 
    app.get("/admin/allsellers/:email", async(req, res)=>{
      const email = req.params.email;
      const query = {email: email};
      const user = await usersCollection.findOne(query);
      const isAdmin = user?.role === "admin";
      const querySeller = {role: "seller"};
      const allSellers = await usersCollection.find(querySeller).toArray()
      // console.log(allSellers)
      if(isAdmin){
        res.send(allSellers);
      }
      else{
        res.send([]);
      }
    })
    
    //  api create for testing buyer
    app.get("/user/buyer/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email);
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      res.send({ isBuyer: user?.role === "buyer" });
    });
    //  api create for testing seller
    app.get("/user/seller/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email);
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      res.send({ isSeller: user?.role === "seller" });
    });

    // api for get product by category
    app.get("/category", async (rep, res) => {
      const allCategory = [];
      const query = {};
      const products = await productsCollection.find(query).toArray();
      const categories = products.forEach((product) => {
        const findCategory = product.category;
        const getCategory = allCategory.find(
          (category) => category == findCategory
        );
        if (!getCategory) {
          allCategory.push(findCategory);
        }
      });
      // console.log(allCategory);
      res.send(allCategory);
    });

    // api for get blogs post from database
    app.get("/blogs", async (req, res) => {
      const query = {};
      const blogs = await blogsCollection.find(query).toArray();
      res.send(blogs);
    });

    // api for save user in mongodb
    app.post("/users", async (req, res) => {
      const user = req.body;
      const email = user.email;
      const adminQuery = { role: "admin" };
      const emailQuery = {email: email};
      const adminGet = await usersCollection.findOne(adminQuery);
      const savedEmail = await usersCollection.findOne(emailQuery);
      if (adminGet == null) {
        user.role = "admin";
      }
      if (savedEmail == null) {
       const result = await usersCollection.insertOne(user);
       res.send(result);
      }
      
      console.log(savedEmail);
    });

    // api for delete user from database
    

    // api for save product in mongodb
    app.post("/addproduct", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      // console.log(product);
      res.send(result);
    });

    // api for booking product save on database
    app.post('/product/booked', async(req, res)=>{
      const booked = req.body;
      const result = await bookedProductCollection.insertOne(booked);
      res.send(result);
    })
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
