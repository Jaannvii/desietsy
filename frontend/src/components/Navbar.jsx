import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/home.css';

const fetchUserProfile = async (userId) => {
    const API_URL = import.meta.env.VITE_API_URL;
    try {
        const response = await axios.get(`${API_URL}/auth/role/${userId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user profile', error);
    }
};

const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            let userObj = null;
            try {
                userObj = JSON.parse(storedUser);
            } catch {
                userObj = null;
            }

            if (userObj) {
                if (!userObj.role) {
                    fetchUserProfile(userObj.id).then((fullUser) => {
                        if (fullUser) {
                            const mergedUser = { ...userObj, ...fullUser };
                            setUser(mergedUser);
                            localStorage.setItem(
                                'user',
                                JSON.stringify(mergedUser)
                            );
                        } else {
                            setUser(userObj);
                        }
                    });
                } else {
                    setUser(userObj);
                }
            } else {
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, []);

    if (user === undefined) {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
                <Link className="navbar-brand fw-bold title" to="/">
                    DesiEtsy
                </Link>
            </nav>
        );
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    console.log('user role:', user?.role);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
            <Link className="navbar-brand fw-bold title" to="/">
                DesiEtsy
            </Link>

            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto align-items-center">
                    <li className="nav-item">
                        <Link className="nav-link navbar-link" to="#products">
                            Products
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link navbar-link" to="#about">
                            About Us
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link navbar-link" to="#contact">
                            Contact Us
                        </Link>
                    </li>

                    {user ? (
                        <>
                            <li className="nav-item me-3">
                                <Link to="/cart" className="nav-link fs-4">
                                    🛒
                                </Link>
                            </li>

                            <li className="nav-item dropdown">
                                <button
                                    className="btn btn-primary dropdown-toggle"
                                    type="button"
                                    id="profileDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {user.name || 'Profile'}
                                </button>
                                <ul
                                    className="dropdown-menu dropdown-menu-end"
                                    aria-labelledby="profileDropdown"
                                >
                                    {user.role === 'User' && (
                                        <>
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/order/tracking"
                                                >
                                                    Track Order
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/past-history"
                                                >
                                                    Past History
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                    {user.role === 'Artisan' && (
                                        <>
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/artisan/dashboard"
                                                >
                                                    Artisan Dashboard
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                    {user.role === 'Admin' && (
                                        <>
                                            <li>
                                                <Link
                                                    className="dropdown-item"
                                                    to="/admin/dashboard"
                                                >
                                                    Admin Dashboard
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                        <button
                                            className="dropdown-item text-danger"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item me-2">
                                <Link
                                    to="/auth/login"
                                    className="btn btn-primary"
                                >
                                    Login
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
