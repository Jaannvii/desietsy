import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/home.css';

const API_URL = import.meta.env.VITE_API_URL;

const ArtisanDashboard = () => {
    const [profile, setProfile] = useState({});
    const [products, setProducts] = useState([]);
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
    const [editProductId, setEditProductId] = useState(null);

    const fetchProfile = async () => {
        const res = await axios.get(`${API_URL}/artisan/profile`, {
            withCredentials: true,
        });
        setProfile(res.data.artisan);
        setFormData({
            shopName: res.data.artisan.shopName || '',
            bio: res.data.artisan.bio || '',
            contactNumber: res.data.artisan.contactNumber || '',
            address: {
                street: res.data.artisan.address?.street || '',
                city: res.data.artisan.address?.city || '',
                state: res.data.artisan.address?.state || '',
                postalCode: res.data.artisan.address?.postalCode || '',
                country: res.data.artisan.address?.country || '',
            },
        });
    };
    console.log('Form Data to Send:', formData);
    const updateProfile = async () => {
        const payload = {
            shopName: formData.shopName,
            bio: formData.bio,
            contactNumber: formData.contactNumber,
            address: {
                street: formData.address.street,
                city: formData.address.city,
                state: formData.address.state,
                postalCode: formData.address.postalCode,
                country: formData.address.country,
            },
        };

        await axios.put(`${API_URL}/artisan/profile`, payload, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
        });

        fetchProfile();
    };

    const fetchProducts = async () => {
        const res = await axios.get(`${API_URL}/product`, {
            withCredentials: true,
        });
        setProducts(res.data.filter((p) => p.artisanId === profile._id));
    };

    const createProduct = async () => {
        await axios.post(`${API_URL}/product/create`, productData, {
            withCredentials: true,
        });
        resetProductForm();
        fetchProducts();
    };

    const startEditProduct = (product) => {
        setEditProductId(product._id);
        setProductData(product);
    };

    const updateProduct = async () => {
        await axios.put(`${API_URL}/product/${editProductId}`, productData, {
            withCredentials: true,
        });
        setEditProductId(null);
        resetProductForm();
        fetchProducts();
    };

    const deleteProduct = async (id) => {
        await axios.delete(`${API_URL}/product/${id}`, {
            withCredentials: true,
        });
        fetchProducts();
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
    };

    useEffect(() => {
        fetchProfile();
        fetchProducts();
    }, []);

    useEffect(() => {
        if (profile._id) {
            fetchProducts();
        }
    }, [profile._id]);

    return (
        <div className="py-4 bgColor">
            <h1 className="mb-4 text-center title">Artisan Dashboard</h1>

            <div className="container card mb-4 shadow-sm">
                <div className="card-body">
                    <h4 className="mb-3 title">Update Profile</h4>
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
                    </div>
                </div>
            </div>

            <div className="container card mb-4 shadow-sm">
                <div className="card-body">
                    <h4 className="mb-3 title">
                        {editProductId ? 'Update Product' : 'Create Product'}
                    </h4>
                    <div className="row g-3">
                        {Object.keys(productData).map((field) => (
                            <div className="col-md-4" key={field}>
                                <input
                                    type={
                                        ['price', 'stock', 'discount'].includes(
                                            field
                                        )
                                            ? 'number'
                                            : 'text'
                                    }
                                    className="form-control"
                                    placeholder={
                                        field.charAt(0).toUpperCase() +
                                        field.slice(1)
                                    }
                                    value={productData[field]}
                                    onChange={(e) =>
                                        setProductData({
                                            ...productData,
                                            [field]: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        ))}
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
                    </div>
                </div>
            </div>

            <div className="container card shadow-sm">
                <div className="card-body">
                    <h4 className="mb-3 title">My Products</h4>
                    <div className="row">
                        {products.map((product) => (
                            <div className="col-md-4 mb-3" key={product._id}>
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
                                                    startEditProduct(product)
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() =>
                                                    deleteProduct(product._id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {products.length === 0 && (
                            <p className="text-muted">No products added yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtisanDashboard;
