const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5001
require('dotenv').config()


// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster0.nwipcoy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeeCollection = client.db("coffeesDB").collection("coffees");
    const usersCollection = client.db("coffeesDB").collection("users")
    app.get('/coffees', async(req , res)=>{
        const query =  coffeeCollection.find()
        const result = await query.toArray()
        res.send(result)
    })
    app.get(`/coffees/:id`, async(req, res)=>{
        const id = req.params.id;
        // const query = req.body;
        const filter = {_id: new ObjectId(id)}
        const result = await coffeeCollection.findOne(filter)
        // const options = { upsert: true };
        // const coffeesDoc ={
        //     $set:{
        //         name: query.name, 
        //         quantity:query.quantity, 
        //         supplier:query.supplier, 
        //         taste:query.taste, 
        //         category:query.category,
        //          details:query.details, 
        //          photo:query.photo
        //     }
        // }
        // const result = await coffeeCollection.updateOne(filter, coffeesDoc, options)
        res.send(result)
    })
    
    app.delete('/coffees/:id', async(req, res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const result = await coffeeCollection.deleteOne(filter)
        console.log(result)
        res.send(result)
    })
    // set up users
    app.get('/users', async(req, res)=>{
      const query = usersCollection.find()
      const result = await query.toArray()
      res.send(result)
    })
    app.put('/users', async(req, res)=>{
      const email = req.body.email;
      console.log(email)
      const filter = {email: email}
      const options = { upsert: true };
      const updateDoc ={
        $set:{
          lastSignInTime: req.body.lastSignInTime,
          // email: req.body.email,
        }
      }
      const result = await usersCollection.updateOne(filter, updateDoc,options,)
      res.send(result)
    })
    app.post('/users', async(req, res)=>{
      const user = req.body;
      const result = await usersCollection.insertOne(user)
      res.send(result)
    })
    app.delete(`/users/:id`, async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await usersCollection.deleteOne(filter)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req, res)=>{
    res.send('Would you like a Cup of Delicious Coffee?');
})

app.listen(port,()=>{
    console.log('success coffee premium')
})