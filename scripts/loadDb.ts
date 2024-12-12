import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer";
import OpenAi from "openai";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import "dotenv/config"

const { ASTRA_DB_NAMESPACE, ASTRA_DB_COLLECTION, ASTRA_DB_API_ENDPOINT, ASTRA_DB_APPLICATION_TOKEN, OPENAI_API_KEY} = process.env;

const openai = new OpenAi({ apiKey: OPENAI_API_KEY });

const f1Data=[
    'https://en.wikipedia.org/wiki/Formula_One',
    'https://www.formula1.com',
    'https://www.formula1.com/en/latest/all',
    'https://www.skysports.com/f1/news',
    'https://www.forbes.com/sites/brettknight/2024/12/10/formula-1s-highest-paid-drivers-2024/',
    'https://en.wikipedia.org/wiki/History_of_Formula_One#:~:text=Formula%20One%20automobile%20racing%20has,Championship%20of%20Drivers%20in%201950.'
]

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100,
});

const createCollection = async () => {
    try {
        const res = await db.createCollection(ASTRA_DB_COLLECTION, {
            vector :{
                dimension: 1536
            }
        });
    } catch (error) {
        console.error(error);
    }
}