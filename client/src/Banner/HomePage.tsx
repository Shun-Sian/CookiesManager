import React, { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { AxiosError } from 'axios';
import LoginPopup from '../Admin/LoginPopup';
import CookieConsent from './CookieConsent';
import HomeNav from './HomeNav';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import Pagination from './Pagination';
import Slider from './Slider';
import SearchBar from './SearchBar';
import type { Product } from '../types/ProductList.types';
import type { DecodedToken } from '../types/DecodedToken.types';
import type { ProductFilterProps } from '../types/ProductFilter.types';
import type { UpdatedProductFormProps } from '../types/ProductForm.types';
import api from '../utils/api';
import '../Styles/home-page.css';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showLoginPopup, setShowLoginPopup] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showProductFormPopup, setShowProductFormPopup] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchInputValue, setSearchInputValue] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [productFilter, setProductFilter] = useState<ProductFilterProps>({
    page: 0,
    limit: 8,
    minPrice: 0,
    maxPrice: 100000,
    searchTermQ: '',
  });
  const [showSlider, setShowSlider] = useState<boolean>(false);
  const currentPage = parseInt(searchParams.get('page') || '0') || 0;

  useEffect(() => {
    fetchProducts();
  }, [searchParams, searchInputValue]);

  useEffect(() => {
    setSearchParams({
      page: productFilter.page.toString(),
      limit: productFilter.limit.toString(),
      minPrice: productFilter.minPrice.toString(),
      maxPrice: productFilter.maxPrice.toString(),
      searchTermQ: productFilter.searchTermQ,
    });
  }, [productFilter, searchParams]);

  function fetchProducts() {
    const page = searchParams.get('page') || productFilter.page;
    const limit = searchParams.get('limit') || productFilter.limit;
    const minPrice = searchParams.get('minPrice') || productFilter.minPrice;
    const maxPrice = searchParams.get('maxPrice') || productFilter.maxPrice;
    const searchTermQ = searchParams.get('searchTermQ') || productFilter.searchTermQ;

    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const decodedToken: DecodedToken = jwtDecode(token);
      setUserId(decodedToken.id as string);
    }
    api
      .get(
        `/get-all-products?currentPage=${page}&itermsPerPage=${limit}&minPrice=${minPrice}&maxPrice=${maxPrice}&searchTerm=${searchInputValue}`
      )
      .then((response) => {
        setProducts(response.data.products);
        setTotalPages(Math.ceil(response.data.total / (limit as number)));
      });
  }

  const updateSearchFilter = (searchValue: string) => {
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
    const decodedToken: DecodedToken = jwtDecode(token || '');
    setUserId(decodedToken.id as string);
  };

  const onProductAdded = () => {
    fetchProducts();
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product._id === updatedProduct._id ? updatedProduct : product))
    );
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setShowProductFormPopup(true);
  };

  const handleEditSubmit = async (updatedProduct: UpdatedProductFormProps) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const formData = new FormData();
      formData.append('title', updatedProduct.title);
      formData.append('details', updatedProduct.details);
      formData.append('location', updatedProduct.location);
      formData.append('price', updatedProduct.price.toString());
      if (updatedProduct.discountPrice) {
        formData.append('discountPrice', updatedProduct.discountPrice.toString());
      }

      if (updatedProduct.coverPhoto) {
        formData.append('coverPhoto', updatedProduct.coverPhoto);
      }

      const response = await api.post(`/update-product/${updatedProduct._id}`, formData, {
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
    } catch (error: any) {
      console.error('Error updating product:', error.response?.data || error.message);
      alert('Error updating product. Please try again.');
    }
  };

  const handleDeleteClick = async (productId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to delete a product.');
      return;
    }

    try {
      const response = await api.post(
        `/delete-product/${productId}`,
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
      const axiosError = error as AxiosError;
      console.error('Error deleting product:', axiosError.response?.data || axiosError.message);
      alert('Error deleting product. Please try again.');
    }
  };

  const handlePageChange = (newPage: number) => {
    setProductFilter((prevFilter) => ({ ...prevFilter, page: newPage }));
  };

  const handlePriceChange = ({ min, max }: { min: number; max: number }) => {
    setProductFilter((prevFilter) => ({ ...prevFilter, minPrice: min, maxPrice: max }));
  };

  return (
    <div className="homePage-container">
      {showLoginPopup && <LoginPopup onClose={handlePopupClose} onLoginSuccess={handleLoginSuccess} />}

      <HomeNav isLoggedIn={isLoggedIn} setShowLoginPopup={setShowLoginPopup} onLogout={handleLogout} />

      <div className="homePage-filterContainer">
        <button onClick={() => setShowSlider(!showSlider)} className="toggle-slider-button">
          {showSlider ? 'Hide Filter' : `Price: $${productFilter.minPrice} - $${productFilter.maxPrice}`}
        </button>
        <SearchBar
          value={searchInputValue}
          onChange={(value) => {
            setSearchInputValue(value);
            updateFilter(value);
          }}
          onClear={() => {
            setSearchInputValue('');
            updateFilter('');
          }}
        />
      </div>

      <div className="add-product-container">
        {isLoggedIn && (
          <button onClick={toggleProductFormPopup} className="add-product-button">
            Add Product
          </button>
        )}
      </div>

      {showSlider && <Slider min={0} max={1000} onChange={handlePriceChange} />}

      {(showProductFormPopup || editingProduct) && (
        <div className="popup-overlay">
          <div className="popup-content">
            <ProductForm
              ownerId={userId as string}
              onClose={() => {
                setShowProductFormPopup(false);
                setEditingProduct(null);
              }}
              onProductAdded={onProductAdded}
              product={editingProduct as Product}
              onSubmit={handleEditSubmit}
            />
          </div>
        </div>
      )}

      <div className="productList-container">
        <ProductList
          products={products}
          userId={userId as string}
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
