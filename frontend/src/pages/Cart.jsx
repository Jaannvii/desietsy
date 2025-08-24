import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

const Cart = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);
        calculateTotal(storedCart);
    }, []);

    const calculateTotal = (items) => {
        const totalPrice = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        setTotal(totalPrice);
    };

    const increaseQuantity = (index) => {
        const updatedCart = [...cart];
        updatedCart[index].quantity += 1;
        setCart(updatedCart);
        calculateTotal(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const decreaseQuantity = (index) => {
        const updatedCart = [...cart];
        if (updatedCart[index].quantity > 1) {
            updatedCart[index].quantity -= 1;
            setCart(updatedCart);
            calculateTotal(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };

    const removeItem = (index) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
        calculateTotal(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const proceedToCheckout = () => {
        localStorage.setItem('checkoutTotal', total);
        navigate('/checkout');
    };

    return (
        <div className="py-4 bgColor">
            <h1 className="text-center mb-4 title">Your Cart</h1>
            {cart.length === 0 ? (
                <p className="text-center text-muted">Your cart is empty</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="table-dark">
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>₹{item.price}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() =>
                                                decreaseQuantity(index)
                                            }
                                        >
                                            -
                                        </button>
                                        <span className="mx-2">
                                            {item.quantity}
                                        </span>
                                        <button
                                            className="btn btn-sm btn-secondary"
                                            onClick={() =>
                                                increaseQuantity(index)
                                            }
                                        >
                                            +
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => removeItem(index)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="text-end">
                        <h4>Total: ₹{total}</h4>
                        <button
                            className="btn btn-primary mt-3"
                            onClick={proceedToCheckout}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
