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

    const deleteArtisan = async (id) => {
        if (
            !window.confirm(
                'Delete this artisan? This action cannot be undone.'
            )
        )
            return;
        try {
            await axios.delete(`${API_URL}/artisan/delete/${id}`, {
                withCredentials: true,
            });

            setArtisans((prev) => prev.filter((a) => a._id !== id));
        } catch (err) {
            console.error('Error deleting artisan:', err);
        }
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
        if (!window.confirm('Delete this product?')) return;
        await axios.delete(`${API_URL}/product/delete/${id}`, {
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
        try {
            await axios.put(
                `${API_URL}/order/${id}/status`,
                { orderStatus: status },
                { withCredentials: true }
            );
            setOrders((prev) =>
                prev.map((order) =>
                    order._id === id ? { ...order, orderStatus: status } : order
                )
            );
        } catch (err) {
            console.error('Error updating order status:', err);
        }
    };

    const deleteOrder = async (id) => {
        if (!window.confirm('Delete this order?')) return;
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
                                <th className="text-center py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {artisans.map((artisan) => (
                                <tr key={artisan._id}>
                                    <td className="text-center">
                                        {artisan.shopName || 'No shop name'}
                                    </td>
                                    <td className="text-center">
                                        {artisan.isVerified ? '✅' : '❌'}
                                    </td>
                                    <td className="text-center">
                                        {!artisan.isVerified && (
                                            <button
                                                className="btn btn-sm btn-success me-2"
                                                onClick={() =>
                                                    verifyArtisan(artisan._id)
                                                }
                                            >
                                                Verify
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() =>
                                                deleteArtisan(artisan._id)
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

            <section className="container mb-5">
                <h4 className="mb-3 title">Products</h4>
                <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle">
                        <thead>
                            <tr>
                                <th className="text-center py-2">
                                    Product Name
                                </th>
                                <th className="text-center py-2">Approved</th>
                                <th className="text-center py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td className="text-center">
                                        {product.name}
                                    </td>
                                    <td className="text-center">
                                        {product.isApproved ? '✅' : '❌'}
                                    </td>
                                    <td className="text-center">
                                        {!product.isApproved && (
                                            <button
                                                className="btn btn-sm btn-primary me-2"
                                                onClick={() =>
                                                    approveProduct(product._id)
                                                }
                                            >
                                                Approve
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() =>
                                                deleteProduct(product._id)
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

            <section className="container">
                <h4 className="mb-3 title">Orders</h4>
                <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle">
                        <thead>
                            <tr>
                                <th className="text-center py-2">Order ID</th>
                                <th className="text-center py-2">Item</th>
                                <th className="text-center py-2">Status</th>
                                <th className="text-center py-2">
                                    Change Status
                                </th>
                                <th className="text-center py-2">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order._id}>
                                        <td className="text-center">
                                            {order._id}
                                        </td>
                                        <td className="text-center">
                                            {order.products &&
                                            order.products.length > 0
                                                ? order.products.map((item) => (
                                                      <div
                                                          key={
                                                              item._id ||
                                                              item.productId
                                                                  ?._id
                                                          }
                                                      >
                                                          {item.productId?.name}{' '}
                                                          × {item.quantity}
                                                      </div>
                                                  ))
                                                : '—'}
                                        </td>
                                        <td className="text-center">
                                            {order.orderStatus}
                                        </td>
                                        <td className="text-center">
                                            <select
                                                className="form-select form-select-sm"
                                                value={order.orderStatus}
                                                disabled={
                                                    order.orderStatus ===
                                                        'Delivered' ||
                                                    order.orderStatus ===
                                                        'Cancelled'
                                                }
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
                                                <option value="Confirmed">
                                                    Confirmed
                                                </option>
                                                <option value="Shipped">
                                                    Shipped
                                                </option>
                                                <option value="Out for Delivery">
                                                    Out for Delivery
                                                </option>
                                                <option value="Delivered">
                                                    Delivered
                                                </option>
                                                <option value="Cancelled">
                                                    Cancelled
                                                </option>
                                            </select>
                                        </td>
                                        <td className="text-center">
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-muted">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;