import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
    const navigate = useNavigate();

    const loadRazorpay = () => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        script.onload = () => {
            const options = {
                key: 'YOUR_RAZORPAY_KEY',
                amount: localStorage.getItem('totalAmount') * 100,
                currency: 'INR',
                name: 'DesiEtsy',
                description: 'Order Payment',
                handler: function (response) {
                    alert('Payment Successful');
                    navigate('/order-confirmation');
                },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        };
    };

    useEffect(() => {
        loadRazorpay();
    }, []);

    return (
        <h4 className="text-center mt-5 text-muted">Processing Payment...</h4>
    );
};

export default Payment;
