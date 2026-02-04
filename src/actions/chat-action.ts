'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { pinecone, indexName } from '@/lib/pinecone'

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function askAssistant(question: string) {
    try {
        if (!question || !question.trim()) return "Please provide a question."

        // 1. Generate text embedding for the question
        const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' })
        const embeddingResult = await embeddingModel.embedContent(question)
        const vector = embeddingResult.embedding.values

        // 2. Query Pinecone for similar vectors
        const index = pinecone.index(indexName)
        const queryResponse = await index.query({
            vector: vector,
            topK: 5,
            includeMetadata: true,
        })

        const matches = queryResponse.matches || []

        // 3. Extract text from metadata
        const contextDocs = matches
            .filter((match) => match.metadata && match.metadata.text)
            .map((match) => (match.metadata as { text: string }).text)

        // Check if we retrieved meaningful context
        if (contextDocs.length === 0) {
            return "I don’t have enough information in the knowledge base to answer this."
        }

        // Join the context chunks
        const contextText = contextDocs.join('\n\n---\n\n')

        // 4. Construct the prompt for Gemini
        // Strict instruction to use ONLY the context
        const systemPrompt = `You are a helpful AI assistant for a RAG (Retrieval Augmented Generation) system.
You will be provided with a Context containing chunks of text from a knowledge base.
Your goal is to answer the User Question using ONLY the information found in the Context.

Guidelines:
1. If the answer exists in the Context, provide it clearly and concisely.
2. If the Context DOES NOT contain enough information to answer the question, you MUST respond exactly with:
   "I don’t have enough information in the knowledge base to answer this."
3. Do not make up information or use outside knowledge.

Context:
${contextText}

User Question: ${question}
`

        // 5. Generate Answer
        // Using gemini-1.5-flash for speed and quality, or fallback to gemini-pro
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })

        const result = await model.generateContent(systemPrompt)
        const response = await result.response
        const answer = response.text()

        return answer

    } catch (error) {
        console.error('Error in askAssistant:', error)
        return "An error occurred while trying to fetch the answer."
    }
}
