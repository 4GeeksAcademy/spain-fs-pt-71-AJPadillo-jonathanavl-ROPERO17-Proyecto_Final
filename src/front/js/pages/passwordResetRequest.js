import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const PasswordResetRequest = () => {
    const [email, setEmail] = useState("");
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await actions.requestPasswordReset(email);
        navigate("/reset-password");
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow-lg" style={{ width: '80%', maxWidth: '600px' }}>
            <div className="card-body">
                <h1 className="card-title mb-4">Recovery Password</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Send</button>
                </form>
            </div>
        </div>
    </div>
);
};

