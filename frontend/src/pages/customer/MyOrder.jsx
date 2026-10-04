import { useEffect, useState } from "react";
import api from "../../services/api";
import {Link} from "react-router-dom";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get("/orders/");
            setOrders(response.data);
        } catch (error) {
            setMessage(
                error.response?.data?.detail ||
                "Failed to load orders"
            );
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        return `status-badge status-${status
            .toLowerCase()
            .replaceAll("_", "-")}`;
    };

    if (loading) {
        return (
            <div className="loading">
                Loading your orders...
            </div>
        );
    }

    return (
        <div className="orders-container">

            <div className="orders-header">
                <div>
                    <p className="menu-subtitle">
                        ORDER HISTORY
                    </p>

                    <h2>My Orders</h2>

                    <p>
                        Track all your previous orders and their status.
                    </p>
                </div>
            </div>

            {message && (
                <div className="order-message">
                    {message}
                </div>
            )}

            {orders.length === 0 ? (

                <div className="empty-orders">

                    <div className="empty-orders-icon">
                        📦
                    </div>

                    <h3>No orders yet</h3>

                    <p>
                        You haven't placed any orders yet.
                    </p>

                    <Link to="/menu">
                        Explore Menu
                    </Link>

                </div>

            ) : (

                <div className="orders-list">

                    {orders.map((order) => (

                        <div
                            className="order-card"
                            key={order.id}
                        >

                            <div className="order-top">

                                <div>
                                    <span className="order-label">
                                        ORDER
                                    </span>

                                    <h3>
                                        #{order.id}
                                    </h3>
                                </div>

                                <span
                                    className={getStatusClass(
                                        order.status
                                    )}
                                >
                                    {order.status.replaceAll(
                                        "_",
                                        " "
                                    )}
                                </span>

                            </div>

                            <div className="order-details">

                                <div>
                                    <span>
                                        Order Date
                                    </span>

                                    <strong>
                                        {new Date(
                                            order.created_at
                                        ).toLocaleDateString()}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Order Time
                                    </span>

                                    <strong>
                                        {new Date(
                                            order.created_at
                                        ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Total Amount
                                    </span>

                                    <strong className="order-total">
                                        ₹{order.total_amount}
                                    </strong>
                                </div>

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}

export default MyOrders;