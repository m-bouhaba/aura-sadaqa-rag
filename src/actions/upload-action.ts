'use server'

import { pinecone, indexName } from '@/lib/pinecone'
import { GoogleGenerativeAI } from '@google/generative-ai'
import * as XLSX from 'xlsx'
import pdf from 'pdf-parse'

// =====================
// Gemini Embeddings
// =====================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const embeddingModel = genAI.getGenerativeModel({
  model: 'gemini-embedding-001',
})

// =====================
// Helpers
// =====================
async function generateEmbedding(text: string): Promise<number[]> {
  const res = await embeddingModel.embedContent(text)
  return res.embedding.values
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

function chunkText(
  text: string,
  size = 1000,
  overlap = 150
): string[] {
  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = start + size
    chunks.push(text.slice(start, end))
    start = end - overlap
  }

  return chunks
}

// =====================
// Main Action
// =====================
export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get('file') as File
    if (!file) {
      return { success: false, message: 'No file provided' }
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    let text = ''

    // =====================
    // PDF Parsing
    // =====================
    if (file.type === 'application/pdf') {
      const buffer = Buffer.from(await file.arrayBuffer())
      const data = await pdf(buffer) // ✅ parse directement le buffer
      text = data.text
    }

    // =====================
    // XLSX Parsing
    // =====================
    else if (file.name.endsWith('.xlsx')) {
      const wb = XLSX.read(buffer, { type: 'buffer' })

      wb.SheetNames.forEach((sheetName) => {
        const sheet = wb.Sheets[sheetName]
        const rows = XLSX.utils.sheet_to_json(sheet, {
          defval: '',
        }) as Record<string, any>[]

        if (rows.length > 0) {
          text += `--- Sheet: ${sheetName} ---\n`

          rows.forEach((row, index) => {
            const rowText = Object.entries(row)
              .filter(([_, val]) => val !== '')
              .map(([key, val]) => `${key}: ${val}`)
              .join(', ')

            if (rowText) {
              text += `Row ${index + 1}: ${rowText}\n`
            }
          })
        }
      })
    }

    // =====================
    // Unsupported type
    // =====================
    else {
      return {
        success: false,
        message: 'Unsupported file type (PDF or XLSX only)',
      }
    }

    // =====================
    // Text cleanup
    // =====================
    text = cleanText(text)
    if (!text) {
      return { success: false, message: 'No text extracted' }
    }

    // =====================
    // Chunking
    // =====================
    const chunks = chunkText(text)

    // =====================
    // Embeddings (PARALLEL)
    // =====================
    const embeddings = await Promise.all(
      chunks.map(async (chunk) => ({
        text: chunk,
        embedding: await generateEmbedding(chunk),
      }))
    )

    // =====================
    // Pinecone Batch Upsert
    // =====================
    const index = pinecone.index(indexName)

    await index.upsert({
      namespace: 'documents',
      records: embeddings.map((item, i) => ({
        id: `${file.name}-${i}-${Date.now()}`,
        values: item.embedding,
        metadata: {
          file: file.name,
          chunk: i,
          text: item.text,
        },
      })),
    })

    // =====================
    // Success
    // =====================
    return {
      success: true,
      file: file.name,
      chunks: chunks.length,
    }
  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      message: 'Error while processing the file',
    }
  }
}
