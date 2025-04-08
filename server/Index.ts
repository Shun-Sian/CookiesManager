require('dotenv').config({ path: '../.env' });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PreferenceModel = require('./model/Preference');
const UserModel = require('./model/User');
const ProductModel = require('./model/Product');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET;
console.log('JWT_SECRET ----', process.env.JWT_SECRET);

mongoose
  .connect('mongodb://127.0.0.1:27017/CookiesManager', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err && err.name === 'TokenExpiredError') {
      const decoded = jwt.decode(token, { complete: true });
      const newToken = jwt.sign({ id: decoded.id, username: decoded.username, role: decoded.role }, JWT_SECRET, {
        expiresIn: '1h',
      });
      res.setHeader('Token', newToken);
      res.setHeader('Access-Control-Expose-Headers', 'Token');
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
      req.user = newToken;
      next();
    } else if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    } else {
      req.user = user;
      console.log('generating new token');
      next();
    }
  });
};

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage });

app.use('/uploads', express.static(uploadDir));

app.post('/add-preference', authenticateToken, async (req, res) => {
  const { title, content, adminId } = req.body;
  console.log(title, content, adminId);
  const preference = await PreferenceModel.create({ title, content, adminId });

  return res.status(201).json({ message: 'Successfully added preference', preference });
});

app.post('/update-preference/:id', authenticateToken, async (req, res) => {
  const preferenceId = req.params.id;
  const preferenceToUpdate = await PreferenceModel.findById({ _id: preferenceId });

  if (!preferenceToUpdate) {
    return res.status(404).json({ message: `No Preference with ID: ${preferenceId}` });
  }

  const { title, content, adminId } = req.body;
  preferenceToUpdate.title = title;
  preferenceToUpdate.content = content;
  preferenceToUpdate.adminId = adminId;

  const savedPreference = await preferenceToUpdate.save();

  return res.status(201).json({ message: 'Successfully updated preference', preference: savedPreference });
});

app.get('/get-all-preferences', async (req, res) => {
  try {
    const preferences = await PreferenceModel.find();
    return res.status(200).json(preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return res.status(500).json({ message: 'Error fetching preferences' });
  }
});

app.post('/delete-preference/:id', authenticateToken, async (req, res) => {
  const preferenceId = req.params.id;
  await PreferenceModel.findByIdAndDelete(preferenceId);

  return res.status(200).json({ message: 'Deleted successfully' });
});

app.post('/add-user', async (req, res) => {
  const { role, username, password, isConcentGiven } = req.body;

  const existingUser = await UserModel.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await UserModel.create({ role, username, password: hashedPassword, isConcentGiven });

  return res.status(201).json({ message: 'Successfully created user', user });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1m' });
    return res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

app.post('/add-product', authenticateToken, upload.single('coverPhoto'), async (req, res) => {
  try {
    const { ownerId, title, details, location, price, discountPrice } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const product = await ProductModel.create({
      ownerId,
      title,
      details,
      location,
      price,
      discountPrice,
      coverPhoto: `/uploads/${req.file.filename}`,
    });

    return res.status(201).json({ message: 'Successfully added product', product });
  } catch (error) {
    console.error('Error adding product:', error);
    return res.status(500).json({ message: 'Error adding product', error });
  }
});

app.get('/get-all-products', async (req, res) => {
  const { currentPage, itermsPerPage, minPrice, maxPrice, searchTerm } = req.query;
  const filter = {
    price: { $gte: minPrice, $lte: maxPrice },
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { location: { $regex: searchTerm, $options: 'i' } },
      { details: { $regex: searchTerm, $options: 'i' } },
    ],
  };
  try {
    if (!!currentPage && !!itermsPerPage) {
      const products = await ProductModel.find(filter)
        .skip(currentPage * itermsPerPage)
        .limit(itermsPerPage);
      const productCount = await ProductModel.countDocuments(filter);
      console.log(productCount);

      return res.status(200).json({ products, total: productCount });
    }

    const products = await ProductModel.find();

    return res.status(200).json(products);
  } catch (error) {
    console.log('Error fetching products', error);

    return res.status(500).json({ message: 'Error fetching products' });
  }
});

app.post('/update-product/:id', authenticateToken, upload.single('coverPhoto'), async (req, res) => {
  try {
    const productId = req.params.id;
    const productToUpdate = await ProductModel.findById(productId);

    if (!productToUpdate) {
      return res.status(404).json({ message: `No Product with ID ${productId}` });
    }

    const { title, details, location, price, discountPrice } = req.body;

    if (req.file) {
      if (productToUpdate.coverPhoto) {
        const oldImagePath = path.join(__dirname, productToUpdate.coverPhoto);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      productToUpdate.coverPhoto = `/uploads/${req.file.filename}`;
    }

    productToUpdate.title = title;
    productToUpdate.details = details;
    productToUpdate.location = location;
    productToUpdate.price = price;
    productToUpdate.discountPrice = discountPrice;

    const savedProduct = await productToUpdate.save();

    return res.status(201).json({ message: 'Successfully updated product', product: savedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: 'Error updating product', error });
  }
});

app.post('/delete-product/:id', authenticateToken, async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: `No Product with ID ${productId}` });
    }

    if (product.coverPhoto) {
      const imagePath = path.join(__dirname, product.coverPhoto);
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
        } catch (fileError) {
          console.error('Error deleting image file:', fileError);
        }
      }
    }

    await ProductModel.findByIdAndDelete(productId);

    return res.status(200).json({ message: 'Product Deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Error deleting product', error });
  }
});

app.listen(3001, () => {
  console.log('server is running');
});
