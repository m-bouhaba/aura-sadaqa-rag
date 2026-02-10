
import { NextRequest, NextResponse } from 'next/server'
import { askAssistant } from '@/actions/chat-action'

export async function POST(req: NextRequest) {
    try {
        const { question } = await req.json()

        if (!question) {
            return NextResponse.json(
                { error: 'Question is required' },
                { status: 400 }
            )
        }

        const answer = await askAssistant(question)

        return NextResponse.json({ answer })

    } catch (error) {
        console.error('Error in chat API:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
