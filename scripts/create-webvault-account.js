const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, collection, addDoc, getDocs, query, where, updateDoc } = require('firebase/firestore');

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

async function createWebVaultAccount() {
  try {
    console.log("🔧 Creating new WebVault test account...");
    
    // Test account credentials
    const email = "webvault-test@example.com";
    const password = "test123456";
    
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    
    // Check if user already exists
    const usersRef = collection(db, "users")
    const q = query(usersRef, where("email", "==", email))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      console.log("⚠️ User already exists, updating existing account...");
      const existingUser = querySnapshot.docs[0];
      const userData = existingUser.data();
      
      // Update the existing user to have correct WebVault settings
      const updates = {
        accountType: 'business',
        approvalStatus: 'approved', // WebVault accounts should be auto-approved
        isAdmin: false,
        companyName: "WebVault Company",
        updatedAt: new Date().toISOString(),
        platforms: {
          webvault: {
            access: true,
            registeredAt: new Date().toISOString(),
            subscription: {
              plan: 'Free',
              status: 'active' // Should be active, not pending
            }
          }
        }
      };
      
      await updateDoc(doc(db, "users", existingUser.id), updates);
      
      console.log("✅ Existing WebVault account updated successfully!");
      console.log("📋 Updated user data:", {
        accountType: 'business',
        approvalStatus: 'approved',
        isAdmin: false,
        companyName: 'WebVault Company',
        platformStatus: 'active'
      });
      
      return;
    }
    
    // Create new user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log(`✅ User created with UID: ${user.uid}`);
    
    // WebVault accounts should be auto-approved (no approval needed)
    const userData = {
      email: email,
      accountType: 'business',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      approvalStatus: 'approved', // Auto-approved for WebVault
      emailVerified: false,
      phoneVerified: false,
      twoFactorEnabled: false,
      twoFactorVerified: false,
      loginAttempts: 0,
      lastLoginAt: null,
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
    
    // Save user data
    await setDoc(doc(db, "users", user.uid), userData);
    
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
    
    if (error.code === 'auth/email-already-in-use') {
      console.error("Email already in use. Please use a different email or update the existing account.");
    } else if (error.code === 'auth/weak-password') {
      console.error("Password is too weak. Please choose a stronger password.");
    } else if (error.code === 'auth/invalid-email') {
      console.error("Invalid email format.");
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