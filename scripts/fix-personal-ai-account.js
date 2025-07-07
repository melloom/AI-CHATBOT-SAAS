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

async function fixPersonalAIAccount() {
  try {
    console.log("🔧 Fixing Personal AI test account...");
    
    // Test account credentials
    const email = "personal-ai-test@example.com";
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
      companyName: userData.companyName,
      isAdmin: userData.isAdmin,
      platforms: userData.platforms
    });
    
    // Update user profile for Personal AI account
    const updates = {
      accountType: 'personal',
      companyName: null, // Remove company name for personal accounts
      isAdmin: false, // Ensure not admin
      updatedAt: new Date().toISOString(),
      // Add personal AI specific data
      personalAI: {
        assistants: [],
        preferences: {},
        subscription: {
          plan: 'Free',
          status: 'active'
        }
      }
    };
    
    // Update the user document
    await updateDoc(userDocRef, updates);
    
    console.log("✅ Personal AI account fixed successfully!");
    console.log("📋 Updated user data:", {
      accountType: 'personal',
      companyName: 'null (removed)',
      isAdmin: false,
      personalAI: 'added'
    });
    
    console.log("\n🎯 Expected behavior after fix:");
    console.log("- Account type: personal");
    console.log("- No company name displayed");
    console.log("- Personal AI navigation menu");
    console.log("- Access to Personal AI dashboard");
    console.log("- No admin privileges");
    
  } catch (error) {
    console.error("❌ Error fixing Personal AI account:", error);
    
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
fixPersonalAIAccount()
  .then(() => {
    console.log("\n✅ Personal AI account fix completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  }); 