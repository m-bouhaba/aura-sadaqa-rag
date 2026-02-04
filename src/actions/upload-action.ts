'use server'

import { pinecone, indexName } from '@/lib/pinecone'
import { GoogleGenerativeAI } from '@google/generative-ai'
import pdf from 'pdf-parse'
import * as XLSX from 'xlsx'

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'text-embedding-004' })

async function generateEmbeddings(text: string): Promise<number[]> {
    const result = await model.embedContent(text)
    const embedding = result.embedding
    return embedding.values
}

// Chunking utility
function chunkText(text: string, chunkSize: number = 500): string[] {
    const chunks: string[] = []
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.slice(i, i + chunkSize))
    }
    return chunks
}

export async function uploadFile(formData: FormData) {
    try {
        const file = formData.get('file') as File
        if (!file) {
            return { success: false, message: 'No file provided' }
        }

        console.log(`Processing file: ${file.name} (${file.type})`)

        const buffer = Buffer.from(await file.arrayBuffer())
        let textContent = ''

        // Parse based on file type
        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
            const data = await pdf(buffer)
            textContent = data.text
        } else if (
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.name.endsWith('.xlsx')
        ) {
            const workbook = XLSX.read(buffer, { type: 'buffer' })
            workbook.SheetNames.forEach(sheetName => {
                const sheet = workbook.Sheets[sheetName]
                textContent += XLSX.utils.sheet_to_txt(sheet) + '\n'
            })
        } else {
            return { success: false, message: 'Unsupported file type. Only PDF and XLSX are supported.' }
        }

        // Clean text
        textContent = textContent.replace(/\s+/g, ' ').trim()

        if (!textContent) {
            return { success: false, message: 'Could not extract text from file.' }
        }

        // Generate chunks and embeddings
        const chunks = chunkText(textContent)
        const vectors = []

        console.log(`Generated ${chunks.length} chunks. Generating embeddings...`)

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i]
            const embedding = await generateEmbeddings(chunk)

            vectors.push({
                id: `${file.name}-${i}-${Date.now()}`,
                values: embedding,
                metadata: {
                    fileName: file.name,
                    fileType: file.type,
                    chunkIndex: i,
                    text: chunk, // Storing text in metadata for retrieval context
                    uploadDate: new Date().toISOString()
                }
            })
        }

        // Upsert to Pinecone
        const index = pinecone.index(indexName)

        // Upsert in batches of 100
        const batchSize = 100
        for (let i = 0; i < vectors.length; i += batchSize) {
            const batch = vectors.slice(i, i + batchSize)
            await index.upsert(batch)
        }

        console.log(`Successfully ingested ${vectors.length} vectors for ${file.name}`)

        return {
            success: true,
            message: 'File processed and ingested successfully',
            fileName: file.name,
            fileType: file.type,
            size: file.size
        }

    } catch (error) {
        console.error('Processing error:', error)
        return { success: false, message: 'Failed to process file' }
    }
}
