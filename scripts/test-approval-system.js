const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, orderBy } = require('firebase/firestore');

// Initialize Firebase (you'll need to add your config)
const firebaseConfig = {
  // Add your Firebase config here
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testApprovalSystem() {
  try {
    console.log('Testing approval system...');
    
    // Check all companies
    const companiesQuery = query(collection(db, "companies"), orderBy("createdAt", "desc"));
    const companiesSnapshot = await getDocs(companiesQuery);
    
    console.log(`Found ${companiesSnapshot.size} total companies`);
    
    companiesSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`Company: ${data.companyName} (${doc.id})`);
      console.log(`  Email: ${data.email}`);
      console.log(`  Status: ${data.approvalStatus}`);
      console.log(`  User ID: ${data.userId}`);
      console.log(`  Created: ${data.createdAt}`);
      console.log('---');
    });
    
    // Check pending companies specifically
    const pendingQuery = query(
      collection(db, "companies"),
      where("approvalStatus", "==", "pending"),
      orderBy("createdAt", "desc")
    );
    const pendingSnapshot = await getDocs(pendingQuery);
    
    console.log(`Found ${pendingSnapshot.size} pending companies`);
    
    pendingSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`Pending: ${data.companyName} (${doc.id})`);
      console.log(`  Email: ${data.email}`);
      console.log(`  User ID: ${data.userId}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error testing approval system:', error);
  }
}

testApprovalSystem(); 