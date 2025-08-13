import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/home.css';

const API_URL = import.meta.env.VITE_API_URL;

const OrderTracking = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        const res = await axios.get(`${API_URL}/order`, {
            withCredentials: true,
        });
        const activeOrders = res.data.filter(
            (order) =>
                order.status !== 'Delivered' && order.status !== 'Cancelled'
        );
        setOrders(activeOrders);
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
                className={status === step ? 'active-step' : 'inactive-step'}
            >
                {step} {status === step && '✔'}
            </span>
        ));
    };

    return (
        <div className="py-4 bgColor">
            <h1 className="mb-4 text-center title">Track your Order</h1>
            {orders.length === 0 ? (
                <p className="text-muted text-center">No active orders.</p>
            ) : (
                <div className="row">
                    {orders.map((order) => (
                        <div className="col-md-6 col-lg-4 mb-4" key={order._id}>
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        Order #{order._id}
                                    </h5>
                                    <p>
                                        Status:{' '}
                                        <span className="text-primary">
                                            {getStatusSteps(order.status)}
                                        </span>
                                    </p>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => cancelOrder(order._id)}
                                    >
                                        Cancel Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderTracking;
