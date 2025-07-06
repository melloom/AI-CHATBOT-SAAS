const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyCG4TaO69uN1nMGljSlVN0B4GDuozaVVhU",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "chathub-3f128.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "chathub-3f128",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "chathub-3f128.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "168721489748",
  appId: process.env.FIREBASE_APP_ID || "1:168721489748:web:4f056684784888480af2c1",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-JZ42R62B3Z"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createTestAdminUser() {
  try {
    // Create test admin user
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      'tester@chathub.com', 
      'Test123!'
    );

    const user = userCredential.user;

    // Create test admin profile in Firestore with read-only permissions
    await setDoc(doc(db, 'users', user.uid), {
      email: 'tester@chathub.com',
      displayName: 'Test Admin',
      companyName: 'ChatHub Test',
      role: 'admin',
      isAdmin: true,
      isReadOnly: true, // This flag indicates read-only access
      permissions: [
        'view_all_companies', 
        'view_all_data', 
        'view_analytics',
        'view_users',
        'view_chatbots',
        'view_subscriptions',
        'view_settings',
        'view_system_health'
      ],
      // Explicitly exclude write permissions
      writePermissions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      approvalStatus: 'approved',
      isActive: true
    });

    console.log('✅ Test admin user created successfully!');
    console.log('User ID:', user.uid);
    console.log('Email: tester@chathub.com');
    console.log('Password: Test123!');
    console.log('Role: Read-Only Admin');
    console.log('Permissions: View-only access to all admin features');
    
  } catch (error) {
    console.error('❌ Error creating test admin user:', error.message);
  }
}

createTestAdminUser(); 