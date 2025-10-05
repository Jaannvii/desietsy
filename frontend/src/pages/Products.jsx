import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/home.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;
    const isLoggedIn = !!localStorage.getItem('token');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${API_URL}/product/`);
                setProducts(res.data || []);
            } catch (err) {
                console.error('Error fetching products:', err);
            }
        };
        fetchProducts();
    }, [API_URL]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryParam = params.get('category');

        if (!categoryParam || categoryParam === 'All') {
            setSelectedCategory('All');
            setFilteredProducts(products);
        } else {
            setSelectedCategory(categoryParam);
            const filtered = products.filter(
                (p) =>
                    p.category &&
                    p.category.categoryName.toLowerCase() ===
                        categoryParam.toLowerCase()
            );
            setFilteredProducts(filtered);
        }
    }, [products, location.search]);

    const handleAddToCart = (product) => {
        if (isLoggedIn) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            setMessage(`${product.name} added to cart ✅`);
            setSuccess(true);
            setTimeout(() => navigate('/cart'), 3000);
        } else {
            setMessage(
                'Please register to add items to your cart. Redirecting to the registration page...'
            );
            setSuccess(false);
            setTimeout(() => navigate('/auth/register'), 3000);
        }
    };

    return (
        <div className="bgColor">
            <h1 className="text-center py-4 title">
                {selectedCategory === 'All'
                    ? 'All Products'
                    : `${selectedCategory} Category`}
            </h1>
            <div className="container">
                {message && (
                    <p
                        className={`text-center ${
                            success ? 'text-success' : 'text-danger'
                        }`}
                    >
                        {message}
                    </p>
                )}

                <div className="row">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <div className="col-md-4 mb-4" key={product._id}>
                                <div className="card shadow h-100">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="card-img-top"
                                        style={{
                                            height: '250px',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {product.name}
                                        </h5>
                                        <p className="card-text">
                                            {product.description}
                                        </p>
                                        <p className="fw-bold">
                                            {product.discount > 0 ? (
                                                <>
                                                    <span className="text-muted text-decoration-line-through">
                                                        ₹{product.price}
                                                    </span>{' '}
                                                    <span>
                                                        ₹
                                                        {
                                                            product.discountedPrice
                                                        }
                                                    </span>{' '}
                                                    <small className="text-success">
                                                        ({product.discount}%
                                                        OFF)
                                                    </small>
                                                </>
                                            ) : (
                                                <>₹{product.price}</>
                                            )}
                                        </p>

                                        <button
                                            className="btn btn-primary"
                                            onClick={() =>
                                                handleAddToCart(product)
                                            }
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted">
                            No products found in this category.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;
