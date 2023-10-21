const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())





 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wua58o9.mongodb.net/?retryWrites=true&w=majority`;
 console.log(uri);

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
    // await client.connect();

    const productCollection = client.db('productDB').collection('product')
    const userCollection = client.db('userDB').collection('user')

    app.get('/product',async(req,res)=>{
      const cursor = productCollection.find()
      const result = await cursor.toArray()
      res.send(result) 
    })

    app.get('/product/:id', async(req,res)=>{
      const id = req.params.id
      const query = {_id : new ObjectId(id)}
      const result = await productCollection.findOne(query)
      res.send(result)
    })

   

    
//product
    app.post ('/product', async(req,res)=>{
      const newProduct = req.body
      console.log(newProduct);

//user
      app.post('/user',async(req,res)=>{
        const user = req.body
        console.log(user);
        const result = await userCollection.insertOne(user)
        res.send(result)
      } )

      const result = await productCollection.insertOne(newProduct)
      res.send(result)
    })

//product update
    app.put('/product/:id', async(req,res)=>{
      const id = req.params.id
      const filter = {_id : new ObjectId(id)}
      const options = {upsert : true}
      const updatedProduct = req.body
      const product ={
        $set:{
          name:updatedProduct.name,
          photo:updatedProduct.photo,
          brand_name:updatedProduct.brand_name,
          type :updatedProduct.type,
          price:updatedProduct.price,
          description:updatedProduct.description,
          rating:updatedProduct.rating,

        }
      }
      const result = await productCollection.updateOne(filter,product,options)
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('Fashion and apparel server is running')
})

app.listen(port, ()=>{
    console.log(`Fashion and apparel server is running on PORT : ${port}`);
})
