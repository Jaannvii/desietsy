import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const UserDashboard = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        const res = await axios.get(`${API_URL}/order`, {
            withCredentials: true,
        });
        setOrders(res.data);
    };

    const cancelOrder = async (id) => {
        await axios.delete(`${API_URL}/order/${id}`, { withCredentials: true });
        fetchOrders();
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusSteps = (status) => {
        const steps = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
        return steps.map((step, index) => (
            <span
                key={index}
                style={{
                    marginRight: '10px',
                    color: status === step ? 'green' : 'gray',
                }}
            >
                {step} {status === step && '✔'}
            </span>
        ));
    };

    return (
        <div>
            <h1>User Dashboard</h1>
            <ul>
                {orders.map((order) => (
                    <li key={order._id}>
                        <div>
                            <strong>Order #{order._id}</strong>
                            <div>
                                Status Tracking: {getStatusSteps(order.status)}
                            </div>
                            {order.status !== 'Delivered' &&
                                order.status !== 'Cancelled' && (
                                    <button
                                        onClick={() => cancelOrder(order._id)}
                                    >
                                        Cancel
                                    </button>
                                )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserDashboard;
