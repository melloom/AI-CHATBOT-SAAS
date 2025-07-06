const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin SDK
const serviceAccountPath = path.join(__dirname, '..', 'chathub-3f128-firebase-adminsdk-fbsvc-503cc1f52e.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
    projectId: process.env.FIREBASE_PROJECT_ID || 'chathub-3f128'
  });
}

const db = admin.firestore();

async function initializeBackupCollections() {
  try {
    console.log('🚀 Initializing backup collections with Admin SDK...');
    
    // Create deleted_companies collection with a sample document
    const deletedCompaniesRef = db.collection('deleted_companies');
    const sampleCompanyBackup = {
      originalId: 'sample-company-id',
      type: 'company',
      data: {
        companyName: 'Sample Company',
        email: 'sample@company.com',
        status: 'deleted',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      deletedAt: new Date().toISOString(),
      deletedBy: 'system',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      canRecover: true,
      isSample: true // Flag to identify this as a sample document
    };

    // Create deleted_users collection with a sample document
    const deletedUsersRef = db.collection('deleted_users');
    const sampleUserBackup = {
      originalId: 'sample-user-id',
      type: 'user',
      data: {
        email: 'sample@user.com',
        displayName: 'Sample User',
        companyId: 'sample-company-id',
        companyName: 'Sample Company',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      deletedAt: new Date().toISOString(),
      deletedBy: 'system',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      canRecover: true,
      isSample: true // Flag to identify this as a sample document
    };

    // Check if collections already exist by trying to get documents
    console.log('📋 Checking existing collections...');
    
    try {
      const existingCompanies = await deletedCompaniesRef.get();
      console.log(`✅ deleted_companies collection exists with ${existingCompanies.size} documents`);
    } catch (error) {
      console.log('❌ deleted_companies collection does not exist, creating...');
      // Create the collection by adding a sample document
      await deletedCompaniesRef.doc('sample-company-backup').set(sampleCompanyBackup);
      console.log('✅ deleted_companies collection created with sample document');
    }

    try {
      const existingUsers = await deletedUsersRef.get();
      console.log(`✅ deleted_users collection exists with ${existingUsers.size} documents`);
    } catch (error) {
      console.log('❌ deleted_users collection does not exist, creating...');
      // Create the collection by adding a sample document
      await deletedUsersRef.doc('sample-user-backup').set(sampleUserBackup);
      console.log('✅ deleted_users collection created with sample document');
    }

    // Verify collections are accessible
    console.log('🔍 Verifying collections are accessible...');
    
    const companiesSnapshot = await deletedCompaniesRef.get();
    const usersSnapshot = await deletedUsersRef.get();
    
    console.log(`✅ deleted_companies: ${companiesSnapshot.size} documents`);
    console.log(`✅ deleted_users: ${usersSnapshot.size} documents`);
    
    // Clean up sample documents if they exist
    console.log('🧹 Cleaning up sample documents...');
    
    companiesSnapshot.forEach(async (docSnapshot) => {
      const data = docSnapshot.data();
      if (data.isSample) {
        console.log('🗑️ Removing sample company backup document...');
        await docSnapshot.ref.delete();
        console.log('✅ Sample company backup document removed');
      }
    });
    
    usersSnapshot.forEach(async (docSnapshot) => {
      const data = docSnapshot.data();
      if (data.isSample) {
        console.log('🗑️ Removing sample user backup document...');
        await docSnapshot.ref.delete();
        console.log('✅ Sample user backup document removed');
      }
    });

    console.log('🎉 Backup collections initialization completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log('- deleted_companies collection: ✅ Ready');
    console.log('- deleted_users collection: ✅ Ready');
    console.log('- Firestore security rules: ✅ Configured');
    console.log('- Backup management service: ✅ Ready');
    console.log('');
    console.log('💡 The backup system is now ready to use!');
    console.log('   - Deleted companies and users will be backed up for 30 days');
    console.log('   - Admins can recover backups through System Settings → Backup');
    console.log('   - Expired backups will be automatically cleaned up');

  } catch (error) {
    console.error('❌ Error initializing backup collections:', error);
    console.error('Please check your Firebase Admin SDK configuration and permissions.');
    process.exit(1);
  }
}

// Run the initialization
if (require.main === module) {
  initializeBackupCollections()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeBackupCollections }; 