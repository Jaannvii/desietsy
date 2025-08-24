import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/home.css';

const API_URL = import.meta.env.VITE_API_URL;

const ArtisanDashboard = () => {
    const [profile, setProfile] = useState(null);
    const [products, setProducts] = useState([]);
    const [detailsMessage, setDetailsMessage] = useState('');
    const [detailsSuccess, setDetailsSuccess] = useState(false);

    const [productMessage, setProductMessage] = useState('');
    const [productSuccess, setProductSuccess] = useState(false);

    const [formData, setFormData] = useState({
        shopName: '',
        bio: '',
        contactNumber: '',
        address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
        },
    });

    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        stock: '',
        discount: '',
    });

    const [categories, setCategories] = useState([]);
    const [categoryExists, setCategoryExists] = useState(false);
    const [editProductId, setEditProductId] = useState(null);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${API_URL}/artisan/me`, {
                withCredentials: true,
            });

            const artisan = res.data;
            if (!artisan) {
                console.warn('Artisan profile not found');
                setProfile(null);
                return;
            }
            setProfile(artisan);

            setFormData({
                shopName: artisan.shopName || '',
                bio: artisan.bio || '',
                contactNumber: artisan.contactNumber || '',
                address: {
                    street: artisan.address?.street || '',
                    city: artisan.address?.city || '',
                    state: artisan.address?.state || '',
                    postalCode: artisan.address?.postalCode || '',
                    country: artisan.address?.country || '',
                },
            });
        } catch (err) {
            console.error('Error fetching profile:', err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API_URL}/product/categories`, {
                withCredentials: true,
            });
            setCategories(res.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const updateProfile = async () => {
        const payload = {
            shopName: formData.shopName,
            bio: formData.bio,
            contactNumber: formData.contactNumber,
            address: { ...formData.address },
        };

        try {
            if (profile?._id) {
                await axios.put(`${API_URL}/artisan/profile`, payload, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' },
                });
                showDetailsMessage('Profile updated successfully!', true);
            } else {
                await axios.put(`${API_URL}/artisan/profile`, payload, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' },
                });
                showDetailsMessage('Profile details added successfully!', true);
            }

            fetchProfile();
        } catch (err) {
            console.error('Error saving profile:', err);
            showDetailsMessage(
                err.response?.data?.message || 'Failed to save profile',
                false
            );
        }
    };

    const fetchProducts = async () => {
        if (!profile._id) return;
        try {
            const res = await axios.get(`${API_URL}/product/`, {
                withCredentials: true,
            });
            setProducts(res.data.filter((p) => p.artisanId === profile._id));
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    const handleCategoryChange = (e) => {
        const categoryName = e.target.value;
        setProductData({ ...productData, categoryName });

        const exists = categories.some(
            (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
        );
        setCategoryExists(exists);
    };

    const createProduct = async () => {
        if (
            !productData.name ||
            !productData.description ||
            !productData.price ||
            !productData.category ||
            !productData.image
        ) {
            showProductMessage('Please fill all required fields.', false);
            return;
        }

        try {
            await axios.post(`${API_URL}/product/create`, productData, {
                withCredentials: true,
            });
            resetProductForm();
            fetchProducts();
            showProductMessage('Product created successfully!', true);
        } catch (err) {
            console.error(err);
            showProductMessage(
                err.response?.data?.message || 'Failed to create product.',
                false
            );
        }
    };

    const startEditProduct = (product) => {
        setEditProductId(product._id);
        setProductData(product);
    };

    const updateProduct = async () => {
        try {
            await axios.put(
                `${API_URL}/product/${editProductId}`,
                productData,
                {
                    withCredentials: true,
                }
            );
            setEditProductId(null);
            resetProductForm();
            fetchProducts();
            showProductMessage('Product updated successfully!', true);
        } catch (err) {
            console.error(err);
            showProductMessage(
                err.response?.data?.message || 'Failed to update product.',
                false
            );
        }
    };

    const deleteProduct = async (id) => {
        try {
            await axios.delete(`${API_URL}/product/${id}`, {
                withCredentials: true,
            });
            fetchProducts();
        } catch (err) {
            console.error(err);
            showProductMessage('Failed to delete product.', false);
        }
    };

    const resetProductForm = () => {
        setProductData({
            name: '',
            description: '',
            price: '',
            category: '',
            image: '',
            stock: '',
            discount: '',
        });
        setCategoryExists(false);
    };

    const showDetailsMessage = (msg, isSuccess) => {
        setDetailsMessage(msg);
        setDetailsSuccess(isSuccess);
        setTimeout(() => setDetailsMessage(''), 3000);
    };

    const showProductMessage = (msg, isSuccess) => {
        setProductMessage(msg);
        setProductSuccess(isSuccess);
        setTimeout(() => setProductMessage(''), 3000);
    };

    useEffect(() => {
        fetchProfile();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (profile && profile._id) {
            fetchProducts();
        }
    }, [profile]);

    return (
        <div className="py-4 bgColor">
            <h1 className="mb-4 text-center title">Artisan Dashboard</h1>

            <div className="container card mb-4 shadow-sm">
                <div className="card-body">
                    <h4 className="mb-3 title">
                        {profile?._id
                            ? 'Update Profile'
                            : 'Complete Your Profile'}
                    </h4>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Shop Name"
                                value={formData.shopName}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        shopName: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Bio"
                                value={formData.bio}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        bio: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Contact Number"
                                value={formData.contactNumber}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        contactNumber: e.target.value,
                                    })
                                }
                            />
                        </div>

                        {Object.keys(formData.address).map((field) => (
                            <div className="col-md-4" key={field}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={field}
                                    value={formData.address[field]}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            address: {
                                                ...formData.address,
                                                [field]: e.target.value,
                                            },
                                        })
                                    }
                                />
                            </div>
                        ))}

                        <div className="col-12">
                            <button
                                className="btn btn-primary"
                                onClick={updateProfile}
                            >
                                Save Profile
                            </button>
                        </div>
                        {detailsMessage && (
                            <p
                                className={`${
                                    detailsSuccess
                                        ? 'text-success'
                                        : 'text-danger'
                                } mt-3`}
                            >
                                {detailsMessage}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="container card mb-4 shadow-sm">
                <div className="card-body">
                    <h4 className="mb-3 title">
                        {editProductId ? 'Update Product' : 'Create Product'}
                    </h4>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Product Name"
                                value={productData.name}
                                onChange={(e) =>
                                    setProductData({
                                        ...productData,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Description"
                                value={productData.description}
                                onChange={(e) =>
                                    setProductData({
                                        ...productData,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Price"
                                value={productData.price}
                                onChange={(e) =>
                                    setProductData({
                                        ...productData,
                                        price: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Category Name"
                                value={productData.categoryName}
                                onChange={handleCategoryChange}
                            />
                        </div>

                        {!categoryExists && (
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Category Image URL"
                                    value={productData.categoryImage}
                                    onChange={(e) =>
                                        setProductData({
                                            ...productData,
                                            categoryImage: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        )}

                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Product Image URL"
                                value={productData.image}
                                onChange={(e) =>
                                    setProductData({
                                        ...productData,
                                        image: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="col-md-4">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Stock"
                                value={productData.stock}
                                onChange={(e) =>
                                    setProductData({
                                        ...productData,
                                        stock: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Discount"
                                value={productData.discount}
                                onChange={(e) =>
                                    setProductData({
                                        ...productData,
                                        discount: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="col-12">
                            <button
                                className={`btn ${
                                    editProductId
                                        ? 'btn-warning'
                                        : 'btn-success'
                                }`}
                                onClick={
                                    editProductId
                                        ? updateProduct
                                        : createProduct
                                }
                            >
                                {editProductId ? 'Update' : 'Create'}
                            </button>
                        </div>
                        {productMessage && (
                            <p
                                className={`text-center ${
                                    productSuccess
                                        ? 'text-success'
                                        : 'text-danger'
                                } mt-3`}
                            >
                                {productMessage}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="container card shadow-sm">
                <div className="card-body">
                    <h4 className="mb-3 title">My Products</h4>
                    <div className="row">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div
                                    className="col-md-4 mb-3"
                                    key={product._id}
                                >
                                    <div className="card h-100">
                                        <img
                                            src={product.image}
                                            className="card-img-top"
                                            alt={product.name}
                                            style={{
                                                height: '200px',
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
                                                ₹{product.price}
                                            </p>
                                            <div className="d-flex gap-2">
                                                <button
                                                    className="btn btn-sm btn-warning"
                                                    onClick={() =>
                                                        startEditProduct(
                                                            product
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() =>
                                                        deleteProduct(
                                                            product._id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted">No products added yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtisanDashboard;
