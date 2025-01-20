const mongoose = require('mongoose');
const Adventure = require('./model/Adventure');
const User = require('./model/User');

mongoose
  .connect('mongodb://127.0.0.1:27017/user', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const seedAdventures = async () => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      console.log('No users found. Please seed users first.');
      return;
    }

    await Adventure.deleteMany(); // Clear existing Adventures

    const Adventures = [
      { title: 'Adventure 1', details: 'Description for Adventure 1', ownerId: users[0]._id },
      { title: 'Adventure 2', details: 'Description for Adventure 2', ownerId: users[1]._id },
      { title: 'Adventure 3', details: 'Description for Adventure 3', ownerId: users[2]._id },
      { title: 'Adventure 4', details: 'Description for Adventure 4', ownerId: users[3]._id },
    ];

    await Adventure.insertMany(Adventures);
    console.log('Adventure seeded successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding Adventure:', err);
    mongoose.connection.close();
  }
};

seedAdventures();
// run the following to generate data - node seedAdventures.js
