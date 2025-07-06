import { NextRequest, NextResponse } from "next/server"
import { getUserChatbots, createChatbot, updateChatbot, deleteChatbot } from "@/lib/firebase"
import { verifyServerAuth, canWrite } from "@/lib/firebase-admin"

export async function GET() {
  try {
    const chatbots = await getUserChatbots()
    return NextResponse.json(chatbots)
  } catch (error: any) {
    console.error("Error fetching chatbots:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch chatbots" },
      { status: error.message?.includes("Access denied") ? 403 : 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication and check write permissions
    const decodedToken = await verifyServerAuth(request)
    const hasWritePermission = await canWrite(decodedToken.uid)
    
    if (!hasWritePermission) {
      return NextResponse.json(
        { error: "Unauthorized - Read-only access only. Cannot create chatbots." },
        { status: 403 }
      )
    }

    const data = await request.json()
    
    if (!data.name) {
      return NextResponse.json({ error: "Chatbot name is required" }, { status: 400 })
    }

    const chatbotId = await createChatbot(data)
    return NextResponse.json({ success: true, chatbotId })
  } catch (error: any) {
    console.error("Error creating chatbot:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create chatbot" },
      { status: error.message?.includes("Access denied") ? 403 : 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify authentication and check write permissions
    const decodedToken = await verifyServerAuth(request)
    const hasWritePermission = await canWrite(decodedToken.uid)
    
    if (!hasWritePermission) {
      return NextResponse.json(
        { error: "Unauthorized - Read-only access only. Cannot update chatbots." },
        { status: 403 }
      )
    }

    const { chatbotId, data } = await request.json()
    
    if (!chatbotId || !data) {
      return NextResponse.json({ error: "Chatbot ID and data are required" }, { status: 400 })
    }

    await updateChatbot(chatbotId, data)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error updating chatbot:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update chatbot" },
      { status: error.message?.includes("Access denied") ? 403 : 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication and check write permissions
    const decodedToken = await verifyServerAuth(request)
    const hasWritePermission = await canWrite(decodedToken.uid)
    
    if (!hasWritePermission) {
      return NextResponse.json(
        { error: "Unauthorized - Read-only access only. Cannot delete chatbots." },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const chatbotId = searchParams.get("chatbotId")
    
    if (!chatbotId) {
      return NextResponse.json({ error: "Chatbot ID is required" }, { status: 400 })
    }

    await deleteChatbot(chatbotId)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting chatbot:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete chatbot" },
      { status: error.message?.includes("Access denied") ? 403 : 500 }
    )
  }
} 