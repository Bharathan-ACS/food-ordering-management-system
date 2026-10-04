import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/login");
    };

    return (
        <nav className="navbar">

            <div className="navbar-brand">
                <Link to="/">Food Ordering App</Link>
            </div>

            <div className="navbar-links">

                <Link to="/menu">
                    Menu
                </Link>

                {token && role?.toLowerCase() === "customer" && (
                    <>
                        <Link to="/cart">
                            Cart
                        </Link>

                        <Link to="/my-orders">
                            My Orders
                        </Link>
                    </>
                )}

                {token && role?.toLowerCase() === "admin" && (
                    <Link to="/admin">
                        Dashboard
                    </Link>
                )}

                {!token && (
                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>
                    </>
                )}

                {token && (
                    <button onClick={logout}>
                        Logout
                    </button>
                )}

            </div>

        </nav>
    );
}

export default Navbar;