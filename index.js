const express = require('express')
const cors =require('cors')
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()



const app = express()
app.use(cors())
app.use(bodyParser.json())

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://dbUser:4t5HdpFwgk0Pga3U@cluster0.iwezd.mongodb.net/burgerHouse?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/',(req,res)=>{
    res.send("Burger House working")
})


client.connect(err => {
  const burgerCollection = client.db("burgerHouse").collection("burger");
  const orderCollection = client.db("burgerHouse").collection("orders");
  const adminCollection = client.db("burgerHouse").collection("allAdmin");
 
  app.post('/addBurger', (req, res) => {
    const newBurger = req.body;
    console.log('adding new event: ', newBurger)
    burgerCollection.insertOne(newBurger)
    .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
    })
})

app.get('/burger',(req,res)=>{
    burgerCollection.find()
    .toArray((err,documents)=>{
        res.send(documents)
    })
})

app.get('/burger/:name',(req,res)=>{
    burgerCollection.find({name:req.params.name})
    .toArray((err,documents)=>{
        res.send(documents[0])
    })
})

app.post('/allOrder',(req,res)=>{
    const newOrder = req.body
    orderCollection.insertOne(newOrder)
    .then(result=>{
        res.send(result.insertedCount > 0)
    })
})

app.get('/orderList',(req,res)=>{
    orderCollection.find({})
    .toArray((err,documents)=>{
        res.send(documents)
    })
})

app.get('/orders',(req,res)=>{
    orderCollection.find({email:req.query.email})
    .toArray((err,documents)=>{
        res.send(documents)
    })
})

app.post('/addAdmin',(req,res)=>{
    const newAdmin = req.body
    adminCollection.insertOne(newAdmin)
    .then(result=>{
        res.send(result.insertedCount > 0)
    })
})

app.get('/admin', (req, res) => {
    adminCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
  });

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
        .toArray((err, admin) => {
            res.send(admin.length > 0);
        })
  })

  app.patch('/updateOrder/:id',(req,res)=>{
    orderCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {status: req.body.status} 
    })
    .then(result=>{
      res.send(result.modifiedCount > 0)
    })
  
  })

app.delete('/deleteProduct/:id', (req, res) => {
    const id = req.params.id;
    orderCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
        res.send(result.deletedCount > 0)
    })
  })

  app.delete('/deleteFood/:id',(req,res)=>{
      const id = req.params.id 
      burgerCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result=>{
          res.send(result.deleteOne > 0)
      })
  })
  


});



app.listen(5000,console.log("lisenting to port 5000"))