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