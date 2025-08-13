import { useState, useEffect } from 'react';
import { login } from '../services/authService.js';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setFormData({ email: '', password: '' });
        setMessage('');
    }, []);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(formData);

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            setMessage(res.data.message);
            setSuccess(true);

            setTimeout(() => navigate('/'), 5000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Login failed';
            setSuccess(false);
            if (errorMsg === 'Email not verified') {
                setMessage(
                    'Your email is not verified. Please check your email.'
                );
            } else {
                setMessage(errorMsg);
            }
        }
    };

    return (
        <div className="container-fluid auth-bg d-flex justify-content-center align-items-center min-vh-100">
            <div
                className="card shadow auth-card"
                style={{ width: '100%', maxWidth: '400px' }}
            >
                <h2 className="text-center mb-4 auth-title">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            className="form-control"
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-1">
                        <input
                            className="form-control"
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="text-end mb-3">
                        <Link
                            to="/auth/forgot-password"
                            className="custom-link"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                    <button
                        className="btn btn-primary w-100 mb-2"
                        type="submit"
                    >
                        Login
                    </button>
                    <div className="text-center">
                        <Link to="/auth/register" className="custom-link">
                            Don't have an account? Register
                        </Link>
                    </div>
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

export default Login;
