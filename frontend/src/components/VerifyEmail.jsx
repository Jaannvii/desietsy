import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../services/authService.js';
import '../styles/auth.css';

const VerifyEmail = () => {
    const { token } = useParams();
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const hasVerified = useRef(false);

    useEffect(() => {
        if (hasVerified.current) return;
        hasVerified.current = true;
        const verify = async () => {
            try {
                const res = await verifyEmail(token);
                const msg = res.data.message;
                if (msg === 'Email already verified') {
                    setMessage('Your email was already verified.');
                    setSuccess(true);
                } else {
                    setMessage(msg);
                    setSuccess(true);
                }
                setTimeout(() => navigate('/auth/login'), 5000);
            } catch (err) {
                setMessage(
                    err.response?.data?.message || 'Email verification failed'
                );
                setSuccess(false);
            }
        };
        verify();
    }, [token, navigate]);

    return (
        <div className="container-fluid auth-bg d-flex justify-content-center align-items-center min-vh-100">
            <div
                className="card shadow auth-card"
                style={{ width: '100%', maxWidth: '400px' }}
            >
                <h2 className="text-center mb-5 auth-title">
                    Email Verification
                </h2>
                {message && (
                    <>
                        <p
                            className={`text-center ${
                                success ? 'text-success' : 'text-danger'
                            } mt-3`}
                        >
                            {message}
                        </p>
                        {success && (
                            <p className="text-center text-primary mt-2">
                                Redirecting to login page...
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
