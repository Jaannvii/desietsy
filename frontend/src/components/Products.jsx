import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/products.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_URL}/product/categories`);
                setCategories(res.data || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, [API_URL]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoryParam = params.get('category');
        setSelectedCategory(categoryParam || '');

        const fetchProducts = async () => {
            try {
                const endpoint = categoryParam
                    ? `${API_URL}/product?category=${categoryParam}`
                    : `${API_URL}/product`;

                const response = await axios.get(endpoint);
                setProducts(response.data.products || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [location.search, API_URL]);

    const handleClearFilter = () => {
        navigate('/products');
    };

    return (
        <div className="products-page container py-5">
            <h2 className="mb-4 text-center title">
                {selectedCategory
                    ? `${
                          categories.find((c) => c._id === selectedCategory)
                              ?.categoryName || ''
                      } Products`
                    : 'All Products'}
            </h2>

            {selectedCategory && (
                <div className="text-center mb-4">
                    <button
                        className="btn btn-outline-secondary"
                        onClick={handleClearFilter}
                    >
                        ← View All Products
                    </button>
                </div>
            )}

            <div className="row mb-4">
                <div className="col-md-4 offset-md-4">
                    <select
                        className="form-select"
                        value={selectedCategory || ''}
                        onChange={(e) =>
                            navigate(
                                e.target.value
                                    ? `/products?category=${e.target.value}`
                                    : '/products'
                            )
                        }
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.categoryName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="row">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div
                            className="col-md-4 col-sm-6 mb-4"
                            key={product._id}
                        >
                            <div className="card h-100 shadow-sm">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="card-img-top"
                                    style={{
                                        height: '200px',
                                        objectFit: 'cover',
                                    }}
                                />
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <h5 className="card-title">
                                        {product.name}
                                    </h5>
                                    <p className="card-text">
                                        {product.description}
                                    </p>
                                    <p className="fw-bold mb-2">
                                        ₹{product.price}
                                    </p>
                                    {product.discount > 0 && (
                                        <p className="text-success">
                                            Discount: {product.discount}%
                                        </p>
                                    )}
                                    <button className="btn btn-primary mt-auto">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center">
                        <p>No products found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Products;
