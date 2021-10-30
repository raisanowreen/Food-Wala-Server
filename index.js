const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');


const app = express();


require('dotenv').config();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ywqs1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('foodWala');
        const foodCollections = database.collection('foods');
        const orderCollection = database.collection('orders');
        const myOrderCollection = database.collection('myOrders');

// GET API
app.get('/foods', async(req, res)=>{
    const cursor = foodCollections.find({});
    const foods = await cursor.toArray();
    res.send(foods);
})


// GET SINGLE FOOD
app.get('/foods/:id', async(req, res)=>{
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const food = await foodCollections.findOne(query);
    res.json(food);
})


        // POST API
        app.post('/foods', async(req, res)=>{
            const food = req.body;
            console.log('hit the post api', food)
            const result = await foodCollections.insertOne(food);
            console.log(result);
            res.json(result);
        });

// GET ORDERS API
app.get('/orders', async(req, res)=>{
    const cursor = orderCollection.find({});
    const orders = await cursor.toArray();
    res.send(orders);
})

          // ADD ORDERS API
    app.post('/orders', async(req, res)=>{
        const order = req.body;
        const result = await orderCollection.insertOne(order);
        res.json(result);
    })




    // Cancel MY ORDER API
app.delete('/foods/:id', async(req,res)=>{
    const id= req.params.id;
    const query= {_id:ObjectId(id)};
    const result = await foodCollections.deleteOne(query);
    res.json(result);
})

// GET MY ORDERS API
app.get('/myOrders', async(req, res)=>{
    const cursor = myOrderCollection.find({});
    const orders = await cursor.toArray();
    res.send(orders);
})


// ADD MY ORDERS
app.post('/myOrders',(req, res)=>{
    console.log(req.body);
    myOrderCollection.insertOne(req.body).then((result)=>{
       res.send(result);
    })
})


// GET MY ORDERS with email
app.get('/myOrders/:email', async(req,res)=>{
    console.log(req.params.email);

    const result = await myOrderCollection.find({email: req.params.email}).toArray();
    res.send(result);

})




// DELETE MY ORDER API
app.delete('/myOrders/:id', async(req, res)=>{
    const id = req.params.id;
    console.log(id);
    const query = {_id: ObjectId(id)};
    const result = await myOrderCollection.deleteOne(query);
    res.json(result);
})





// DELETE ANYONE'S ORDER API
app.delete('/orders/:id', async(req, res)=>{
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const result = await orderCollection.deleteOne(query);
    res.json(result);
})

    }


    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req,res) =>{
    res.send('FoodWala server is running');
});

app.listen(port, ()=>{
    console.log('Server running at port', port);
});