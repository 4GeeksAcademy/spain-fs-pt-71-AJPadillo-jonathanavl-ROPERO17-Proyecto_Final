import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const PasswordResetForm = () => {
    const [email, setEmail] = useState("");
    const [resetCode, setResetCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await actions.resetPassword(email, resetCode, newPassword);
            setSuccessMessage("Contraseña restablecida");

            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (error) {
            console.error("Error al restablecer la contraseña:", error);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-4" style={{ width: '80%', maxWidth: '600px' }}>
                <div className="card-body">
                    <h2 className="card-title mb-4 text-center">Reset Password</h2>
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
                        <div className="mb-3">
                            <label htmlFor="resetCode" className="form-label">Reset Code</label>
                            <input
                                type="text"
                                id="resetCode"
                                className="form-control"
                                value={resetCode}
                                onChange={(e) => setResetCode(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Reset Password</button>
                    </form>
                    {successMessage && <p className="mt-3 text-success text-center">{successMessage}</p>}
                </div>
            </div>
        </div>
    );
};
