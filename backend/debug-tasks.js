const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./models/Task');
const User = require('./models/User');

dotenv.config();

const debug = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const astik = await User.findOne({ name: /Astik/i });
    if (!astik) {
      console.log('User Astik not found');
      process.exit();
    }
    console.log(`Astik ID: ${astik._id}`);

    const allTasks = await Task.find({}).populate('assignedTo', 'name');
    console.log(`\nTotal Tasks in DB: ${allTasks.length}`);
    
    console.log('\nTasks assigned to Astik:');
    const astikTasks = allTasks.filter(t => t.assignedTo && t.assignedTo._id.toString() === astik._id.toString());
    if (astikTasks.length === 0) {
      console.log('NONE! No tasks found assigned to Astik.');
    } else {
      astikTasks.forEach(t => console.log(`- ${t.title} (Status: ${t.status})`));
    }

    console.log('\nOther Tasks:');
    allTasks.filter(t => !t.assignedTo || t.assignedTo._id.toString() !== astik._id.toString())
      .forEach(t => {
        const assignedName = t.assignedTo ? (t.assignedTo.name || t.assignedTo) : 'Nobody';
        console.log(`- ${t.title} (Assigned to: ${assignedName})`);
      });

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

debug();
