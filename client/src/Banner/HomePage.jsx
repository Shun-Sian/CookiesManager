import React, { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import LoginPopup from '../Admin/LoginPopup';
import CookieConsent from './CookieConsent';
import HomeNav from './HomeNav';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import Pagination from './Pagination';
import '../Styles/home-page.css';

function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showProductFormPopup, setShowProductFormPopup] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [productFilter, setProductFilter] = useState({
    page: 0,
    limit: 8,
    minPrice: 0,
    maxPrice: 100000,
    searchTermQ: '',
  });

  const currentPage = parseInt(searchParams.get('page')) || 0;

  useEffect(() => {
    const page = searchParams.get('page') || productFilter.page;
    const limit = searchParams.get('limit') || productFilter.limit;
    const minPrice = searchParams.get('minPrice') || productFilter.minPrice;
    const maxPrice = searchParams.get('maxPrice') || productFilter.maxPrice;
    const searchTermQ = searchParams.get('searchTermQ') || productFilter.searchTermQ;
    // setProductFilter({
    //   page,
    //   limit,
    //   minPrice,
    //   maxPrice,
    //   searchTermQ,
    // });
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id);
    }
    axios
      .get(
        `http://localhost:3001/get-all-products?currentPage=${page}&itermsPerPage=${limit}&minPrice=${minPrice}&maxPrice=${maxPrice}&searchTerm=${searchInputValue}`
      )
      .then((response) => {
        setProducts(response.data.products);
        setTotalPages(Math.ceil(response.data.total / limit));
      });
  }, [searchParams, searchInputValue]);

  useEffect(() => {
    setSearchParams(productFilter);
  }, [productFilter]);

  const updateSearchFilter = (searchValue) => {
    setProductFilter((currentFilter) => ({ ...currentFilter, searchTermQ: searchValue, page: 0 }));
  };

  const updateFilter = useDebouncedCallback(updateSearchFilter, 500);

  const handlePopupClose = () => {
    setShowLoginPopup(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserId(null);
  };

  const toggleProductFormPopup = () => {
    setShowProductFormPopup(!showProductFormPopup);
  };

  const handleLoginSuccess = () => {
    setShowLoginPopup(false);
    setIsLoggedIn(true);
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    setUserId(decodedToken.id);
  };

  const addProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product._id === updatedProduct._id ? updatedProduct : product))
    );
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setShowProductFormPopup(true);
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
      updateProduct(response.data.product);
      setEditingProduct(null);
      setShowProductFormPopup(false);
    } catch (error) {
      console.error('Error updating product:', error.response?.data || error.message);
      alert('Error updating product. Please try again.');
    }
  };

  const handleDeleteClick = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to delete a product.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3001/delete-product/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert('Product deleted successfully!');
        setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
      }
    } catch (error) {
      console.error('Error deleting product:', error.response?.data || error.message);
      alert('Error deleting product. Please try again.');
    }
  };

  const handlePageChange = (newPage) => {
    setProductFilter((prevFilter) => ({ ...prevFilter, page: newPage }));
  };

  return (
    <div className="homePage-container">
      {showLoginPopup && <LoginPopup onClose={handlePopupClose} onLoginSuccess={handleLoginSuccess} />}

      <HomeNav isLoggedIn={isLoggedIn} setShowLoginPopup={setShowLoginPopup} onLogout={handleLogout} />

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchInputValue}
          onChange={(e) => {
            setSearchInputValue(e.target.value);
            updateFilter(e.target.value);
          }}
        />
        {searchInputValue && (
          <button onClick={() => setSearchInputValue('')} className="clear-search-button">
            &times;
          </button>
        )}
      </div>

      <div className="add-product-container">
        {isLoggedIn && (
          <button onClick={toggleProductFormPopup} className="add-product-button">
            Add Product
          </button>
        )}
      </div>

      {(showProductFormPopup || editingProduct) && (
        <div className="popup-overlay">
          <div className="popup-content">
            <ProductForm
              ownerId={userId}
              onClose={() => {
                setShowProductFormPopup(false);
                setEditingProduct(null);
              }}
              addProduct={addProduct}
              product={editingProduct}
              onSubmit={handleEditSubmit}
            />
          </div>
        </div>
      )}

      <div className="productList-container">
        <ProductList
          products={products}
          userId={userId}
          isLoggedIn={isLoggedIn}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />

        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
      </div>

      <CookieConsent />
    </div>
  );
}

export default HomePage;
