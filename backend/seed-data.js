const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB Connected for seeding...');

    // Clear existing (optional, but good for a clean dummy state)
    // await User.deleteMany({ email: /dummy/ });
    // await Project.deleteMany({ title: /Website/ });
    // await Task.deleteMany({});

    // 1. Create Users
    const admin = await User.create({
      name: 'Admin User (Dummy)',
      email: 'admin_dummy@example.com',
      password: 'password123',
      role: 'Admin'
    });

    const member1 = await User.create({
      name: 'Rahul Sharma (Dummy)',
      email: 'rahul_dummy@example.com',
      password: 'password123',
      role: 'Member'
    });

    const member2 = await User.create({
      name: 'Priya Singh (Dummy)',
      email: 'priya_dummy@example.com',
      password: 'password123',
      role: 'Member'
    });

    console.log('Users created');

    // 2. Create Projects
    const project1 = await Project.create({
      title: 'Website Redesign 2024',
      description: 'Overhauling the corporate website with a modern glassmorphic look.',
      createdBy: admin._id,
      members: [admin._id, member1._id, member2._id]
    });

    const project2 = await Project.create({
      title: 'Mobile App Launch',
      description: 'Preparing the iOS and Android applications for the summer release.',
      createdBy: admin._id,
      members: [admin._id, member1._id]
    });

    console.log('Projects created');

    // 3. Create Tasks
    await Task.create([
      {
        title: 'Design Hero Section',
        description: 'Create a high-fidelity mockup for the website hero section.',
        status: 'In Progress',
        assignedTo: member1._id,
        projectId: project1._id,
        dueDate: new Date(Date.now() + 86400000 * 2) // 2 days from now
      },
      {
        title: 'API Integration',
        description: 'Connect the frontend forms with the new backend endpoints.',
        status: 'Todo',
        assignedTo: member2._id,
        projectId: project1._id,
        dueDate: new Date(Date.now() + 86400000 * 5)
      },
      {
        title: 'Database Setup',
        description: 'Initialize the MongoDB cluster and configure schemas.',
        status: 'Done',
        assignedTo: admin._id,
        projectId: project1._id,
        dueDate: new Date(Date.now() - 86400000) // 1 day ago (completed)
      },
      {
        title: 'App Store Icons',
        description: 'Generate all required icon sizes for the Apple App Store.',
        status: 'Todo',
        assignedTo: member1._id,
        projectId: project2._id,
        dueDate: new Date(Date.now() - 86400000 * 2) // Overdue!
      }
    ]);

    console.log('Tasks created');
    console.log('Seeding complete! You can login with: admin_dummy@example.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
