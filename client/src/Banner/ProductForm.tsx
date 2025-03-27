import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ProductFormProps } from '../types/ProductForm.types';
import { DecodedToken } from '../types/DecodedToken.types';
import { Product } from '../types/ProductList.types';
import '../Styles/product-form.css';

const ProductForm = (props: ProductFormProps) => {
  const { onClose, addProduct, product, onSubmit } = props;
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Omit<Product, '_id' | 'ownerId' | 'coverPhoto'>>({
    title: '',
    details: '',
    location: '',
    price: 0,
    discountPrice: 0,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        details: product.details,
        location: product.location,
        price: product.price,
        discountPrice: Number(product.discountPrice),
      });
    }
  }, [product]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const decodedToken: DecodedToken = jwtDecode(token as string);
    const ownerId = decodedToken.id;

    const data = new FormData();
    if (file) {
      data.append('coverPhoto', file);
    }
    data.append('ownerId', ownerId as string);

    (Object.entries(formData) as Array<[keyof typeof formData, string | number]>).forEach(([key, value]) => {
      data.append(key, value.toString());
    });

    if (product) {
      data.append('_id', product._id);
    }

    try {
      if (product && onSubmit) {
        await onSubmit({
          ...formData,
          _id: product._id,
          ownerId: product.ownerId,
          coverPhoto: file || product.coverPhoto,
        });
      } else {
        const response = await axios.post('http://localhost:3001/add-product', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Product created:', response.data);
        alert('Product created successfully!');
        addProduct(response.data.product);
        onClose();
      }
    } catch (error: any) {
      console.error('Error:', error.response?.data || error.message);
      alert(`Error ${product ? 'updating' : 'creating'} product. Please try again.`);
    }
  };

  return (
    <div className="productForm-container">
      <h2>{product ? 'Edit Product' : 'Create a New Product'}</h2>
      <button onClick={onClose} className="productForm-close-button">
        &times;
      </button>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Cover Photo:</label>
          <input type="file" onChange={(e) => setFile(e.target.files && e.target.files[0])} />
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
        <button type="submit">{product ? 'Update Product' : 'Create Product'}</button>
      </form>
    </div>
  );
};

export default ProductForm;
