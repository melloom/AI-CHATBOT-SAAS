const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, getDoc, updateDoc, setDoc } = require('firebase/firestore');

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

async function fixWebVaultChatHubAccount() {
  try {
    console.log("🔧 Fixing WebVault + ChatHub test account...");
    
    // Test account credentials
    const email = "webvault-chathub@example.com";
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
      console.log("⚠️ User document not found, creating new user profile...");
      
      // Create new user profile for WebVault + ChatHub account
      const userData = {
        email: email,
        accountType: 'business',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        approvalStatus: 'approved', // Auto-approved because they have WebVault access
        emailVerified: false,
        phoneVerified: false,
        twoFactorEnabled: false,
        twoFactorVerified: false,
        loginAttempts: 0,
        lastLoginAt: null,
        companyName: "WebVault + ChatHub Company",
        platforms: {
          webvault: {
            access: true,
            registeredAt: new Date().toISOString(),
            subscription: {
              plan: 'Free',
              status: 'active' // Active status for WebVault
            }
          },
          chathub: {
            access: true,
            registeredAt: new Date().toISOString(),
            subscription: {
              plan: 'Free',
              status: 'active' // Active status for ChatHub (auto-approved due to WebVault access)
            }
          }
        }
      };
      
      // Create the user document
      await setDoc(userDocRef, userData);
      
      console.log("✅ New user profile created successfully!");
      
    } else {
      console.log("📋 Current user data found, updating...");
      const userData = userDoc.data();
      console.log("📋 Current user data:", {
        email: userData.email,
        accountType: userData.accountType,
        approvalStatus: userData.approvalStatus,
        isAdmin: userData.isAdmin,
        platforms: userData.platforms
      });
      
      // Update user profile for WebVault + ChatHub account
      // Since user has WebVault access, they should be auto-approved
      const updates = {
        accountType: 'business',
        approvalStatus: 'approved', // Auto-approved because they have WebVault access
        isAdmin: false,
        updatedAt: new Date().toISOString(),
        companyName: "WebVault + ChatHub Company",
        // Update platform access - both should be active
        platforms: {
          webvault: {
            access: true,
            registeredAt: new Date().toISOString(),
            subscription: {
              plan: 'Free',
              status: 'active' // Active status for WebVault
            }
          },
          chathub: {
            access: true,
            registeredAt: new Date().toISOString(),
            subscription: {
              plan: 'Free',
              status: 'active' // Active status for ChatHub (auto-approved due to WebVault access)
            }
          }
        }
      };
      
      // Update the user document
      await updateDoc(userDocRef, updates);
      
      console.log("✅ Existing user profile updated successfully!");
    }
    
    console.log("✅ WebVault + ChatHub account fixed successfully!");
    console.log("📋 Updated user data:", {
      accountType: 'business',
      approvalStatus: 'approved',
      isAdmin: false,
      companyName: 'WebVault + ChatHub Company',
      platforms: 'webvault (active), chathub (active)'
    });
    
    console.log("\n🎯 Expected behavior after fix:");
    console.log("- Account type: business");
    console.log("- Approval status: approved (auto-approved due to WebVault access)");
    console.log("- WebVault access: active");
    console.log("- ChatHub access: active (auto-approved due to WebVault access)");
    console.log("- No admin privileges");
    console.log("- Can access both WebVault and ChatHub dashboards");
    console.log("- Should see platform switcher in sidebar");
    console.log("- No approval waiting screen");
    
  } catch (error) {
    console.error("❌ Error fixing WebVault + ChatHub account:", error);
    
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
fixWebVaultChatHubAccount().then(() => {
  console.log("\n✅ WebVault + ChatHub account fix complete!");
  process.exit(0);
}).catch((error) => {
  console.error("❌ Script failed:", error);
  process.exit(1);
}); 