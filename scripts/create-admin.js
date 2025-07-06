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

async function createAdminUser() {
  try {
    // Create admin user
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      'Melvin.a.p.cruz@gmail.com', 
      'Mel1747-'
    );

    const user = userCredential.user;

    // Create admin profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: 'Melvin.a.p.cruz@gmail.com',
      displayName: 'Melvin Cruz',
      companyName: 'ChatHub Admin',
      role: 'admin',
      isAdmin: true,
      permissions: ['manage_all_companies', 'view_all_data', 'manage_subscriptions'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log('✅ Admin user created successfully!');
    console.log('User ID:', user.uid);
    console.log('Email:', user.email);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
}

createAdminUser(); 