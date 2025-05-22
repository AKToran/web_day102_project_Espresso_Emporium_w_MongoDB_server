const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cjjjauk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    //create or access db:
    const database = client.db('coffeeDB');
    const coffeeCollection = database.collection('coffees')

    app.get('/coffees', async(req, res)=>{
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.post('/coffees', async(req, res)=>{
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee)
      res.send(result)
    })

    app.delete('/coffees/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = coffeeCollection.deleteOne(query);
      res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } 
  finally {
    // don't want to close the server after just one ping.
    // await client.close();
  }
}
run().catch(console.dir);


app.use(cors());
app.use(express.json());

app.get('/', (req, res)=>{
  res.send("Coffee is brewing....");
})

app.listen(port, ()=>{
  console.log("coffee server is running on port:", port);
})