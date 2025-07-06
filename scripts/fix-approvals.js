const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, addDoc, updateDoc, doc, query, where, orderBy } = require('firebase/firestore');
require('dotenv').config();

// Firebase configuration from .env.local
const firebaseConfig = {
  apiKey: "AIzaSyCG4TaO69uN1nMGljSlVN0B4GDuozaVVhU",
  authDomain: "chathub-3f128.firebaseapp.com",
  projectId: "chathub-3f128",
  storageBucket: "chathub-3f128.firebasestorage.app",
  messagingSenderId: "168721489748",
  appId: "1:168721489748:web:4f056684784888480af2c1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixApprovals() {
  const startTime = new Date();
  console.log(`🚀 Fix approvals script started at ${startTime.toISOString()}`);
  
  try {
    // Get all users
    console.log('📊 Fetching users...');
    const usersSnapshot = await getDocs(collection(db, "users"));
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    console.log(`📊 Found ${users.length} total users`);
    
    // Get all companies
    console.log('🏢 Fetching companies...');
    const companiesSnapshot = await getDocs(collection(db, "companies"));
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
        errors.push({
          user: user.email,
          error: error.message
        });
      }
    }
    
    // Now let's check the approval status of all companies
    console.log('\n📋 Checking approval status of all companies...');
    const allCompanies = companiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const pendingCompanies = allCompanies.filter(company => company.approvalStatus === 'pending');
    const approvedCompanies = allCompanies.filter(company => company.approvalStatus === 'approved');
    const rejectedCompanies = allCompanies.filter(company => company.approvalStatus === 'rejected');
    const noStatusCompanies = allCompanies.filter(company => !company.approvalStatus);
    
    console.log(`📊 Company approval status:`);
    console.log(`  - Pending: ${pendingCompanies.length}`);
    console.log(`  - Approved: ${approvedCompanies.length}`);
    console.log(`  - Rejected: ${rejectedCompanies.length}`);
    console.log(`  - No status: ${noStatusCompanies.length}`);
    
    // Fix companies without approval status
    let statusFixedCount = 0;
    for (const company of noStatusCompanies) {
      try {
        await updateDoc(doc(db, "companies", company.id), {
          approvalStatus: 'pending',
          updatedAt: new Date().toISOString()
        });
        console.log(`✅ Fixed approval status for company: ${company.companyName}`);
        statusFixedCount++;
      } catch (error) {
        console.error(`❌ Error fixing status for company ${company.companyName}:`, error);
      }
    }
    
    const endTime = new Date();
    const duration = endTime - startTime;
    
    console.log('\n📈 Summary:');
    console.log(`✅ Successfully created companies for ${createdCount} users`);
    console.log(`✅ Fixed approval status for ${statusFixedCount} companies`);
    console.log(`❌ Failed to create companies for ${errorCount} users`);
    console.log(`📊 Total users processed: ${uniqueUsersNeedingFix.length}`);
    console.log(`⏱️  Script duration: ${duration}ms`);
    
    if (createdCount > 0 || statusFixedCount > 0) {
      console.log('\n🎉 Success! Users now have companies and can be approved.');
      console.log('💡 Check the admin approval page to approve these users.');
      console.log('🌐 Visit: http://localhost:3001/dashboard/admin/approvals');
    }
    
    return {
      success: errorCount === 0,
      message: `Fixed ${createdCount} users, ${statusFixedCount} companies, ${errorCount} errors`,
      stats: {
        totalUsers: users.length,
        totalCompanies: companies.length,
        orphanedUsers: orphanedUsers.length,
        pendingUsersWithoutCompanies: pendingUsersWithoutCompanies.length,
        usersFixed: createdCount,
        companiesStatusFixed: statusFixedCount,
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
  console.log('🚀 Starting fix approvals script...\n');
  fixApprovals()
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

module.exports = { fixApprovals }; 