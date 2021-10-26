const express = require('express');
const { MongoClient, } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());
// user: myfirstdb
// pass: wzNd4lbuJcXEntQy

const uri = "mongodb+srv://myFirstDb:wzNd4lbuJcXEntQy@cluster0.ql7ij.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("models");
      const collection = database.collection("users");
      // GET API
      app.get('/users', async(req,res)=>{
        const cursor = collection.find({});
        const users = await cursor.toArray();
        res.send(users);
        // res.send(users)
      })
      // GET SINGLE API
      app.get('/users/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
        const result= await collection.findOne(query)
        // console.log('get id: ',id);
        res.json(result)
      })
      // POST API
      app.post('/users', async(req,res)=>{
        const newUser = req.body;
        const result = await collection.insertOne(newUser)
        // console.log('hittine the posst',req.body);
        // console.log('inserte user', result);
        res.json(result);
      })
      // UPDATE API
      app.put('/users/:id',async(req,res)=>{
        const id = req.params.id;
        const updateUser = req.body;
        const query = {_id:ObjectId(id)};
        const options = {upsert:true};
        const updateDoc = {
          $set: {
            name: updateUser.name,
            email: updateUser.email
          },
        };
        const result = await collection.updateOne(query,updateDoc,options)
        console.log(result);
        res.send(result)
      })
      // DELETE API
      app.delete('/users/:id',async(req,res)=>{
        const id=req.params.id;
        const query = {_id:ObjectId(id)}
        const result = await collection.deleteOne(query)
        // console.log('deleting user id', id);
        res.json(result);
      })
    } 
    finally {
      // await client.close();
    }
  }
  run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('hello express, i am here with you! whats up?')
})

app.listen(port,()=>{
    console.log('Running server on port',port);
})