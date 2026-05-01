const axios = require('axios');

const testSignup = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/signup', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'Admin'
    });
    console.log('Signup success:', response.data);
  } catch (error) {
    console.error('Signup failed:', error.response ? error.response.data : error.message);
  }
};

testSignup();
