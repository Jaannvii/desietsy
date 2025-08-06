import { useEffect, useState } from 'react';
import axios from 'axios';

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

    const artisanId = profile._id;

    const fetchProfile = async () => {
        const res = await axios.get(`${API_URL}/artisan/profile/${artisanId}`, {
            withCredentials: true,
        });
        setProfile(res.data.artisan);
        setFormData(res.data.artisan);
    };

    const updateProfile = async () => {
        await axios.put(`${API_URL}/artisan/profile/${artisanId}`, formData, {
            withCredentials: true,
        });
        fetchProfile();
    };

    const fetchProducts = async () => {
        const res = await axios.get(`${API_URL}/product`, {
            withCredentials: true,
        });
        setProducts(res.data.filter((p) => p.artisanId === artisanId));
    };

    const createProduct = async () => {
        await axios.post(`${API_URL}/product/create`, productData, {
            withCredentials: true,
        });
        setProductData({
            name: '',
            description: '',
            price: '',
            category: '',
            image: '',
            stock: '',
            discount: '',
        });
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
        setProductData({
            name: '',
            description: '',
            price: '',
            category: '',
            image: '',
            stock: '',
            discount: '',
        });
        fetchProducts();
    };

    const deleteProduct = async (id) => {
        await axios.delete(`${API_URL}/product/${id}`, {
            withCredentials: true,
        });
        fetchProducts();
    };

    useEffect(() => {
        fetchProfile();
        fetchProducts();
    }, []);

    return (
        <div>
            <h1>Artisan Dashboard</h1>

            <section>
                <h2>Update Profile</h2>
                <input
                    type="text"
                    placeholder="Shop Name"
                    value={formData.shopName}
                    onChange={(e) =>
                        setFormData({ ...formData, shopName: e.target.value })
                    }
                />
                <input
                    type="text"
                    placeholder="Bio"
                    value={formData.bio}
                    onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                    }
                />
                <input
                    type="text"
                    placeholder="Contact Number"
                    value={formData.contactNumber}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            contactNumber: e.target.value,
                        })
                    }
                />
                {Object.keys(formData.address).map((field) => (
                    <input
                        key={field}
                        type="text"
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
                ))}
                <button onClick={updateProfile}>Update Profile</button>
            </section>

            <section>
                <h2>{editProductId ? 'Update Product' : 'Create Product'}</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={productData.name}
                    onChange={(e) =>
                        setProductData({ ...productData, name: e.target.value })
                    }
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={productData.description}
                    onChange={(e) =>
                        setProductData({
                            ...productData,
                            description: e.target.value,
                        })
                    }
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={productData.price}
                    onChange={(e) =>
                        setProductData({
                            ...productData,
                            price: e.target.value,
                        })
                    }
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={productData.category}
                    onChange={(e) =>
                        setProductData({
                            ...productData,
                            category: e.target.value,
                        })
                    }
                />
                <input
                    type="text"
                    placeholder="Image URL"
                    value={productData.image}
                    onChange={(e) =>
                        setProductData({
                            ...productData,
                            image: e.target.value,
                        })
                    }
                />
                <input
                    type="number"
                    placeholder="Stock"
                    value={productData.stock}
                    onChange={(e) =>
                        setProductData({
                            ...productData,
                            stock: e.target.value,
                        })
                    }
                />
                <input
                    type="number"
                    placeholder="Discount"
                    value={productData.discount}
                    onChange={(e) =>
                        setProductData({
                            ...productData,
                            discount: e.target.value,
                        })
                    }
                />
                <button onClick={editProductId ? updateProduct : createProduct}>
                    {editProductId ? 'Update Product' : 'Create Product'}
                </button>
            </section>

            <section>
                <h2>My Products</h2>
                <ul>
                    {products.map((product) => (
                        <li key={product._id}>
                            {product.name} - ₹{product.price}
                            <button onClick={() => startEditProduct(product)}>
                                Edit
                            </button>
                            <button onClick={() => deleteProduct(product._id)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default ArtisanDashboard;
