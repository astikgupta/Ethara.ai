const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const testDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB Connected');
    
    const user = await User.create({
      name: 'Test',
      email: `test_${Date.now()}@test.com`,
      password: 'password123',
      role: 'Admin'
    });
    console.log('User created:', user.email);
    process.exit(0);
  } catch (error) {
    console.error('DB Error:', error.message);
    process.exit(1);
  }
};

testDB();
