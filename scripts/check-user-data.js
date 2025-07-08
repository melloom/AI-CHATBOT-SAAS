const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, getDoc, collection, getDocs, query, where } = require('firebase/firestore');

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

async function checkUserData() {
  try {
    console.log("🔍 Checking user data in Firebase...");
    
    // Check all users
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);
    
    console.log(`\n📊 Found ${usersSnapshot.size} users:`);
    
    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`\n👤 User: ${data.email || 'No email'}`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   Company: ${data.companyName || 'No company'}`);
      console.log(`   Account Type: ${data.accountType || 'Not set'}`);
      console.log(`   Is Admin: ${data.isAdmin || false}`);
      console.log(`   Approval Status: ${data.approvalStatus || 'Not set'}`);
      console.log(`   Platforms: ${JSON.stringify(data.platforms || {}, null, 2)}`);
      
      // Check if this is an all-platforms account
      const platforms = data.platforms || {};
      const platformCount = Object.keys(platforms).filter(key => platforms[key]?.access).length;
      console.log(`   Platform Count: ${platformCount}`);
      
      if (platformCount >= 3) {
        console.log(`   ✅ This appears to be an all-platforms account!`);
      }
    });
    
    // Check all companies
    console.log(`\n🏢 Checking companies...`);
    const companiesRef = collection(db, "companies");
    const companiesSnapshot = await getDocs(companiesRef);
    
    console.log(`\n📊 Found ${companiesSnapshot.size} companies:`);
    
    companiesSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`\n🏢 Company: ${data.companyName || 'No name'}`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   Email: ${data.email || 'No email'}`);
      console.log(`   Status: ${data.status || 'Not set'}`);
      console.log(`   Approval Status: ${data.approvalStatus || 'Not set'}`);
    });
    
  } catch (error) {
    console.error("❌ Error checking user data:", error);
  }
}

// Run the check
checkUserData().then(() => {
  console.log("\n✅ User data check complete!");
  process.exit(0);
}).catch((error) => {
  console.error("❌ Script failed:", error);
  process.exit(1);
}); 