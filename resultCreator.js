import 'dotenv/config';
import OpenAI from "openai";
import {application} from "./initialize.js";
const openai = new OpenAI({
    // eslint-disable-next-line no-undef
    apiKey: process.env.OPENAI_API_KEY,
});
import fs from "fs";

const systemMessage = fs.readFileSync('./chat-gpt-update.system', 'utf8');

const getFromChatGPT = async (prompt) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {"role": "system", "content": systemMessage},
                {"role": "user", "content": prompt}
            ]
        });

        const responseText = completion.choices[0].message.content;
        console.log("ChatGPT:", responseText);
        const jsonRegex = /```json([\s\S]*?)```/;

        const match = responseText.match(jsonRegex);
        let jsonData;
        if (match && match[1]) {
            try {
                jsonData = JSON.parse(match[1].trim());
            } catch (error) {
                console.error('Error parsing JSON:', error);
                return {error: 'Error parsing JSON'};
            }
        } else {
            try {
                jsonData = JSON.parse(responseText.trim());
            } catch (error) {
                console.error('Error parsing JSON:', error);
                return {error: 'Error parsing JSON'};
            }
        }
        return jsonData;
    } catch (error) {
        console.error(error);
        return {error: 'Internal Server Error'};
    }
}


application.onReady(() => {

    async function processAndBulkUpdateEvents() {
        const cursor = application.db.collection('event').find();

        const delay = 2000;  // Rate limit (100ms delay)
        const batchSize = 2;  // Number of documents to process per batch
        let batch = [];

        for await (const doc of cursor) {
            const newData = await getFromChatGPT(`Update this event
${JSON.stringify(doc)}
`);
            console.log(newData);
            const updatedData = {
                ...doc,
                ...newData,
            };

            batch.push({
                updateOne: {
                    filter: { _id: doc._id },
                    update: { $set: updatedData },
                },
            });

            // If batch size is reached, perform bulk update and reset batch
            if (batch.length >= batchSize) {
                await application.db.collection('event').bulkWrite(batch);
                console.log(`Processed ${batchSize} documents.`);
                batch = [];  // Reset batch

                // Apply rate limit
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        // Perform the final bulk update if there are remaining documents
        if (batch.length > 0) {
            await application.db.collection('event').bulkWrite(batch);
            console.log(`Processed remaining documents.`);
        }

        console.log('Finished processing all documents.');
    }

    processAndBulkUpdateEvents();

})
