import React from 'react';
import '../Styles/product-list.css';

const ProductList = ({ products, userId, isLoggedIn, onEditClick, onDeleteClick }) => {
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
            <div className="product-actions">
              <button className="edit-button" onClick={() => onEditClick(product)}>
                Edit
              </button>
              <button className="delete-button" onClick={() => onDeleteClick(product._id)}>
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
