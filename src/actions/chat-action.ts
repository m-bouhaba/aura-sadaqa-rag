'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { pinecone, indexName } from '@/lib/pinecone'

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function askAssistant(question: string) {
    try {
        if (!question || !question.trim()) return "Please provide a question."

        // 1. Generate text embedding for the question
        const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' })
        const embeddingResult = await embeddingModel.embedContent(question)
        const vector = embeddingResult.embedding.values

        // 2. Query Pinecone for similar vectors
        const index = pinecone.index(indexName)
        const queryResponse = await index.query({
            vector,
            topK: 5,
            namespace: 'documents', // 👈 IDENTIQUE
            includeMetadata: true,
        })
        console.log(
            '=======================Matches:',
            queryResponse.matches?.map(m => ({
                score: m.score,
                hasText: !!m.metadata?.text,
            }))
        )

        const matches = queryResponse.matches || []

        // 3. Extract text from metadata
        const contextDocs = matches
            .filter((match) => match.metadata && match.metadata.text)
            .map((match) => (match.metadata as { text: string }).text)

        // Check if we retrieved meaningful context
        if (contextDocs.length == 0) {
            return "I don’t have enough information in the knowledge base to answer this."
        }

        // Join the context chunks
        const contextText = contextDocs.join('\n\n---\n\n')
        console.log('contextText=======================', contextText)

        // 4. Construct the prompt for Gemini
        // Strict instruction to use ONLY the context
        const systemPrompt = `You are an AI assistant for a Retrieval-Augmented Generation (RAG) system.

You are given a CONTEXT extracted from documents stored in a knowledge base.

Your rules:
- Answer the USER QUESTION using ONLY the information from the CONTEXT.
- Do NOT use outside knowledge.
- Do NOT invent information.

Language detection:
- Detect the language of the USER QUESTION (English, French, Arabic or Moroccan Darija).
- Respond in the SAME language.

Fallback rule:
- If the USER QUESTION is NOT related to the CONTEXT at all,
  respond with a polite greeting in the detected language:

  • English:
    "Salam 🌙 Ramadan Kareem, how can I help you?"

  • French:
    "Salam 🌙 Ramadan Kareem, comment puis-je vous aider ?"

  • Moroccan Darija:
    "Salam 🌙 Ramadan Kareem 🌙 kifach n9der n3awnk ?"

Context:
${contextText}

User Question:
${question}

Answer:
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
