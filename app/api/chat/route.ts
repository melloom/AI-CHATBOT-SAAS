import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, botId } = await req.json()

    // TODO: Fetch chatbot configuration from database using botId
    // For now, we'll use a default configuration
    const systemPrompt = `You are a helpful AI customer support assistant. 
    You are friendly, professional, and knowledgeable about the company's products and services.
    Always try to be helpful and provide accurate information.
    If you don't know something, admit it and offer to connect the user with a human agent.`

    const result = streamText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
