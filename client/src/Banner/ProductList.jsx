import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import '../Styles/product-list.css';

const ProductList = ({ userId, isLoggedIn }) => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/get-all-products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [isLoggedIn]);

  const handleEditClick = (product) => {
    setEditingProduct(product);
  };

  const handleEditSubmit = async (updatedProduct) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const formData = new FormData();
      formData.append('title', updatedProduct.title);
      formData.append('details', updatedProduct.details);
      formData.append('location', updatedProduct.location);
      formData.append('price', updatedProduct.price);
      formData.append('discountPrice', updatedProduct.discountPrice);

      if (updatedProduct.coverPhoto) {
        formData.append('coverPhoto', updatedProduct.coverPhoto);
      }

      const response = await axios.post(`http://localhost:3001/update-product/${updatedProduct._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Product updated:', response.data);
      alert('Product updated successfully!');
      setEditingProduct(null);

      const fetchResponse = await axios.get('http://localhost:3001/get-all-products');
      setProducts(fetchResponse.data);
    } catch (error) {
      console.error('Error updating product:', error.response?.data || error.message);
      alert('Error updating product. Please try again.');
    }
  };

  return (
    <div className="products-grid">
      {products.map((product) => (
        <div key={product._id} className="product-card">
          {product.coverPhoto && (
            <img src={`http://localhost:3001${product.coverPhoto}`} alt={product.title} className="product-image" />
          )}
          <h3>{product.title}</h3>
          <p>{product.details}</p>
          <p>Location: {product.location}</p>
          <p>Price: ${product.price}</p>
          {product.discountPrice && <p>Discount Price: ${product.discountPrice}</p>}

          {isLoggedIn && userId === product.ownerId && (
            <button
              className="edit-button"
              onClick={() => {
                handleEditClick(product);
              }}
            >
              Edit
            </button>
          )}
        </div>
      ))}
      {editingProduct && (
        <div className="popup-overlay">
          <div className="popup-content">
            <ProductForm product={editingProduct} onSubmit={handleEditSubmit} onClose={() => setEditingProduct(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
