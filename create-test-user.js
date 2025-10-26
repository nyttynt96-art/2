const bcrypt = require('bcryptjs');

async function createTestUser() {
  const hashedPassword = await bcrypt.hash('test123456', 10);
  console.log('Hashed password:', hashedPassword);
  
  // Now you can use this password in the SQL query
}

createTestUser();

