import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";

export const PasswordResetRequest = () => {
    const [email, setEmail] = useState("");
    const { actions } = useContext(Context);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await actions.requestPasswordReset(email);
    };

    return (
        <div className="container">
            <h2>Recuperar Contraseña</h2>
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
                <button type="submit" className="btn btn-primary">Enviar</button>
            </form>
        </div>
    );
};
