import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/auth/login", {
                email: email,
                password: password,
            });

            localStorage.setItem(
                "token",
                response.data.access_token
            );

            localStorage.setItem(
                "role",
                response.data.role
            );

            if (response.data.role.toLowerCase() === "admin") {
                navigate("/admin");
            } else {
                navigate("/menu");
            }

        } catch (error) {
            setMessage(
                error.response?.data?.detail ||
                "Login failed"
            );
        }
    };

    return (
        <div className="auth-container">

            <div className="auth-header">

                <h2>Welcome Back</h2>

            </div>

            {message && (
                <div className="auth-message">
                    {message}
                </div>
            )}

            <form onSubmit={handleLogin}>

                <label>Email</label>

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    required
                />

                <label>Password</label>

                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    required
                />

                <button type="submit">
                    Login
                </button>

            </form>

            <div className="auth-footer">
                <p>
                    Don't have an account?
                    {" "}
                    <Link to="/register">
                        Create Account
                    </Link>
                </p>
            </div>

        </div>
    );
}

export default Login;