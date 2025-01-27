require('dotenv').config({ path: '../.env' });

const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors');
const PreferenceModel = require('./model/Preference');
const app = express();
app.use(express.json());
// app.use(cors());

mongoose
  .connect('mongodb://127.0.0.1:27017/CookiesManager', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.post('/add-preference', async (req, res) => {
  const { title, content, adminId } = req.body;
  console.log(adminId);
  // const preference = {title, content, adminId, id:id++}
  const preference = await PreferenceModel.create({ title, content, adminId });

  // preferences.push(preference)

  return res.status(201).json({ message: 'Successfully added preference', preference });
});

app.post('/update-preference/:id', async (req, res) => {
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
  const preferences = await PreferenceModel.find();
  return res.status(200).json(preferences);
});

app.post('/delete-preference/:id', async (req, res) => {
  const preferenceId = req.params.id;
  await PreferenceModel.findByIdAndDelete(preferenceId);

  return res.status(200).json({ message: 'Deleted successfully' });
});

app.listen(3001, () => {
  console.log('server is running');
});
