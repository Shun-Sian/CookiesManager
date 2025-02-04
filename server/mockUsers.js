const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./model/User');

mongoose
  .connect('mongodb://127.0.0.1:27017/CookiesManager', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const seedUsers = async () => {
  try {
    await User.deleteMany();

    const users = [
      { role: 'admin', username: 'a1', password: 'pass', isConcentGiven: true },
      { role: 'user', username: 'user1', password: 'password123', isConcentGiven: false },
      { role: 'user', username: 'user2', password: 'password123', isConcentGiven: true },
      { role: 'user', username: 'user3', password: 'password123', isConcentGiven: false },
    ];

    for (let user of users) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    await User.insertMany(users);
    console.log('Users seeded successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding users:', err);
    mongoose.connection.close();
  }
};

seedUsers();
// run the following to generate users - node mockUsers.js
