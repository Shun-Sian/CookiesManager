import React from 'react';
import { ProductListProps } from '../types/ProductList.types';
import '../Styles/product-list.css';

export default function ProductList(props: ProductListProps) {
  const { products, userId, isLoggedIn, onEditClick, onDeleteClick } = props;
  return (
    <div className="products-grid">
      {products.map((product) => (
        <div key={product._id} className="product-card">
          {product.coverPhoto && (
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${product.coverPhoto}`}
              alt={product.title}
              className="product-image"
            />
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
}
