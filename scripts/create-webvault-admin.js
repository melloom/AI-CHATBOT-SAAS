const admin = require('firebase-admin');

// Test account credentials (move to top for catch block access)
const email = "webvault-test@example.com";
const password = "test123456";

// Initialize Firebase Admin SDK
// TODO: Insert your service account credentials securely (do NOT commit secrets)
const serviceAccount = require('./path/to/your-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'chathub-3f128'
  });
}

const db = admin.firestore();

async function createWebVaultAccount() {
  try {
    console.log("🔧 Creating WebVault test account with Admin SDK...");
    
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    
    // Create the user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: "WebVault Test User"
    });
    
    console.log(`✅ User created in Auth with UID: ${userRecord.uid}`);
    
    // Create user document in Firestore
    const userData = {
      email: email,
      accountType: 'business',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      approvalStatus: 'approved', // WebVault accounts should be auto-approved
      emailVerified: false,
      phoneVerified: false,
      twoFactorEnabled: false,
      twoFactorVerified: false,
      loginAttempts: 0,
      lastLoginAt: null,
      isAdmin: false,
      companyName: "WebVault Company",
      platforms: {
        webvault: {
          access: true,
          registeredAt: new Date().toISOString(),
          subscription: {
            plan: 'Free',
            status: 'active' // Active status for WebVault
          }
        }
      }
    };
    
    // Save user data to Firestore
    await db.collection('users').doc(userRecord.uid).set(userData);
    
    console.log("✅ WebVault account created successfully!");
    console.log("📋 User data:", {
      accountType: 'business',
      approvalStatus: 'approved',
      isAdmin: false,
      companyName: 'WebVault Company',
      platformStatus: 'active'
    });
    
    console.log("\n🎯 Expected behavior:");
    console.log("- Account type: business");
    console.log("- Approval status: approved");
    console.log("- WebVault access: active");
    console.log("- No admin privileges");
    console.log("- Can access WebVault dashboard immediately");
    
  } catch (error) {
    console.error("❌ Error creating WebVault account:", error);
    
    if (error.code === 'auth/email-already-exists' || error.code === 'auth/email-already-in-use') {
      console.log("⚠️ User already exists in Auth, updating Firestore document...");
      
      try {
        // Get the existing user
        const userRecord = await admin.auth().getUserByEmail(email);
        
        // Update the Firestore document
        const userData = {
          email: email,
          accountType: 'business',
          updatedAt: new Date().toISOString(),
          approvalStatus: 'approved',
          isAdmin: false,
          companyName: "WebVault Company",
          platforms: {
            webvault: {
              access: true,
              registeredAt: new Date().toISOString(),
              subscription: {
                plan: 'Free',
                status: 'active'
              }
            }
          }
        };
        
        await db.collection('users').doc(userRecord.uid).set(userData, { merge: true });
        
        console.log("✅ Existing WebVault account updated successfully!");
        console.log("📋 Updated user data:", {
          accountType: 'business',
          approvalStatus: 'approved',
          isAdmin: false,
          companyName: 'WebVault Company',
          platformStatus: 'active'
        });
      } catch (updateError) {
        console.error("❌ Error updating existing user:", updateError);
      }
    }
  }
}

// Run the script
createWebVaultAccount()
  .then(() => {
    console.log("\n✅ WebVault account creation completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }); 