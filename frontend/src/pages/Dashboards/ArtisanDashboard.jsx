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

    const [productDeleteMessage, setProductDeleteMessage] = useState('');
    const [productDeleteSuccess, setProductDeleteSuccess] = useState('false');

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
        categoryName: '',
        categoryImage: '',
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
            setDetailsMessage('Error fetching profile');
            setDetailsSuccess(false);
        } finally {
            setTimeout(() => {
                setDetailsMessage('');
                setDetailsSuccess(null);
            }, 3000);
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
                setDetailsMessage('Profile updated successfully!');
                setDetailsSuccess(true);
            } else {
                await axios.put(`${API_URL}/artisan/profile`, payload, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' },
                });
                setDetailsMessage('Profile details added successfully!');
                setDetailsSuccess(true);
            }

            fetchProfile();
        } catch (err) {
            setDetailsMessage('Failed to save profile');
            setDetailsSuccess(false);
        } finally {
            setTimeout(() => {
                setDetailsMessage('');
                setDetailsSuccess(null);
            }, 3000);
        }
    };

    const fetchProducts = async () => {
        if (!profile._id) return;
        try {
            const res = await axios.get(`${API_URL}/product/`, {
                withCredentials: true,
            });
            setProducts(res.data);
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

        if (exists) {
            const cat = categories.find(
                (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
            );
            setProductData((prev) => ({ ...prev, categoryImage: cat.image }));
        } else {
            setProductData((prev) => ({ ...prev, categoryImage: '' }));
        }
    };

    const createProduct = async () => {
        if (
            !productData.name ||
            !productData.description ||
            !productData.price ||
            !productData.categoryName ||
            !productData.image
        ) {
            setProductMessage('Please fill all required fields.');
            setProductSuccess(false);
            return;
        }

        const payload = {
            name: productData.name.trim(),
            description: productData.description.trim(),
            price: Number(productData.price),
            image: productData.image.trim(),
            stock: productData.stock ? Number(productData.stock) : 0,
            discount: productData.discount ? Number(productData.discount) : 0,
            categoryName: productData.categoryName.trim(),
            categoryImage: categoryExists
                ? null
                : productData.categoryImage.trim(),
        };

        try {
            await axios.post(`${API_URL}/product/create`, payload, {
                withCredentials: true,
            });
            resetProductForm();
            fetchProducts();
            setProductMessage(
                'Product created successfully! Awaiting admin approval.'
            );
            setProductSuccess(true);
        } catch (err) {
            const msg =
                err.response?.data?.message || 'Failed to create product.';
            if (err.response?.status === 400) {
                setProductMessage(msg);
                setProductSuccess(false);
            } else if (err.response?.status === 403) {
                setProductMessage(msg);
                setProductSuccess(false);
            } else {
                setProductMessage('Failed to create product.');
                setProductSuccess(false);
            }
        } finally {
            setTimeout(() => {
                setProductMessage('');
                setProductSuccess(null);
            }, 3000);
        }
    };

    const startEditProduct = (product) => {
        const categoryObj = product.category;
        setEditProductId(product._id);
        setProductData({
            name: product.name,
            description: product.description,
            price: product.price,
            categoryName: categoryObj?.categoryName || '',
            categoryImage: categoryObj?.categoryImage || '',
            image: product.image,
            stock: product.stock,
            discount: product.discount,
        });
        setCategoryExists(!!categoryObj);
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
            setProductMessage('Product updated successfully!');
            setProductSuccess(true);
        } catch (err) {
            setProductMessage('Failed to update product.');
            setProductSuccess(false);
        } finally {
            setTimeout(() => {
                setProductMessage('');
                setProductSuccess(null);
            }, 3000);
        }
    };

    const deleteProduct = async (id) => {
        try {
            if (!window.confirm('Delete this product?')) return;
            await axios.delete(`${API_URL}/product/delete/${id}`, {
                withCredentials: true,
            });
            setProductDeleteMessage('Product deleted successfully!');
            setProductDeleteSuccess(true);
            fetchProducts();
        } catch (err) {
            setProductDeleteMessage('Failed to delete product.');
            setProductDeleteSuccess(false);
        } finally {
            setTimeout(() => {
                setProductDeleteMessage('');
                setProductDeleteSuccess(null);
            }, 3000);
        }
    };

    const resetProductForm = () => {
        setProductData({
            name: '',
            description: '',
            price: '',
            categoryName: '',
            categoryImage: '',
            image: '',
            stock: '',
            discount: '',
        });
        setCategoryExists(false);
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
                                className={`text-center ${
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
                                        price: e.target.valueAsNumber,
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

                        {!categoryExists || editProductId ? (
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
                        ) : null}

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
                                        discount: e.target.valueAsNumber,
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
                    {productDeleteMessage && (
                        <p
                            className={`text-center ${
                                productDeleteSuccess
                                    ? 'text-success'
                                    : 'text-danger'
                            } mt-3`}
                        >
                            {productDeleteMessage}
                        </p>
                    )}
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
