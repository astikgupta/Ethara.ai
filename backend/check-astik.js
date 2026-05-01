const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Project = require('./models/Project');
const User = require('./models/User');
const Task = require('./models/Task');

dotenv.config();

const checkAstik = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const astik = await User.findOne({ name: /Astik/i });
    if (!astik) {
      console.log('User Astik not found');
      process.exit(0);
    }
    console.log('Astik ID:', astik._id);

    const projects = await Project.find({ members: astik._id });
    console.log('Projects Astik is in:', projects.map(p => p.title));

    const tasks = await Task.find({ assignedTo: astik._id });
    console.log('Tasks assigned to Astik:', tasks.map(t => t.title));
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkAstik();
