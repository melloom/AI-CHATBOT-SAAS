const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, getDoc, updateDoc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCG4TaO69uN1nMGljSlVN0B4GDuozaVVhU",
  authDomain: "chathub-3f128.firebaseapp.com",
  projectId: "chathub-3f128",
  storageBucket: "chathub-3f128.firebasestorage.app",
  messagingSenderId: "168721489748",
  appId: "1:168721489748:web:4f056684784888480af2c1",
  measurementId: "G-JZ42R62B3Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function fixWebVaultAccount() {
  try {
    console.log("🔧 Fixing WebVault test account...");
    
    // Test account credentials
    const email = "webvault-test@example.com";
    const password = "test123456";
    
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    
    // Sign in to get the user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log(`✅ Signed in successfully with UID: ${user.uid}`);
    
    // Get current user profile
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      console.error("❌ User document not found!");
      return;
    }
    
    const userData = userDoc.data();
    console.log("📋 Current user data:", {
      email: userData.email,
      accountType: userData.accountType,
      approvalStatus: userData.approvalStatus,
      isAdmin: userData.isAdmin,
      platforms: userData.platforms
    });
    
    // Update user profile for WebVault account
    const updates = {
      accountType: 'business',
      approvalStatus: 'approved', // WebVault accounts should be auto-approved
      isAdmin: false, // Ensure not admin
      updatedAt: new Date().toISOString(),
      // Add company data for WebVault
      companyName: "WebVault Company",
      // Update platform access to be active
      platforms: {
        webvault: {
          access: true,
          status: 'active', // API checks for this field
          registeredAt: new Date().toISOString(),
          subscription: {
            plan: 'Free',
            status: 'active' // Should be active, not pending
          }
        }
      }
    };
    
    // Update the user document
    await updateDoc(userDocRef, updates);
    
    console.log("✅ WebVault account fixed successfully!");
    console.log("📋 Updated user data:", {
      accountType: 'business',
      approvalStatus: 'approved',
      isAdmin: false,
      companyName: 'WebVault Company',
      platformStatus: 'active'
    });
    
    console.log("\n🎯 Expected behavior after fix:");
    console.log("- Account type: business");
    console.log("- Approval status: approved");
    console.log("- WebVault access: active");
    console.log("- No admin privileges");
    console.log("- Can access WebVault dashboard");
    
  } catch (error) {
    console.error("❌ Error fixing WebVault account:", error);
    
    if (error.code === 'auth/user-not-found') {
      console.error("User not found. Please create the account first.");
    } else if (error.code === 'auth/wrong-password') {
      console.error("Wrong password. Please check the credentials.");
    } else if (error.code === 'auth/invalid-email') {
      console.error("Invalid email format.");
    }
  }
}

// Run the fix
fixWebVaultAccount()
  .then(() => {
    console.log("\n✅ WebVault account fix completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }); 