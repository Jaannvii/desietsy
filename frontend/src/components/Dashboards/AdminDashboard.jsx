import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/home.css';

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
        <div className="py-4 bgColor">
            <h1 className="mb-4 text-center title">Admin Dashboard</h1>

            <section className="container mb-5">
                <h4 className="mb-3 title">Artisans</h4>
                <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle">
                        <thead>
                            <tr>
                                <th className="text-center py-2">Shop Name</th>
                                <th className="text-center py-2">Verified</th>
                                <th className="text-center py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {artisans.map((artisan) => (
                                <tr key={artisan._id}>
                                    <td>
                                        {artisan.shopName || 'No shop name'}
                                    </td>
                                    <td>{artisan.isVerified ? '✅' : '❌'}</td>
                                    <td>
                                        {!artisan.isVerified && (
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() =>
                                                    verifyArtisan(artisan._id)
                                                }
                                            >
                                                Verify
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="container mb-5">
                <h4 className="mb-3 title">Products</h4>
                <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle">
                        <thead>
                            <tr>
                                <th className="text-center py-2">Name</th>
                                <th className="text-center py-2">Approved</th>
                                <th className="text-center py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product.name}</td>
                                    <td>{product.isApproved ? '✅' : '❌'}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-danger me-2"
                                            onClick={() =>
                                                deleteProduct(product._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                        {!product.isApproved && (
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() =>
                                                    approveProduct(product._id)
                                                }
                                            >
                                                Approve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="container">
                <h4 className="mb-3 title">Orders</h4>
                <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle">
                        <thead>
                            <tr>
                                <th className="text-center py-2">Order ID</th>
                                <th className="text-center py-2">Status</th>
                                <th className="text-center py-2">
                                    Change Status
                                </th>
                                <th className="text-center py-2">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.status}</td>
                                    <td>
                                        <select
                                            className="form-select form-select-sm"
                                            value={order.status}
                                            onChange={(e) =>
                                                updateOrderStatus(
                                                    order._id,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="Pending">
                                                Pending
                                            </option>
                                            <option value="Shipped">
                                                Shipped
                                            </option>
                                            <option value="Delivered">
                                                Delivered
                                            </option>
                                            <option value="Cancelled">
                                                Cancelled
                                            </option>
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() =>
                                                deleteOrder(order._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
