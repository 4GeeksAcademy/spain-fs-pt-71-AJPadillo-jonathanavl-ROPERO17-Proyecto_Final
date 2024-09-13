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
        <div className="container">
            <h2>Restablecer Contraseña</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Código de Restablecimiento</label>
                    <input
                        type="text"
                        className="form-control"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Nueva Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Restablecer Contraseña</button>
            </form>
            {successMessage && <p>{successMessage}</p>}
        </div>
    );
};
