const express = require('express')
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config()
const port = process.env.PORT || 5000;

// ! MIDDLEWARE
app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zioaowq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const verifyJWT = (req , res , next) => { 
    // console.log('hitting verify jwt')
    const authorization = req.headers.authorization ;
    if (!authorization) {
        return res.status(401).send({error : true , message : 'unauthorized access'})
    } 
    const token = authorization.split(' ')[1] ; 
    jwt.verify(token , process.env.ACCESS_TOKEN , (error , decoded)=>{
        if (error) {
            return res.status(403).send({error : true , message : 'unauthorized access'});
        }
        req.decoded = decoded ; 
        next(); 
    })
}

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const database = client.db('carDB')
        const servicesCollection = database.collection('services')


        // !* JWT management 
        
        app.post('/jwt' , (req , res)=>{ 
            const body = req.body ; 
            // console.log(body)
            const token = jwt.sign(body , process.env.ACCESS_TOKEN , { expiresIn : '5h'})
            // console.log(token); 
            res.send({token});  
        })


        //! GET services data 
        app.get('/services', async (req, res) => {
            let cursor = servicesCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })
        // ! Get single services 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = {
                // Include only the `title` and `imdb` fields in the returned document
                projection: { title: 1, price: 1, service_id: 1, img: 1 },
            };

            const result = await servicesCollection.findOne(query, options)
            res.send(result)
        })
        // ! POST ordered services data 
        const orderedServicesCollection = database.collection('orderedServices')
        app.post('/ordered', async (req, res) => {
            const body = req.body;
            const doc = {
                name: body.name,
                email: body.email,
                phone: body.phone,
                message: body.message,
                date: body.date,
                img: body.img,
                title: body.title,
                price: body.price,
            }
            const result = await orderedServicesCollection.insertOne(doc)
            res.send(result)
            // console.log(search)

        })

        // ! GET ordered services data
        app.get('/ordered', verifyJWT , async (req, res) => {
            const search = req.query.email;
            let searchQuery = {};
            if (search) {
                searchQuery = { email: search }
            }
            const cursor = await orderedServicesCollection.find(searchQuery).toArray();
            // console.log(search)
            res.send(cursor)
        })


        // ! Update Pending info 
        app.patch('/ordered/:id', async (req, res) => {
            const id = req.params.id;
            const body = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const doc = {
                $set: {
                    status: body.status , 
                }
            }
            const result = await orderedServicesCollection.updateOne(filter, doc, options)
            res.send(result)
        })

        // ! Delete ordered services data 
        app.delete('/ordered/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await orderedServicesCollection.deleteOne(query)
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


app.get('/', (req, res) => {
    res.send('SERVER IS RUNNING')
})
app.listen(port, () => {
    console.log(`SERVER IS RUNNING ON PORT : ${port}`)
})
