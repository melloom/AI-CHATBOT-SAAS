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

async function fixAllPlatformsAccount(email) {
  try {
    console.log(`🔧 Fixing all-platforms account: ${email}`);
    
    // First, sign in to get the user
    const userCredential = await signInWithEmailAndPassword(auth, email, 'test123456');
    const user = userCredential.user;
    
    console.log(`✅ Signed in as: ${user.email}`);
    
    // Get the user document
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
      console.log("❌ User document not found");
      return;
    }
    
    const userData = userDoc.data();
    console.log(`📄 Current user data:`, {
      email: userData.email,
      companyName: userData.companyName,
      accountType: userData.accountType,
      platforms: userData.platforms || {}
    });
    
    // Fix the user data
    const updatedUserData = {
      ...userData,
      companyName: "All Platforms Company", // Add company name
      accountType: "business", // Ensure it's a business account
      approvalStatus: "approved", // Ensure it's approved
      isAdmin: false, // Ensure it's NOT an admin account
      updatedAt: new Date().toISOString()
    };
    
    // Update the user document
    await updateDoc(doc(db, "users", user.uid), updatedUserData);
    
    console.log(`✅ Successfully fixed all-platforms account!`);
    console.log(`📊 Updated user data:`, {
      email: updatedUserData.email,
      companyName: updatedUserData.companyName,
      accountType: updatedUserData.accountType,
      approvalStatus: updatedUserData.approvalStatus,
      platforms: updatedUserData.platforms
    });
    
    // Sign out
    await auth.signOut();
    console.log(`👋 Signed out`);
    
  } catch (error) {
    console.error("❌ Error fixing all-platforms account:", error);
  }
}

// Fix the all-platforms account
const testEmail = "all-platforms@example.com";

fixAllPlatformsAccount(testEmail).then(() => {
  console.log("\n✅ All-platforms account fix complete!");
  process.exit(0);
}).catch((error) => {
  console.error("❌ Script failed:", error);
  process.exit(1);
}); 