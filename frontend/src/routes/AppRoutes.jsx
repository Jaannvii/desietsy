import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import AdminDashboard from '../components/Dashboards/AdminDashboard.jsx';
import ArtisanDashboard from '../components/Dashboards/ArtisanDashboard.jsx';
import UserDashboard from '../components/Dashboards/UserDashboard.jsx';
import Login from '../components/Login.jsx';
import Register from '../components/Register.jsx';
import ForgotPassword from '../components/ForgotPassword.jsx';
import ResetPassword from '../components/ResetPassword.jsx';
import VerifyEmail from '../components/VerifyEmail.jsx';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route
                path="/auth/reset-password/:token"
                element={<ResetPassword />}
            />
            <Route path="/auth/verify-email/:token" element={<VerifyEmail />} />

            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute role="Admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/artisan/dashboard"
                element={
                    <ProtectedRoute role="Artisan">
                        <ArtisanDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/user/dashboard"
                element={
                    <ProtectedRoute role="User">
                        <UserDashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes;
