const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
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

// Test account configurations
const testAccounts = [
  {
    email: "personal-ai-test2@example.com",
    password: "test123456",
    platforms: ["personal-ai"],
    description: "Personal AI only account"
  },
  {
    email: "webvault-test2@example.com", 
    password: "test123456",
    platforms: ["webvault"],
    description: "WebVault only account"
  },
  {
    email: "chathub-test2@example.com",
    password: "test123456", 
    platforms: ["chathub"],
    description: "ChatHub only account"
  },
  {
    email: "personal-webvault2@example.com",
    password: "test123456",
    platforms: ["personal-ai", "webvault"],
    description: "Personal AI + WebVault account"
  },
  {
    email: "personal-chathub2@example.com",
    password: "test123456",
    platforms: ["personal-ai", "chathub"],
    description: "Personal AI + ChatHub account"
  },
  {
    email: "webvault-chathub2@example.com",
    password: "test123456",
    platforms: ["webvault", "chathub"],
    description: "WebVault + ChatHub account"
  },
  {
    email: "all-platforms2@example.com",
    password: "test123456",
    platforms: ["personal-ai", "webvault", "chathub"],
    description: "All platforms account"
  }
];

async function createTestAccount(accountConfig) {
  try {
    console.log(`\n🔄 Creating account: ${accountConfig.description}`);
    console.log(`📧 Email: ${accountConfig.email}`);
    console.log(`🔑 Password: ${accountConfig.password}`);
    console.log(`🌐 Platforms: ${accountConfig.platforms.join(', ')}`);

    // Create the user account
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      accountConfig.email, 
      accountConfig.password
    );

    const user = userCredential.user;
    console.log(`✅ User created with UID: ${user.uid}`);

    // Determine account type and approval status based on platforms
    const isPersonalAI = accountConfig.platforms.includes('personal-ai');
    const hasWebVault = accountConfig.platforms.includes('webvault');
    const isWebVaultOnly = accountConfig.platforms.length === 1 && accountConfig.platforms.includes('webvault');
    const isChatHubOnly = accountConfig.platforms.length === 1 && accountConfig.platforms.includes('chathub');
    
    // Personal AI and accounts with WebVault access don't need approval
    const needsApproval = !isPersonalAI && !hasWebVault;
    const accountType = isPersonalAI ? 'personal' : 'business';

    // Create user profile
    const userData = {
      email: accountConfig.email,
      accountType: accountType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      approvalStatus: needsApproval ? 'pending' : 'approved',
      emailVerified: false,
      phoneVerified: false,
      twoFactorEnabled: false,
      twoFactorVerified: false,
      loginAttempts: 0,
      lastLoginAt: null,
      platforms: {}
    };

    // Add personal AI data if it's a personal account
    if (accountType === 'personal') {
      userData.personalAI = {
        assistants: [],
        preferences: {},
        subscription: {
          plan: 'Free',
          status: 'active'
        }
      };
    } else if (needsApproval) {
      // Only create company for accounts that need approval (ChatHub-only accounts)
      const companyRef = await addDoc(collection(db, "companies"), {
        companyName: `Test Company for ${accountConfig.email.split('@')[0]}`,
        email: accountConfig.email,
        userId: user.uid,
        approvalStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'pending',
        subscription: {
          plan: 'Free',
          status: 'pending'
        }
      });

      userData.companyName = `Test Company for ${accountConfig.email.split('@')[0]}`;
      userData.companyId = companyRef.id;
    }

    // Add platform access for each platform
    accountConfig.platforms.forEach(platform => {
      // If user has WebVault access, all platforms should be active
      const platformStatus = (hasWebVault || isPersonalAI) ? 'active' : (needsApproval ? 'pending' : 'active');
      
      userData.platforms[platform] = {
        access: true,
        registeredAt: new Date().toISOString(),
        subscription: {
          plan: 'Free',
          status: platformStatus
        }
      };
    });

    // Save user data
    await setDoc(doc(db, "users", user.uid), userData);

    console.log(`✅ User profile created with platforms: ${Object.keys(userData.platforms).join(', ')}`);
    console.log(`✅ Account type: ${accountType}`);
    console.log(`✅ Approval status: ${userData.approvalStatus}`);

    return {
      success: true,
      uid: user.uid,
      email: accountConfig.email,
      platforms: accountConfig.platforms,
      accountType: accountType
    };

  } catch (error) {
    console.error(`❌ Error creating account for ${accountConfig.email}:`, error.message);
    return {
      success: false,
      error: error.message,
      email: accountConfig.email
    };
  }
}

async function createAllTestAccounts() {
  console.log("🚀 Starting test account creation...");
  console.log("=" * 50);

  const results = [];

  for (const accountConfig of testAccounts) {
    const result = await createTestAccount(accountConfig);
    results.push(result);
    
    // Small delay between creations
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("\n" + "=" * 50);
  console.log("📊 Test Account Creation Summary:");
  console.log("=" * 50);

  results.forEach((result, index) => {
    if (result.success) {
      console.log(`✅ ${testAccounts[index].description}`);
      console.log(`   📧 ${result.email}`);
      console.log(`   🔑 Password: test123456`);
      console.log(`   🌐 Platforms: ${result.platforms.join(', ')}`);
      console.log(`   👤 Type: ${result.accountType}`);
      console.log(`   🆔 UID: ${result.uid}`);
    } else {
      console.log(`❌ ${testAccounts[index].description}`);
      console.log(`   📧 ${result.email}`);
      console.log(`   ❌ Error: ${result.error}`);
    }
    console.log("");
  });

  console.log("🎉 Test account creation completed!");
  console.log("\n📝 Next steps:");
  console.log("1. Update your Firebase config in this script");
  console.log("2. Run: node scripts/create-test-accounts.js");
  console.log("3. Test the accounts by logging in to your app");
}

// Run the script
createAllTestAccounts().catch(console.error); 