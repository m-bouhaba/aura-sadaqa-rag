import { Pinecone } from '@pinecone-database/pinecone'

if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY is not defined')
}

export const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
})

export const indexName = process.env.PINECONE_INDEX_NAME || 'aura-sadaqa-index'
