// AI Response Generation API

import { NextRequest, NextResponse } from 'next/server'
import { generateAIResponse } from '@/lib/ai/response-generator'
import type { AIResponseRequest } from '@/types/instagram'

export async function POST(request: NextRequest) {
  try {
    const body: AIResponseRequest = await request.json()

    if (!body.message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const response = await generateAIResponse(body)

    return NextResponse.json(response, { status: 200 })
  } catch (error: any) {
    console.error('AI response generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}

