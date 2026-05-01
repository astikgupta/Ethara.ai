const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

dotenv.config();

const clearDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB...');

    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    console.log('SUCCESS: Database cleared! All users, projects, and tasks removed.');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

clearDB();
