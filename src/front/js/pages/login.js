import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // State to manage error messages
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Reset error message before attempting login
        const logged = await actions.login(email, password);
        if (logged) {
            navigate("/");
        } else {
            setError("Username or password is incorrect."); // Set error message if login fails
        }
        setEmail("");
        setPassword("");
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4" style={{ maxWidth: '500px', width: '100%' }}>
                <div className="card-body">
                    <h2 className="m-auto text-center display-4 mb-4">Login</h2>
                    {error && <div className="alert alert-danger">{error}</div>} {/* Display error message */}
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                id="exampleInputEmail1"
                                aria-describedby="emailHelp"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="exampleInputPassword1"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Submit</button>
                        <div className="mt-3 text-center">
                            <a href="/forgot-password" className="btn btn-link">Forgot Password?</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
