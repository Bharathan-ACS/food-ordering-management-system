import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await api.post("/auth/register", {
                username: username,
                email: email,
                password: password,
            });

            setMessage("Registration successful!");

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            setMessage(
                error.response?.data?.detail ||
                "Registration failed"
            );
        }
    };

    return (
        <div className="auth-container">

            <div className="auth-header">

                <h2>Create Account</h2>

            </div>

            {message && (
                <div className="auth-message">
                    {message}
                </div>
            )}

            <form onSubmit={handleRegister}>

                <label>Username</label>

                <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) =>
                        setUsername(e.target.value)
                    }
                    required
                />

                <label>Email</label>

                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    required
                />

                <label>Password</label>

                <input
                    type="password"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    required
                />

                <button type="submit">
                    Create Account
                </button>

            </form>

            <div className="auth-footer">
                <p>
                    Already have an account?
                    {" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>
            </div>

        </div>
    );
}

export default Register;