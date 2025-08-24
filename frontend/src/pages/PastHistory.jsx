import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/home.css';

const API_URL = import.meta.env.VITE_API_URL;

const PastHistory = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        const res = await axios.get(`${API_URL}/order`, {
            withCredentials: true,
        });
        setOrders(
            res.data.filter(
                (order) =>
                    order.status === 'Delivered' || order.status === 'Cancelled'
            )
        );
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="py-4 bgColor">
            <h2 className="mb-4 text-center title">Order History</h2>
            {orders.length === 0 ? (
                <p className="text-muted text-center">No past orders found.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle">
                        <thead>
                            <tr>
                                <th className="text-center py-2">Order ID</th>
                                <th className="text-center py-2">Status</th>
                                <th className="text-center py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>
                                        <span
                                            className={`badge ${
                                                order.status === 'Delivered'
                                                    ? 'bg-success'
                                                    : 'bg-danger'
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PastHistory;
