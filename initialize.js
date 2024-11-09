import 'dotenv/config';
import {MongoClient} from "mongodb";
import fs from "fs";
import {imageDescriptions} from "./src/imageList.js";
import { fileURLToPath } from 'url';
import * as path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'bottleneck';

export class Application {
    constructor() {
        this.init().then(() => {
            console.log("Initializing complete");
        });
        this.callbackQueue = [];
        this.__dirname = __dirname;
    }

    async init() {
        const client = await MongoClient.connect(mongoUri, {useUnifiedTopology: true})
        this.db = client.db(dbName);
        console.log('Connected to MongoDB');

        this.basicEvents = await this.db.collection('event').aggregate([
            {$sample: {size: 50}},  // Get up to 50 random items
            {$project: {title: 1}}   // Only include the 'title' field
        ]).toArray();
        this.basicEvents = this.basicEvents.map((e) => e.title);

        this.systemMessage = fs.readFileSync('./chat-gpt.system', 'utf8');
        this.systemMessage = this.systemMessage.replace('<imageList>', JSON.stringify(imageDescriptions));
        this.systemMessage = this.systemMessage.replace('<eventList>', JSON.stringify(this.basicEvents));
        console.log('System-Message', this.systemMessage);
        this.isReady = true;
        this.callbackQueue.forEach((item) => {
            item();
        });
        this.callbackQueue = [];
    }

    onReady(callback) {
        if(this.isReady) {
            callback();
            return;
        }

        this.callbackQueue.push(callback);
    }
}

export const application = new Application();
