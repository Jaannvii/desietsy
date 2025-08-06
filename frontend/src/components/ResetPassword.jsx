import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/authService.js';

const ResetPassword = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await resetPassword(token, { newPassword });
            setMessage(res.data.message);
            setTimeout(() => navigate('/auth/login'), 5000);
        } catch (err) {
            setMessage(
                err.response?.data?.message || 'Error resetting password'
            );
        }
    };

    return (
        <div className="container-fluid auth-bg d-flex justify-content-center align-items-center min-vh-100">
            <div
                className="card shadow auth-card"
                style={{ width: '100%', maxWidth: '400px' }}
            >
                <h2 className="text-center mb-4 auth-title">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            className="form-control"
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100 mb-2"
                    >
                        Reset Password
                    </button>
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
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
