'use server'

import { pinecone, indexName } from '@/lib/pinecone'
import { GoogleGenerativeAI } from '@google/generative-ai'
import * as XLSX from 'xlsx'
// import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'

// Gemini Embeddings
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' })

async function generateEmbedding(text: string): Promise<number[]> {
  const res = await model.embedContent(text)
  return res.embedding.values
}

function chunkText(text: string, size = 500): string[] {
  const chunks: string[] = []
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size))
  }
  return chunks
}

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) return { success: false, message: 'No file' }

  const buffer = Buffer.from(await file.arrayBuffer())
  let text = ''

  // ===== PDF =====
  //   if (file.type === 'application/pdf') {
  //     const pdf = await pdfjs.getDocument({ data: buffer }).promise
  //     for (let i = 1; i <= pdf.numPages; i++) {
  //       const page = await pdf.getPage(i)
  //       const content = await page.getTextContent()
  //       const strings = content.items.map((it: any) => it.str)
  //       text += strings.join(' ') + '\n'
  //     }
  //   }

  // ===== XLSX =====
  if (file.name.endsWith('.xlsx')) {
    const wb = XLSX.read(buffer, { type: 'buffer' })
    wb.SheetNames.forEach(name => {
      const sheet = wb.Sheets[name]
      // Smart parsing: Convert to JSON to preserve header-value relationships
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" }) as Record<string, any>[]

      if (rows.length > 0) {
        text += `--- Sheet: ${name} ---\n`
        rows.forEach((row, index) => {
          // Convert row object to a readable string: "Name: Ahmed, Age: 30..."
          const rowText = Object.entries(row)
            .filter(([_, val]) => val !== "") // Skip empty cells
            .map(([header, val]) => `${header}: ${val}`)
            .join(", ")
          text += `Row ${index + 1}: ${rowText}\n`
        })
      }
    })
  } else {
    return { success: false, message: 'Unsupported file type' }
  }

  text = text.replace(/\s+/g, ' ').trim()
  if (!text) return { success: false, message: 'No text extracted' }

  const chunks = chunkText(text)
  const index = pinecone.index(indexName)

  for (let i = 0; i < chunks.length; i++) {
    const embedding = await generateEmbedding(chunks[i])
    await index.upsert({
      namespace: 'documents', // 👈 AJOUT CRUCIAL
      records: [
        {
          id: `${file.name}-${i}-${Date.now()}`,
          values: embedding,
          metadata: {
            file: file.name,
            chunk: i,
            text: chunks[i],
          },
        },
      ],
    })
  }

  return { success: true, chunks: chunks.length }
}
