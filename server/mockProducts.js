const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Product = require('./model/Product');

mongoose
  .connect('mongodb://127.0.0.1:27017/CookiesManager', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const seedProducts = async () => {
  try {
    await Product.deleteMany();

    const products = [
      { role: 'admin', username: 'a1', password: 'pass', isConcentGiven: true },
      { role: 'user', username: 'user1', password: 'password123', isConcentGiven: false },
      { role: 'user', username: 'user2', password: 'password123', isConcentGiven: true },
      { role: 'user', username: 'user3', password: 'password123', isConcentGiven: false },
    ];

    for (let product of products) {
      product.password = await bcrypt.hash(product.password, 10);
    }

    await Product.insertMany(products);
    console.log('Products seeded successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding products:', err);
    mongoose.connection.close();
  }
};

seedProducts();
// run the following to generate users - node mockProducts.js
