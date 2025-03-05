import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../Styles/product-form.css';

const ProductForm = ({ ownerId, onClose }) => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    details: '',
    location: '',
    price: '',
    discountPrice: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const ownerId = decodedToken.id;

    const data = new FormData();
    data.append('coverPhoto', file);
    data.append('ownerId', ownerId);
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const response = await axios.post('http://localhost:3001/add-product', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Product created:', response.data);
      alert('Product created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating product:', error.response?.data || error.message);
      alert('Error creating product. Please try again.');
    }
  };

  return (
    <div className="productForm-container">
      <h2>Create a New Product</h2>
      <button onClick={onClose} className="close-button">
        &times;
      </button>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Cover Photo:</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        </div>
        <div>
          <label>Title:</label>
          <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Details:</label>
          <input
            type="text"
            name="details"
            placeholder="Details"
            value={formData.details}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Discount Price:</label>
          <input
            type="number"
            name="discountPrice"
            placeholder="Discount Price"
            value={formData.discountPrice}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default ProductForm;
