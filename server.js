import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {getFromChatGPT} from "./getFromChatGPT.js";
import {application} from "./initialize.js";
import * as path from "node:path";
import {ObjectId} from "mongodb";

const generationChance = (process.env.GENERATION_CHANCE || process.env.GENERATION_CHANCE === 0) ? process.env.GENERATION_CHANCE : 10;

application.onReady(() => {
    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(cors({
        origin: 'http://localhost:5173' // Allow requests only from this origin
    }));

    app.use(express.static(path.join(application.__dirname, 'public')));
    app.use(express.static(path.join(application.__dirname, 'dist')));

    app.use(express.json());

    app.get('/random-event', async (req, res) => {
        let excludedIds = req.query.excludedIds ? JSON.parse(req.query.excludedIds) : [];
        excludedIds = excludedIds.map((id) => new ObjectId(id));

        try {
            const r = Math.random() * 100;
            if(r <= generationChance) {
                const json = await getFromChatGPT("write a basic event for the game");
                await application.db.collection('event').insertOne(json);
                res.json(json);
                return;
            }
            // Aggregate to find a random event not in excludedIds
            const result = await application.db.collection('event').aggregate([
                {$match: {_id: {$nin: excludedIds}}},
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

    // app.get('/test', async (req, res) => {
    //     res.json(await getFromChatGPT("write a basic event for the game"));
    // });

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
