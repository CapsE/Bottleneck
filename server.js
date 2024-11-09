import express from 'express';
import {MongoClient} from 'mongodb';
import cors from 'cors';

const app = express();
const PORT = 3000;
const mongoUri = 'mongodb://localhost:27017';
const dbName = 'bottleneck'; // Replace with your actual database name
let db;

// Connect to MongoDB
MongoClient.connect(mongoUri, {useUnifiedTopology: true})
    .then(client => {
        db = client.db(dbName);
        console.log('Connected to MongoDB');
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Enable CORS only for requests from localhost
app.use(cors({
    origin: 'http://localhost:5173' // Allow requests only from this origin
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Route to get a random event not in the excludedIds array
app.get('/random-event', async (req, res) => {
    const excludedIds = req.query.excludedIds ? JSON.parse(req.query.excludedIds) : [];

    try {
        // Aggregate to find a random event not in excludedIds
        const result = await db.collection('event').aggregate([
            {$match: {id: {$nin: excludedIds}}},
            {$sample: {size: 1}}
        ]).toArray();

        // Send the result
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({message: 'No matching event found'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
