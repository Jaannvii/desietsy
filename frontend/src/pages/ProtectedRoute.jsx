import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMe } from '../services/authService.js';

const ProtectedRoute = ({ children, role }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getMe();
                console.log('getMe response:', res.data);
                setUser(res?.data?.user || null);
            } catch (err) {
                console.error(
                    'Error in getMe:',
                    err.response?.data || err.message
                );
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (!user) return <Navigate to="/auth/login" replace />;
    if (role && user.role !== role) return <Navigate to="/" replace />;

    return children;
};

export default ProtectedRoute;
