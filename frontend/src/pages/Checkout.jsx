import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const [shippingInfo, setShippingInfo] = useState({
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    };

    const handleProceed = () => {
        localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
        navigate('/payment');
    };

    return (
        <div className="py-4 bgColor">
            <h1 className="text-center mb-4 title">Shipping Details</h1>
            <div className="container card mb-4 shadow-sm">
                <div className="card-body">
                    <div className="row g-3">
                        {[
                            'address',
                            'city',
                            'state',
                            'postalCode',
                            'country',
                        ].map((field) => (
                            <div className="col-md-6" key={field}>
                                <input
                                    type="text"
                                    className="form-control"
                                    name={field}
                                    placeholder={field.toUpperCase()}
                                    onChange={handleChange}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="col-12">
                        <button
                            className="btn btn-primary mt-3"
                            onClick={handleProceed}
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
