import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, adminNotes, assignedTo, estimatedCompletion } = body

    // Validate request ID
    if (!params.id) {
      return NextResponse.json(
        { error: "Service request ID is required" },
        { status: 400 }
      )
    }

    // Prepare update object
    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo
    if (estimatedCompletion !== undefined) updateData.estimatedCompletion = estimatedCompletion

    // Add timestamp for when the update was made
    updateData.updatedAt = new Date()

    // Update the service request in Firestore
    const serviceRequestRef = doc(db, "serviceRequests", params.id)
    await updateDoc(serviceRequestRef, updateData)

    return NextResponse.json({
      success: true,
      message: "Service request updated successfully"
    })

  } catch (error) {
    console.error("Error updating service request:", error)
    return NextResponse.json(
      { error: "Failed to update service request" },
      { status: 500 }
    )
  }
} 