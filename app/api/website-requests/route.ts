import { NextRequest, NextResponse } from "next/server"
import { collection, addDoc, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { getAuth } from "firebase/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received website request body:', body)
    const {
      projectName,
      description,
      businessType,
      targetAudience,
      features,
      timeline,
      budget,
      contactEmail,
      phoneNumber,
      additionalNotes,
      projectType,
      priority,
      customFeatures,
      techStack,
      thirdPartyIntegrations,
      designPreferences
    } = body

    // Validate required fields
    if (!projectName || !description || !businessType || !contactEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get current user info (server-side safe)
    let userId = null
    let userName = null
    let userEmail = contactEmail
    // Optionally, you could extract user info from a token if you implement auth

    // Create the website request document
    const requestData = {
      projectName,
      description,
      businessType,
      targetAudience: targetAudience || "",
      features: features || [],
      timeline: timeline || "",
      budget: budget || "",
      contactEmail,
      phoneNumber: phoneNumber || "",
      additionalNotes: additionalNotes || "",
      projectType: projectType || "",
      priority: priority || "",
      customFeatures: customFeatures || "",
      techStack: techStack || "",
      thirdPartyIntegrations: thirdPartyIntegrations || "",
      designPreferences: designPreferences || "",
      status: "pending",
      submittedAt: Timestamp.now(),
      userId,
      userName,
      userEmail: contactEmail // Store the contact email as userEmail for fetching
    }

    // Add to Firestore
    const requestsRef = collection(db, "websiteRequests")
    const docRef = await addDoc(requestsRef, requestData)

    return NextResponse.json(
      { 
        success: true, 
        message: "Website request submitted successfully",
        requestId: docRef.id 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Error submitting website request:", error)
    return NextResponse.json(
      { error: "Failed to submit website request" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // This endpoint could be used to fetch requests (admin only)
    // For now, we'll return a simple response
    return NextResponse.json(
      { message: "Website requests API endpoint" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching website requests:", error)
    return NextResponse.json(
      { error: "Failed to fetch website requests" },
      { status: 500 }
    )
  }
} 