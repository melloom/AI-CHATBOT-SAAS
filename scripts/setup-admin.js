// Admin Setup Script - Run this in browser console when logged in as admin
// Copy and paste this into your browser console on the admin page

async function setupAdmin() {
  try {
    console.log('🔧 Setting up admin permissions...');
    
    // Get current user
    const user = firebase.auth().currentUser;
    if (!user) {
      console.error('❌ No user logged in');
      return;
    }
    
    console.log('👤 Current user:', user.email);
    
    // Check if user document exists
    const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
    
    if (!userDoc.exists) {
      console.log('⚠️  User document does not exist. Creating...');
      await firebase.firestore().collection('users').doc(user.uid).set({
        email: user.email,
        isAdmin: true,
        isReadOnly: false,
        approvalStatus: 'approved',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log('✅ Created user document with admin privileges');
    } else {
      console.log('📄 User document exists. Updating admin status...');
      await firebase.firestore().collection('users').doc(user.uid).update({
        isAdmin: true,
        isReadOnly: false,
        updatedAt: new Date().toISOString()
      });
      console.log('✅ Updated user with admin privileges');
    }
    
    console.log('🎉 Admin setup complete! You should now be able to approve companies.');
    
  } catch (error) {
    console.error('💥 Error setting up admin:', error);
  }
}

// Run the setup
setupAdmin(); 