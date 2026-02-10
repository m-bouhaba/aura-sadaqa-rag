
import { Pinecone } from '@pinecone-database/pinecone'
import fs from 'fs'
import path from 'path'

// Manually load .env without dependencies
function loadEnv() {
    try {
        const envPath = path.join(process.cwd(), '.env')
        console.log('Reading .env from:', envPath)
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8')
            content.split(/\r?\n/).forEach(line => { // Handle CRLF
                const trimmedLine = line.trim()
                if (!trimmedLine || trimmedLine.startsWith('#')) return

                const match = trimmedLine.match(/^([^=]+)=(.*)$/)
                if (match) {
                    const key = match[1].trim()
                    let value = match[2].trim()
                    // Unquote
                    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
                    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1)

                    process.env[key] = value
                    console.log(`Loaded key: ${key}`)
                }
            })
            console.log('.env loaded successfully.')
        } else {
            console.warn('.env file not found at:', envPath);
        }
    } catch (e) {
        console.warn('Could not load .env file:', e)
    }
}

loadEnv()

if (!process.env.PINECONE_API_KEY) {
    console.error('Error: PINECONE_API_KEY is not set in process.env')
    console.log('Available keys (partial):', Object.keys(process.env).filter(k => k.includes('PINECONE')))
    process.exit(1)
}

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
})

const indexName = process.env.PINECONE_INDEX_NAME || 'aura-sadaqa-index'

async function resetIndex() {
    console.log(`Checking Pinecone index: ${indexName}...`)

    try {
        const existingIndexes = await pinecone.listIndexes()
        const indexList = existingIndexes.indexes || existingIndexes || []

        // Check if index exists by name
        let indexExists = false;
        // Handle newer SDK returning objects or strings
        if (Array.isArray(indexList)) {
            indexExists = indexList.some((idx: any) => (idx.name === indexName || idx === indexName))
        } else {
            // Just in case it's not an array (some versions return object with property indexes)
            // But we handled that above.
        }

        if (indexExists) {
            console.log(`Deleting existing index "${indexName}"...`)
            await pinecone.deleteIndex(indexName)
            console.log('Index deleted successfully.')

            console.log('Waiting 10s for propagation...')
            await new Promise(resolve => setTimeout(resolve, 10000))
        } else {
            console.log(`Index "${indexName}" does not exist. Creating new one...`)
        }

        console.log(`Creating new index "${indexName}" with dimension 3072...`)

        await pinecone.createIndex({
            name: indexName,
            dimension: 3072,
            metric: 'cosine',
            spec: {
                serverless: {
                    cloud: 'aws',
                    region: 'us-east-1'
                }
            }
        })

        console.log(`Index "${indexName}" created successfully with dimension 3072.`)
        console.log('Please re-upload your documents to populate the new index.')

    } catch (error) {
        console.error('Error resetting Pinecone index:', error)
    }
}

resetIndex()
