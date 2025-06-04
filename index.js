const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json());

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
    // await client.connect();

    //create or access db:
    const database = client.db('coffeeDB');
    const coffeeCollection = database.collection('coffees');
    // one db can have multiple collections:
    const usersCollection = database.collection('users');

    app.get('/coffees', async(req, res)=>{
      const cursor = coffeeCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/coffees/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })

    app.post('/coffees', async(req, res)=>{
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee)
      res.send(result)
    })

    app.put('/coffees/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const updatedDoc = { 
        $set: updatedCoffee
      };
      const result = await coffeeCollection.updateOne(query, updatedDoc, options);
      res.send(result);
    })

    app.delete('/coffees/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })

    //user related apis:
    app.post('/users', async(req, res)=>{
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    })

    app.get('/users', async(req, res)=>{
      const users = await usersCollection.find().toArray();
      res.send(users);
    })

    app.patch('/users', async(req, res)=>{
      const {email, lastSignInTime} = req.body;
      const filter = { email };
      const updatedDoc = {
        $set: {
          lastSignInTime : lastSignInTime
        }
      }
      const result = await usersCollection.updateOne(filter,updatedDoc);
      res.send(result);
    })

    app.delete('/users/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id : new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    })


    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } 
  finally {
    // don't want to close the server after just one ping.
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
  res.send("Coffee is brewing....");
})

app.listen(port, ()=>{
  console.log("coffee server is running on port:", port);
})