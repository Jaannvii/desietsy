import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/home.css';

const API_URL = import.meta.env.VITE_API_URL;

const PastHistory = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_URL}/order/`, {
                withCredentials: true,
            });

            const historyOrders = res.data.orders.filter(
                (o) => o.orderStatus === 'Delivered'
            );
            setOrders(historyOrders);
        } catch (err) {
            console.error('Error fetching past history:', err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="bgColor">
            <div className="container">
                <h1 className="py-4 text-center title">Past Orders</h1>

                {orders.length === 0 ? (
                    <p className="text-center text-muted">
                        No delivered orders yet.
                    </p>
                ) : (
                    <div className="d-flex flex-column gap-4">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="p-5 bg-white rounded-3 shadow-sm"
                            >
                                <p className="fw-bold text-secondary">
                                    Order ID: {order._id}
                                </p>

                                {order.products.map((item) => (
                                    <div
                                        key={item._id}
                                        className="d-flex align-items-center mb-3"
                                    >
                                        <img
                                            src={item.productId?.image}
                                            alt={item.productId?.name}
                                            className="rounded me-3"
                                            style={{
                                                width: '150px',
                                                height: '100px',
                                                objectFit: 'cover',
                                            }}
                                        />
                                        <div>
                                            <h5 className="mb-1">
                                                {item.productId?.name}
                                            </h5>
                                            <p className="text-muted mb-0">
                                                Qty: {item.quantity}
                                            </p>
                                            <p className="text-muted mb-0">
                                                Price: ₹
                                                {item.productId
                                                    ?.discountedPrice ||
                                                    item.productId?.price}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                <hr />
                                <div className="d-flex justify-content-between align-items-center">
                                    <p className="fw-bold mb-0">
                                        Total: ₹{order.totalAmount}
                                    </p>
                                    <p className="text-muted small mb-0">
                                        Ordered At:{' '}
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PastHistory;
