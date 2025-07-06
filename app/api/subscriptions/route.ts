import { NextRequest, NextResponse } from "next/server"
import { getUserSubscription, createOrUpdateSubscription } from "@/lib/firebase"

export async function GET() {
  try {
    const subscription = await getUserSubscription()
    return NextResponse.json(subscription)
  } catch (error: any) {
    console.error("Error fetching subscription:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch subscription" },
      { status: error.message?.includes("Access denied") ? 403 : 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    if (!data.plan) {
      return NextResponse.json({ error: "Plan is required" }, { status: 400 })
    }

    await createOrUpdateSubscription(data)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error updating subscription:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update subscription" },
      { status: error.message?.includes("Access denied") ? 403 : 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    
    if (!data.plan) {
      return NextResponse.json({ error: "Plan is required" }, { status: 400 })
    }

    await createOrUpdateSubscription(data)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error updating subscription:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update subscription" },
      { status: error.message?.includes("Access denied") ? 403 : 500 }
    )
  }
} 