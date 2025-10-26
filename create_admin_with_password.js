const bcrypt = require('bcrypt');

// كلمة المرور: test123456
const plainPassword = 'test123456';

async function createHashedPassword() {
  const hashedPassword = await bcrypt.hash(plainPassword, 12);
  console.log('Hashed password:', hashedPassword);
  
  // اختبار التشفير
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  console.log('Password match:', isMatch);
}

createHashedPassword();

