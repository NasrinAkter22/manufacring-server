const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gsnphey.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


//Verify Token-----------------//
function verifyJWT(req, res, next){
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).send({message: 'UnAuthorize access'});
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
    if(err){
      console.log(err)
      return res.status(403).send({message: 'Forbidden access'})
    }
    req.decoded = decoded;
    next();
  });
}


async function run() {
    try {
        await client.connect();
        console.log('database connected')
        const userCollection = client.db('top-car').collection('user');
        const itemCollection = client.db('top-car').collection("item");
        const reviewCollection = client.db('top-car').collection("reviews");
        const orderCollection = client.db('top-car').collection("orders");
        const paymentCollection = client.db('top-car').collection("payments");
        const profileCollection = client.db('top-car').collection("profile");

        

// verify Admin function:
        const verifyAdmin = async (req, res, next) => {

          const requester = req.decoded.email;
          const requesterAccount = await userCollection.findOne({email: requester});
            if (requesterAccount.role === 'admin'){
              next()
            }
            else{
              res.status(403).send({message: 'forbidden'})
            }
        }

        // Product all api
        app.get("/item", async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
          });
      

          app.get('/item/:id',async(req, res)=>{
          const id = req.params.id;
          const query={_id: ObjectId(id)};
          const product = await itemCollection.findOne(query);
          res.send(product);
      })

     
      // add new products api
      app.post('/item',verifyJWT, async(req, res)=>{
        const newItem = req.body;
        const tokenInfo = req.header.authorization;
        const result = await itemCollection.insertOne(newItem);
        res.send(result);
      })

      // Delete products api
      app.delete('/item/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await itemCollection.deleteOne(query);
        res.send(result)
      })
      
// all order get api
      app.get("/allOrder",verifyJWT, verifyAdmin, async (req, res) => {
        const query = {};
        const cursor = orderCollection.find(query);
        const orders = await cursor.toArray();
        res.send(orders);
      });

      
// Order get api
       app.get('/order',verifyJWT, async(req,res)=>{
        const email = req.query.email;
        const decodedEmail = req.decoded.email;
        console.log(decodedEmail,email)
        if(email === decodedEmail){
        const query = {email:email} ;
        const cursor = orderCollection.find(query)
        const order = await cursor.toArray()
        res.send(order)
        }
        else{
          return res.status(403).send({message: 'forbidden access'});
        }
      });




    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Top car Parts')
})

app.listen(port, () => {
    console.log(`Top car listening on port ${port}`)
})