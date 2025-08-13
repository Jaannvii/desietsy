import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import AdminDashboard from '../components/Dashboards/AdminDashboard.jsx';
import ArtisanDashboard from '../components/Dashboards/ArtisanDashboard.jsx';
import OrderTracking from '../components/OrderTracking.jsx';
import PastHistory from '../components/PastHistory.jsx';
import Login from '../components/Login.jsx';
import Register from '../components/Register.jsx';
import ForgotPassword from '../components/ForgotPassword.jsx';
import ResetPassword from '../components/ResetPassword.jsx';
import VerifyEmail from '../components/VerifyEmail.jsx';
import MainPage from '../components/Home.jsx';
import Products from '../components/Products.jsx';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/products/:category" element={<Products />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route
                path="/auth/reset-password/:token"
                element={<ResetPassword />}
            />
            <Route path="/auth/verify-email/:token" element={<VerifyEmail />} />

            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            <Route path="/artisan/dashboard" element={<ArtisanDashboard />} />

            <Route path="/order/tracking" element={<OrderTracking />} />
            <Route path="/past-history" element={<PastHistory />} />
        </Routes>
    );
};

export default AppRoutes;
