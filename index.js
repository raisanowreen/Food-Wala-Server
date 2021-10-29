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