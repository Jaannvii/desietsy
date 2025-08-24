import { useState } from 'react';
import { forgotPassword } from '../services/authService.js';
import '../styles/auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await forgotPassword({ email });
            setMessage(res.data.message);
            setSuccess(true);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Something went wrong');
            setSuccess(false);
        }
    };

    return (
        <div className="container-fluid auth-bg d-flex justify-content-center align-items-center min-vh-100">
            <div
                className="card shadow auth-card"
                style={{ width: '100%', maxWidth: '400px' }}
            >
                <h2 className="text-center mb-4 auth-title">Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            className="form-control"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        className="btn btn-primary w-100 mb-2"
                        type="submit"
                    >
                        Send Reset Link
                    </button>
                    {message && (
                        <p
                            className={`text-center ${
                                success ? 'text-success' : 'text-danger'
                            } mt-3`}
                        >
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
