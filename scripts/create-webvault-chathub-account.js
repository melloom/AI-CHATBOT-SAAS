const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

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

async function createWebVaultChatHubAccount() {
  try {
    console.log("🔧 Creating WebVault + ChatHub test account...");
    
    // Test account credentials
    const email = "webvault-chathub@example.com";
    const password = "test123456";
    const platforms = ["webvault", "chathub"];
    
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`🌐 Platforms: ${platforms.join(', ')}`);
    
    // Create the user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log(`✅ User created with UID: ${user.uid}`);
    
    // Since user has WebVault access, they should be auto-approved
    const hasWebVault = platforms.includes('webvault');
    const accountType = 'business';
    const approvalStatus = 'approved'; // Auto-approved because they have WebVault access
    
    // Create user profile
    const userData = {
      email: email,
      accountType: accountType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      approvalStatus: approvalStatus,
      emailVerified: false,
      phoneVerified: false,
      twoFactorEnabled: false,
      twoFactorVerified: false,
      loginAttempts: 0,
      lastLoginAt: null,
      companyName: "WebVault + ChatHub Company",
      platforms: {}
    };
    
    // Add platform access for each platform (both should be active)
    platforms.forEach(platform => {
      userData.platforms[platform] = {
        access: true,
        registeredAt: new Date().toISOString(),
        subscription: {
          plan: 'Free',
          status: 'active' // Active status because user has WebVault access
        }
      };
    });
    
    // Save user data
    await setDoc(doc(db, "users", user.uid), userData);
    
    console.log("✅ WebVault + ChatHub account created successfully!");
    console.log("📋 User data:", {
      accountType: accountType,
      approvalStatus: approvalStatus,
      isAdmin: false,
      companyName: 'WebVault + ChatHub Company',
      platforms: Object.keys(userData.platforms).join(', ')
    });
    
    console.log("\n🎯 Expected behavior:");
    console.log("- Account type: business");
    console.log("- Approval status: approved (auto-approved due to WebVault access)");
    console.log("- WebVault access: active");
    console.log("- ChatHub access: active (auto-approved due to WebVault access)");
    console.log("- No admin privileges");
    console.log("- Can access both WebVault and ChatHub dashboards");
    console.log("- Should see platform switcher in sidebar");
    console.log("- No approval waiting screen");
    
  } catch (error) {
    console.error("❌ Error creating WebVault + ChatHub account:", error);
    
    if (error.code === 'auth/email-already-in-use') {
      console.error("Email already in use. Please use a different email or update the existing account.");
    } else if (error.code === 'auth/weak-password') {
      console.error("Password is too weak. Please choose a stronger password.");
    } else if (error.code === 'auth/invalid-email') {
      console.error("Invalid email format.");
    }
  }
}

// Run the creation
createWebVaultChatHubAccount().then(() => {
  console.log("\n✅ WebVault + ChatHub account creation complete!");
  process.exit(0);
}).catch((error) => {
  console.error("❌ Script failed:", error);
  process.exit(1);
}); 