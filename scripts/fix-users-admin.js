const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });
}

const db = admin.firestore();

async function fixUsersWithAdmin() {
  const startTime = new Date();
  console.log(`🚀 Admin SDK - Auto-fix users script started at ${startTime.toISOString()}`);
  
  try {
    // Get all users
    const usersSnapshot = await db.collection("users").get();
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    console.log(`📊 Found ${users.length} total users`);
    
    // Get all companies
    const companiesSnapshot = await db.collection("companies").get();
    const companies = companiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    console.log(`🏢 Found ${companies.length} total companies`);
    
    // Find orphaned users (users without companies)
    const orphanedUsers = users.filter((user) => {
      return !companies.some((company) => company.userId === user.id);
    });
    
    console.log(`⚠️  Found ${orphanedUsers.length} orphaned users`);
    
    // Find users with pending status but no company
    const pendingUsersWithoutCompanies = users.filter((user) => {
      const hasCompany = companies.some((company) => company.userId === user.id);
      return user.approvalStatus === 'pending' && !hasCompany;
    });
    
    console.log(`⏳ Found ${pendingUsersWithoutCompanies.length} pending users without companies`);
    
    // Find users that need approval but don't have proper company setup
    const usersNeedingFix = [...orphanedUsers, ...pendingUsersWithoutCompanies];
    const uniqueUsersNeedingFix = usersNeedingFix.filter((user, index, self) => 
      index === self.findIndex(u => u.id === user.id)
    );
    
    console.log(`🔧 Total users needing fix: ${uniqueUsersNeedingFix.length}`);
    
    if (uniqueUsersNeedingFix.length === 0) {
      console.log('✅ No users need fixing! All users have proper company associations.');
      return {
        success: true,
        message: 'No users need fixing',
        stats: {
          totalUsers: users.length,
          totalCompanies: companies.length,
          orphanedUsers: orphanedUsers.length,
          pendingUsersWithoutCompanies: pendingUsersWithoutCompanies.length,
          usersFixed: 0,
          errors: 0
        }
      };
    }
    
    // Create companies for users that need them
    let createdCount = 0;
    let errorCount = 0;
    const errors = [];
    
    for (const user of uniqueUsersNeedingFix) {
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
        const companyRef = await db.collection("companies").add(companyData);
        
        // Update user with company ID
        await db.collection("users").doc(user.id).update({
          companyId: companyRef.id,
          approvalStatus: 'pending'
        });
        
        console.log(`✅ Created company for ${user.email} (Company ID: ${companyRef.id})`);
        createdCount++;
        
      } catch (error) {
        console.error(`❌ Error creating company for ${user.email}:`, error);
        errorCount++;
        errors.push({
          user: user.email,
          error: error.message
        });
      }
    }
    
    const endTime = new Date();
    const duration = endTime - startTime;
    
    console.log('\n📈 Summary:');
    console.log(`✅ Successfully created companies for ${createdCount} users`);
    console.log(`❌ Failed to create companies for ${errorCount} users`);
    console.log(`📊 Total users processed: ${uniqueUsersNeedingFix.length}`);
    console.log(`⏱️  Script duration: ${duration}ms`);
    
    if (createdCount > 0) {
      console.log('\n🎉 Success! Users now have companies and can be approved.');
      console.log('💡 Check the admin approval page to approve these users.');
    }
    
    return {
      success: errorCount === 0,
      message: `Fixed ${createdCount} users, ${errorCount} errors`,
      stats: {
        totalUsers: users.length,
        totalCompanies: companies.length,
        orphanedUsers: orphanedUsers.length,
        pendingUsersWithoutCompanies: pendingUsersWithoutCompanies.length,
        usersFixed: createdCount,
        errors: errorCount,
        duration: duration
      },
      errors: errors
    };
    
  } catch (error) {
    console.error('💥 Script failed:', error);
    return {
      success: false,
      message: 'Script failed',
      error: error.message
    };
  }
}

// Run the script
if (require.main === module) {
  console.log('🚀 Starting admin SDK auto-fix users script...\n');
  fixUsersWithAdmin()
    .then((result) => {
      console.log('\n📊 Final Result:', result);
      if (result.success) {
        console.log('✅ Script completed successfully!');
        process.exit(0);
      } else {
        console.log('⚠️  Script completed with errors');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('\n💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { fixUsersWithAdmin }; 