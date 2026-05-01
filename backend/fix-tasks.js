const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./models/Task');
const Project = require('./models/Project');
const User = require('./models/User');

dotenv.config();

const fixTasks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const astik = await User.findOne({ name: /Astik/i });
    const debugProject = await Project.findOne({ title: /Debug/i });

    if (!astik || !debugProject) {
      console.log('Astik or Debug Project not found');
      process.exit();
    }

    // Update all tasks assigned to Astik to point to the Debug Project
    const result = await Task.updateMany(
      { assignedTo: astik._id },
      { projectId: debugProject._id }
    );

    console.log(`Successfully updated ${result.modifiedCount} tasks to Debug Project!`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

fixTasks();
