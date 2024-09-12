
import React, { useState, useContext } from "react";
import { Context } from "../../store/appContext";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);  // Añadimos el estado isLoading
    const { actions } = useContext(Context);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsLoading(true);
        try {
            const result = await actions.forgotPassword(email);
            if (result.ok) {
                setMessage("Te hemos enviado un correo para restablecer tu contraseña.");
            } else {
                setMessage(result.message || "Hubo un error. Por favor, verifica tu correo electrónico.");
            }
        } catch (error) {
            setMessage("Hubo un error de conexión. Por favor, intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4" style={{ maxWidth: '500px', width: '100%' }}>
                <div className="card-body">
                    <h2 className="m-auto text-center display-4 mb-4">Forgot Password</h2>
                    {message && <div className="alert alert-info">{message}</div>}
                    <form onSubmit={handleForgotPassword}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                            {isLoading ? "Enviando..." : "Send Reset Link"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};