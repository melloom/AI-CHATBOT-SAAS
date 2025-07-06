import { NextRequest, NextResponse } from 'next/server'
import { getAdminDb, verifyServerAuth } from '@/lib/firebase-admin'
import { z } from 'zod'

// Validation schema for payment test
const paymentTestSchema = z.object({
  paymentProvider: z.string().min(1, "Payment provider is required"),
  currency: z.string().min(1, "Currency is required"),
  stripePublishableKey: z.string().optional(),
  stripeSecretKey: z.string().optional(),
  paypalClientId: z.string().optional(),
  paypalSecret: z.string().optional(),
  taxRate: z.number().min(0).max(100, "Tax rate must be between 0 and 100"),
})

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const decodedToken = await verifyServerAuth(request)
    const db = getAdminDb()
    
    // Check if user exists and is admin
    const userDoc = await db.collection('users').doc(decodedToken.uid).get()
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    const userData = userDoc.data()
    if (!userData?.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate request body
    const validationResult = paymentTestSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      )
    }

    const paymentSettings = validationResult.data

    // Validate payment provider
    const validPaymentProviders = ['Stripe', 'PayPal', 'Square', 'Custom']
    if (!validPaymentProviders.includes(paymentSettings.paymentProvider)) {
      return NextResponse.json(
        { error: 'Invalid payment provider selected' },
        { status: 400 }
      )
    }

    // Validate currency
    const validCurrencies = ['USD ($)', 'EUR (€)', 'GBP (£)', 'CAD (C$)', 'AUD (A$)']
    if (!validCurrencies.includes(paymentSettings.currency)) {
      return NextResponse.json(
        { error: 'Invalid currency selected' },
        { status: 400 }
      )
    }

    // Simulate payment test (in a real implementation, you would actually test the payment gateway)
    const testResult = await simulatePaymentTest(paymentSettings)

    if (testResult.success) {
      // Log the successful test
      await db.collection('auditLogs').add({
        action: 'payment_configuration_tested',
        userId: decodedToken.uid,
        userEmail: userData.email,
        timestamp: new Date().toISOString(),
        testResult: testResult,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      })

      return NextResponse.json({
        success: true,
        message: 'Payment configuration test successful',
        details: testResult
      })
    } else {
      return NextResponse.json(
        { 
          error: 'Payment configuration test failed',
          details: testResult.error 
        },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error testing payment configuration:', error)
    return NextResponse.json(
      { error: 'Failed to test payment configuration' },
      { status: 500 }
    )
  }
}

async function simulatePaymentTest(paymentSettings: any) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Validate payment settings based on provider
  switch (paymentSettings.paymentProvider) {
    case 'Stripe':
      if (!paymentSettings.stripePublishableKey || !paymentSettings.stripeSecretKey) {
        return {
          success: false,
          error: 'Stripe publishable key and secret key are required'
        }
      }
      
      if (!paymentSettings.stripePublishableKey.startsWith('pk_')) {
        return {
          success: false,
          error: 'Invalid Stripe publishable key format'
        }
      }
      
      if (!paymentSettings.stripeSecretKey.startsWith('sk_')) {
        return {
          success: false,
          error: 'Invalid Stripe secret key format'
        }
      }
      break
      
    case 'PayPal':
      if (!paymentSettings.paypalClientId || !paymentSettings.paypalSecret) {
        return {
          success: false,
          error: 'PayPal Client ID and Secret are required'
        }
      }
      
      if (paymentSettings.paypalClientId.length < 10) {
        return {
          success: false,
          error: 'PayPal Client ID must be at least 10 characters long'
        }
      }
      break
      
    case 'Square':
      // Square would require application ID and access token
      if (!paymentSettings.stripeSecretKey) {
        return {
          success: false,
          error: 'Square access token is required'
        }
      }
      break
      
    case 'Custom':
      // For custom payment providers, we would need custom configuration
      if (!paymentSettings.stripeSecretKey) {
        return {
          success: false,
          error: 'Custom payment provider credentials are required'
        }
      }
      break
      
    default:
      return {
        success: false,
        error: 'Unsupported payment provider'
      }
  }

  // Simulate successful payment test
  const testAmount = 1.00 // $1.00 test transaction
  const taxAmount = testAmount * (paymentSettings.taxRate / 100)
  const totalAmount = testAmount + taxAmount

  return {
    success: true,
    message: `Test payment processed successfully via ${paymentSettings.paymentProvider}`,
    provider: paymentSettings.paymentProvider,
    currency: paymentSettings.currency,
    testAmount: testAmount,
    taxRate: paymentSettings.taxRate,
    taxAmount: taxAmount,
    totalAmount: totalAmount,
    transactionId: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString()
  }
} 