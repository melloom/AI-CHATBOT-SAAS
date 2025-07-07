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

async function addPlatformAccess(email, platforms) {
  try {
    console.log(`🔍 Adding platform access for: ${email}`);
    console.log(`🌐 Platforms: ${platforms.join(', ')}`);
    
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
      platforms: userData.platforms || {}
    });
    
    // Add platform access
    const updatedPlatforms = userData.platforms || {};
    
    platforms.forEach(platform => {
      updatedPlatforms[platform] = {
        access: true,
        registeredAt: new Date().toISOString(),
        subscription: {
          plan: 'Free',
          status: 'active'
        }
      };
    });
    
    // Update the user document
    await updateDoc(doc(db, "users", user.uid), {
      platforms: updatedPlatforms,
      updatedAt: new Date().toISOString()
    });
    
    console.log(`✅ Successfully added platform access!`);
    console.log(`📊 Updated platforms:`, updatedPlatforms);
    
    // Sign out
    await auth.signOut();
    console.log(`👋 Signed out`);
    
  } catch (error) {
    console.error("❌ Error adding platform access:", error);
  }
}

// Add all platforms to an existing account
const testEmail = "all-platforms@example.com"; // Use an existing account
const platformsToAdd = ["personal-ai", "webvault", "chathub"];

addPlatformAccess(testEmail, platformsToAdd).then(() => {
  console.log("\n✅ Platform access addition complete!");
  process.exit(0);
}).catch((error) => {
  console.error("❌ Script failed:", error);
  process.exit(1);
}); 