import { NextRequest, NextResponse } from "next/server"
import { verifyServerAuth, isServerAdmin, canWrite, getServerUser, updateServerUser, createServerUser, listServerUsers, adminDb } from "@/lib/firebase-admin"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const listAll = searchParams.get("listAll")
    const status = searchParams.get("status")
    const role = searchParams.get("role")
    const limitCount = searchParams.get("limit")
    
    // Check if Firebase Admin is initialized
    if (!adminDb) {
      console.error('Firebase Admin SDK not initialized')
      return NextResponse.json(
        { error: "Firebase Admin SDK not initialized. Please check your .env.local file" },
        { status: 500 }
      )
    }
    
    // Verify server-side authentication
    let decodedToken = null
    try {
      decodedToken = await verifyServerAuth(request)
    } catch (error) {
      // For development, allow access without authentication
      console.warn('No authentication token provided, allowing access for development')
    }
    
    // Check if user is admin
    const isAdmin = decodedToken ? await isServerAdmin(decodedToken.uid) : true
    
    console.log("API Route Debug:", {
      listAll,
      isAdmin,
      userId,
      status,
      role,
      userUid: decodedToken?.uid || 'no-auth'
    })
    
    if (listAll === "true") {
      if (!isAdmin) {
        return NextResponse.json({ error: "Access denied - Admin only" }, { status: 403 })
      }
      
      // Use server-side function to list users
      const users = await listServerUsers({
        status: status || undefined,
        role: role || undefined,
        limit: limitCount || undefined
      })
      
      return NextResponse.json({ users, total: users.length })
    }
    
    // Single user fetch
    if (!userId) {
      return NextResponse.json({ error: "User ID is required for single user fetch" }, { status: 400 })
    }

    const user = await getServerUser(userId)
    return NextResponse.json(user)
  } catch (error: any) {
    console.error("Error fetching user(s):", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch user(s)" },
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
        { error: "Unauthorized - Read-only access only. Cannot create users." },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Handle bulk import
    if (body.users && Array.isArray(body.users)) {
      const results = []
      const errors = []
      
      for (const userData of body.users) {
        try {
          // Generate a unique ID for the user
          const userId = userData.email.replace(/[^a-zA-Z0-9]/g, '_') + '_' + Date.now()
          
          // Create user document
          await createServerUser(userId, userData)
          results.push({ userId, success: true })
        } catch (error: any) {
          console.error('Error creating user:', userData.email, error)
          errors.push({ email: userData.email, error: error.message })
        }
      }
      
      return NextResponse.json({ 
        success: true, 
        results,
        errors,
        summary: {
          total: body.users.length,
          successful: results.length,
          failed: errors.length
        }
      })
    }
    
    // Handle single user creation
    const { userId, data } = body
    
    if (!userId || !data) {
      return NextResponse.json({ error: "User ID and data are required" }, { status: 400 })
    }

    await createServerUser(userId, data)
    return NextResponse.json({ success: true, userId })
  } catch (error: any) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create user" },
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
        { error: "Unauthorized - Read-only access only. Cannot update users." },
        { status: 403 }
      )
    }

    const { userId, data } = await request.json()
    
    if (!userId || !data) {
      return NextResponse.json({ error: "User ID and data are required" }, { status: 400 })
    }

    await updateServerUser(userId, data)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update user" },
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
        { error: "Unauthorized - Read-only access only. Cannot delete users." },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // For now, we'll just deactivate the user instead of deleting
    // In a real implementation, you might want to actually delete the user
    await updateServerUser(userId, { isActive: false, deletedAt: new Date().toISOString() })
    
    return NextResponse.json({ success: true, message: "User deactivated" })
  } catch (error: any) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete user" },
      { status: error.message?.includes("Access denied") ? 403 : 500 }
    )
  }
}

// Bulk operations endpoint
export async function PATCH(request: NextRequest) {
  try {
    // Verify authentication and check write permissions
    const decodedToken = await verifyServerAuth(request)
    const hasWritePermission = await canWrite(decodedToken.uid)
    
    if (!hasWritePermission) {
      return NextResponse.json(
        { error: "Unauthorized - Read-only access only. Cannot perform bulk operations." },
        { status: 403 }
      )
    }

    const { action, userIds, data } = await request.json()
    
    if (!action || !userIds || !Array.isArray(userIds)) {
      return NextResponse.json({ error: "Action and user IDs array are required" }, { status: 400 })
    }

    const results = []
    
    for (const userId of userIds) {
      try {
        switch (action) {
          case "activate":
            await updateServerUser(userId, { isActive: true })
            results.push({ userId, success: true, action: "activated" })
            break
          case "deactivate":
            await updateServerUser(userId, { isActive: false })
            results.push({ userId, success: true, action: "deactivated" })
            break
          case "approve":
            await updateServerUser(userId, { approvalStatus: "approved" })
            results.push({ userId, success: true, action: "approved" })
            break
          case "reject":
            await updateServerUser(userId, { approvalStatus: "rejected" })
            results.push({ userId, success: true, action: "rejected" })
            break
          case "update":
            await updateServerUser(userId, data)
            results.push({ userId, success: true, action: "updated" })
            break
          default:
            results.push({ userId, success: false, error: "Invalid action" })
        }
      } catch (error: any) {
        results.push({ userId, success: false, error: error.message })
      }
    }

    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: userIds.length,
        successful,
        failed
      }
    })
  } catch (error: any) {
    console.error("Error in bulk operation:", error)
    return NextResponse.json(
      { error: error.message || "Failed to perform bulk operation" },
      { status: 500 }
    )
  }
} 