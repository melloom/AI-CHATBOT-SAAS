const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, addDoc, updateDoc, doc, query, where } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixOrphanedUsers() {
  try {
    console.log('🔍 Starting orphaned user fix process...');
    
    // Get all users
    const usersSnapshot = await getDocs(collection(db, "users"));
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    console.log(`📊 Found ${users.length} total users`);
    
    // Get all companies
    const companiesSnapshot = await getDocs(collection(db, "companies"));
    const companies = companiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    console.log(`🏢 Found ${companies.length} total companies`);
    
    // Find orphaned users (users without companies)
    const orphanedUsers = users.filter((user) => {
      return !companies.some((company) => company.userId === user.id);
    });
    
    console.log(`⚠️  Found ${orphanedUsers.length} orphaned users`);
    
    if (orphanedUsers.length === 0) {
      console.log('✅ No orphaned users found! All users have companies.');
      return;
    }
    
    // Create companies for orphaned users
    let createdCount = 0;
    let errorCount = 0;
    
    for (const user of orphanedUsers) {
      try {
        console.log(`🔄 Processing user: ${user.email} (${user.id})`);
        
        // Create company data
        const companyData = {
          companyName: user.companyName || `Company for ${user.email?.split('@')[0] || 'User'}`,
          email: user.email,
          userId: user.id,
          approvalStatus: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'pending',
          subscription: {
            plan: 'Free',
            status: 'pending'
          }
        };
        
        // Create company document
        const companyRef = await addDoc(collection(db, "companies"), companyData);
        
        // Update user with company ID
        await updateDoc(doc(db, "users", user.id), {
          companyId: companyRef.id,
          approvalStatus: 'pending'
        });
        
        console.log(`✅ Created company for ${user.email} (Company ID: ${companyRef.id})`);
        createdCount++;
        
      } catch (error) {
        console.error(`❌ Error creating company for ${user.email}:`, error);
        errorCount++;
      }
    }
    
    console.log('\n📈 Summary:');
    console.log(`✅ Successfully created companies for ${createdCount} users`);
    console.log(`❌ Failed to create companies for ${errorCount} users`);
    console.log(`📊 Total orphaned users processed: ${orphanedUsers.length}`);
    
    if (createdCount > 0) {
      console.log('\n🎉 Success! Users now have companies and can be approved.');
      console.log('💡 Check the admin approval page to approve these users.');
    }
    
  } catch (error) {
    console.error('💥 Script failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  console.log('🚀 Starting orphaned user fix script...\n');
  fixOrphanedUsers()
    .then(() => {
      console.log('\n✅ Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { fixOrphanedUsers }; 