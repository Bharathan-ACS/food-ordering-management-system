import { useEffect, useState } from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await api.get("/cart/");
            setCart(response.data);
        } catch (error) {
            setMessage(
                error.response?.data?.detail ||
                "Failed to load cart"
            );
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1) return;

        try {
            await api.put(`/cart/items/${itemId}`, {
                quantity
            });

            fetchCart();
        } catch (error) {
            setMessage(
                error.response?.data?.detail ||
                "Failed to update cart"
            );
        }
    };

    const removeItem = async (itemId) => {
        try {
            await api.delete(`/cart/items/${itemId}`);

            setMessage("Item removed from cart");

            fetchCart();

        } catch (error) {
            setMessage(
                error.response?.data?.detail ||
                "Failed to remove item"
            );
        }
    };

    const placeOrder = async () => {
        try {
            const response = await api.post("/orders/");

            setMessage(
                `Order #${response.data.id} placed successfully!`
            );

            fetchCart();

        } catch (error) {
            setMessage(
                error.response?.data?.detail ||
                "Failed to place order"
            );
        }
    };

    if (loading) {
        return (
            <div className="loading">
                Loading your cart...
            </div>
        );
    }

    return (
        <div className="cart-container">

            <div className="cart-header">
                <div>
                    <p className="menu-subtitle">
                        YOUR ORDER
                    </p>

                    <h2>Shopping Cart</h2>

                    <p>
                        Review your items before placing your order.
                    </p>
                </div>
            </div>

            {message && (
                <div className="cart-message">
                    {message}
                </div>
            )}

            {!cart || cart.items.length === 0 ? (

                <div className="empty-cart">

                    <h3>Your cart is empty</h3>

                    <p>
                        Add some delicious food from the menu.
                    </p>

                    <Link to='/menu'>
                        Browse menu 
                    </Link>

                </div>

            ) : (

                <div className="cart-layout">

                    <div className="cart-items">

                        {cart.items.map((item) => (

                            <div
                                className="cart-item"
                                key={item.id}
                            >

                                <div className="cart-food-icon">
                                    🍛
                                </div>

                                <div className="cart-item-info">

                                    <h3>
                                        {item.name}
                                    </h3>

                                    <p>
                                        ₹{item.price} per item
                                    </p>

                                    <strong>
                                        ₹{item.subtotal}
                                    </strong>

                                </div>

                                <div className="cart-actions">

                                    <div className="quantity-control">

                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity - 1
                                                )
                                            }
                                            disabled={
                                                item.quantity <= 1
                                            }
                                        >
                                            −
                                        </button>

                                        <span>
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity + 1
                                                )
                                            }
                                        >
                                            +
                                        </button>

                                    </div>

                                    <button
                                        className="remove-btn"
                                        onClick={() =>
                                            removeItem(item.id)
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                    {/* Order Summary */}

                    <div className="cart-summary">

                        <h3>Order Summary</h3>

                        <div className="summary-row">
                            <span>Items</span>
                            <span>
                                {cart.items.length}
                            </span>
                        </div>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>
                                ₹{cart.total}
                            </span>
                        </div>

                        <div className="summary-row">
                            <span>Delivery</span>
                            <span>Free</span>
                        </div>

                        <hr />

                        <div className="summary-total">
                            <span>Total</span>
                            <strong>
                                ₹{cart.total}
                            </strong>
                        </div>

                        <button
                            className="place-order-btn"
                            onClick={placeOrder}
                        >
                            Place Order
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Cart;