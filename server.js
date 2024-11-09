import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {getFromChatGPT} from "./getFromChatGPT.js";
import {application} from "./initialize.js";
import * as path from "node:path";

application.onReady(() => {
    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(cors({
        origin: 'http://localhost:5173' // Allow requests only from this origin
    }));

    app.use(express.static(path.join(application.__dirname, 'public')));

    app.use(express.json());

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

    app.get('/test', async (req, res) => {
        res.json(await getFromChatGPT("write a basic event for the game"));
    });

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
