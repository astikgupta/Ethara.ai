const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({ name: /Astik/i });
    console.log('Users found with name Astik:');
    users.forEach(u => console.log(`- ${u.name} (${u.email}) ID: ${u._id}`));
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

check();
