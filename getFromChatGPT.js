import 'dotenv/config';
import OpenAI from "openai";
import {application} from "./initialize.js";
const openai = new OpenAI({
    // eslint-disable-next-line no-undef
    apiKey: process.env.OPENAI_API_KEY,
});

export const getFromChatGPT = async (prompt) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {"role": "system", "content": application.systemMessage},
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
