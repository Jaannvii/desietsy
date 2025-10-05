import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../pages/ProtectedRoute.jsx';
import AdminDashboard from '../pages/Dashboards/AdminDashboard.jsx';
import ArtisanDashboard from '../pages/Dashboards/ArtisanDashboard.jsx';
import OrderTracking from '../pages/OrderTracking.jsx';
import PastHistory from '../pages/PastHistory.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import ForgotPassword from '../pages/ForgotPassword.jsx';
import ResetPassword from '../pages/ResetPassword.jsx';
import VerifyEmail from '../pages/VerifyEmail.jsx';
import MainPage from '../pages/Home.jsx';
import Products from '../pages/Products.jsx';
import Cart from '../pages/Cart.jsx';
import Checkout from '../pages/Checkout.jsx';
import Payment from '../pages/Payment.jsx';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/products" element={<Products />} />
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
                path="/order/tracking"
                element={
                    <ProtectedRoute role="User">
                        <OrderTracking />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/past-history"
                element={
                    <ProtectedRoute role="User">
                        <PastHistory />
                    </ProtectedRoute>
                }
            />

            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />
        </Routes>
    );
};

export default AppRoutes;
