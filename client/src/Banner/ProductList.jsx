import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/product-list.css';

const ProductList = ({ userId, isLoggedIn }) => {
  const [products, setProducts] = useState([]);

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
                console.log('Edit product:', product._id);
              }}
            >
              Edit
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
