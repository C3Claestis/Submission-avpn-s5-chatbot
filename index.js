import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import express from 'express';
import multer from "multer";
import fs from 'fs';
import cors from 'cors';


const app = express();
const upload = multer();
const ai = new GoogleGenAI({});

const geminiModels = {
    text: "gemini-2.5-flash-lite",    
    image: "gemini-2.5-flash",
    audio: "gemini-2.5-flash",
    document: "gemini-2.5-flash-lite",
}

app.use(cors());

app.use(express.json());

app.post('/generate-text', async(req, res) => {
    const { message } = req.body || {};

    if(!message || typeof message !== 'string'){
        res.status(400).json({ message: "Pesan tidak ada atau format tidak sesuai!" });
        return;
    }

    const response = await ai.models.generateContent({
        contents: message,
        model: geminiModels.text
    });

    res.status(200).json({
        reply: response.text
    })
});

const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});