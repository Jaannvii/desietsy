import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
    const [artisans, setArtisans] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    const fetchArtisans = async () => {
        const res = await axios.get(`${API_URL}/admin/artisans`, {
            withCredentials: true,
        });
        setArtisans(res.data);
    };

    const verifyArtisan = async (id) => {
        await axios.put(
            `${API_URL}/admin/verify-artisan/${id}`,
            {},
            { withCredentials: true }
        );
        fetchArtisans();
    };

    const fetchProducts = async () => {
        const res = await axios.get(`${API_URL}/admin/products`, {
            withCredentials: true,
        });
        setProducts(res.data);
    };

    const approveProduct = async (id) => {
        await axios.put(
            `${API_URL}/admin/approve-product/${id}`,
            {},
            { withCredentials: true }
        );
        fetchProducts();
    };

    const deleteProduct = async (id) => {
        await axios.delete(`${API_URL}/product/${id}`, {
            withCredentials: true,
        });
        fetchProducts();
    };

    const fetchOrders = async () => {
        const res = await axios.get(`${API_URL}/admin/orders`, {
            withCredentials: true,
        });
        setOrders(res.data);
    };

    const updateOrderStatus = async (id, status) => {
        await axios.put(
            `${API_URL}/order/${id}/status`,
            { status },
            { withCredentials: true }
        );
        fetchOrders();
    };

    const deleteOrder = async (id) => {
        await axios.delete(`${API_URL}/order/${id}`, { withCredentials: true });
        fetchOrders();
    };

    useEffect(() => {
        fetchArtisans();
        fetchProducts();
        fetchOrders();
    }, []);

    return (
        <div>
            <h1>Admin Dashboard</h1>

            <section>
                <h2>Artisans</h2>
                <ul>
                    {artisans.map((artisan) => (
                        <li key={artisan._id}>
                            {artisan.shopName || 'No shop name'} - Verified:{' '}
                            {artisan.isVerified ? '✅' : '❌'}
                            {!artisan.isVerified && (
                                <button
                                    onClick={() => verifyArtisan(artisan._id)}
                                >
                                    Verify
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Products</h2>
                <ul>
                    {products.map((product) => (
                        <li key={product._id}>
                            {product.name} - Approved:{' '}
                            {product.isApproved ? '✅' : '❌'}
                            <button onClick={() => deleteProduct(product._id)}>
                                Delete
                            </button>
                            {!product.isApproved && (
                                <button
                                    onClick={() => approveProduct(product._id)}
                                >
                                    Approve
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Orders</h2>
                <ul>
                    {orders.map((order) => (
                        <li key={order._id}>
                            Order #{order._id} - Status: {order.status}
                            <select
                                value={order.status}
                                onChange={(e) =>
                                    updateOrderStatus(order._id, e.target.value)
                                }
                            >
                                <option value="Pending">Pending</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            <button onClick={() => deleteOrder(order._id)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default AdminDashboard;
