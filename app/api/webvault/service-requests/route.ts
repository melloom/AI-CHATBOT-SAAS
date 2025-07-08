import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serviceName, serviceDescription, serviceCategory, servicePrice, userId, userEmail, status = 'pending' } = body

    // Validate required fields
    if (!serviceName || !userId || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Add service request to Firestore
    const serviceRequest = {
      serviceName,
      serviceDescription,
      serviceCategory,
      servicePrice,
      userId,
      userEmail,
      status,
      submittedAt: Timestamp.now(),
      adminNotes: "",
      assignedTo: "",
      estimatedCompletion: "",
      priority: "normal"
    }

    const docRef = await addDoc(collection(db, "serviceRequests"), serviceRequest)

    return NextResponse.json({
      success: true,
      id: docRef.id,
      message: "Service request submitted successfully"
    })

  } catch (error) {
    console.error("Error submitting service request:", error)
    return NextResponse.json(
      { error: "Failed to submit service request" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")

    let q = query(collection(db, "serviceRequests"), orderBy("submittedAt", "desc"))

    if (userId) {
      q = query(q, where("userId", "==", userId))
    }

    if (status && status !== "all") {
      q = query(q, where("status", "==", status))
    }

    const querySnapshot = await getDocs(q)
    const serviceRequests = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({ serviceRequests })

  } catch (error) {
    console.error("Error fetching service requests:", error)
    return NextResponse.json(
      { error: "Failed to fetch service requests" },
      { status: 500 }
    )
  }
} 