const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, getDoc, updateDoc, query, where } = require('firebase/firestore');

// Initialize Firebase with your config
const firebaseConfig = {
  apiKey: "AIzaSyBvVQvVQvVQvVQvVQvVQvVQvVQvVQvVQvVQ",
  authDomain: "chathub-3f128.firebaseapp.com",
  projectId: "chathub-3f128",
  storageBucket: "chathub-3f128.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkAndFixAdminStatus() {
  try {
    console.log('🔍 Checking admin user status...');
    
    // Get all users
    const usersSnapshot = await getDocs(collection(db, "users"));
    console.log(`Found ${usersSnapshot.size} total users`);
    
    let adminCount = 0;
    let nonAdminCount = 0;
    let fixedCount = 0;
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const userId = userDoc.id;
      
      console.log(`\n👤 User: ${userData.email || 'No email'} (${userId})`);
      console.log(`   isAdmin: ${userData.isAdmin}`);
      console.log(`   isReadOnly: ${userData.isReadOnly}`);
      console.log(`   approvalStatus: ${userData.approvalStatus}`);
      
      // Check if this user should be an admin (you can customize this logic)
      const shouldBeAdmin = userData.email && (
        userData.email.includes('admin') ||
        userData.email.includes('melvin') ||
        userData.email.includes('greencasltegracie') ||
        userData.email.includes('marvelrivals')
      );
      
      if (shouldBeAdmin && !userData.isAdmin) {
        console.log(`   ⚠️  This user should be admin but isn't. Fixing...`);
        
        try {
          await updateDoc(doc(db, "users", userId), {
            isAdmin: true,
            isReadOnly: false,
            updatedAt: new Date().toISOString()
          });
          console.log(`   ✅ Fixed: Made user admin`);
          fixedCount++;
        } catch (error) {
          console.error(`   ❌ Error fixing admin status:`, error);
        }
      } else if (userData.isAdmin) {
        adminCount++;
        console.log(`   ✅ Already admin`);
      } else {
        nonAdminCount++;
        console.log(`   ℹ️  Regular user`);
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`   Total users: ${usersSnapshot.size}`);
    console.log(`   Admin users: ${adminCount}`);
    console.log(`   Regular users: ${nonAdminCount}`);
    console.log(`   Fixed users: ${fixedCount}`);
    
    if (fixedCount > 0) {
      console.log('\n🎉 Success! Admin users have been fixed.');
      console.log('💡 You should now be able to approve companies.');
    } else {
      console.log('\nℹ️  No changes needed. All admin users are properly configured.');
    }
    
  } catch (error) {
    console.error('💥 Error checking admin status:', error);
  }
}

// Run the function
checkAndFixAdminStatus(); 