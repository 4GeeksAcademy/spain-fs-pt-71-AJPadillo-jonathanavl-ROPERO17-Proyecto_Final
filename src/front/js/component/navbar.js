import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import logo from '../../img/logo.png';
export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    // Manejar logout
    const handleLogout = () => {
        actions.logout();
        navigate("/");
    };

    return (
        <nav className="navbar navbar-light bg-light mb-3">
            <div className="container">
                <Link to="/">
                    <img src={logo} alt="Logo" style={{ width: "150px" }} className="navbar-brand" />
                </Link>
                <div className="d-flex ml-auto align-items-center">
                    {/* Mostrar saludo y botones de perfil y logout solo si el usuario está autenticado */}
                    {store.isLoggedIn ? (
                        <>
                            <p className="mb-0 mx-3">Hello, {store.currentUser.email}</p>
                            <Link to="/profilepage">
                                <button className="btn btn-outline-info mx-2">Profile</button>
                            </Link>
                            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <button className="btn btn-outline-primary mx-2">Login</button>
                            </Link>
                            <Link to="/signup">
                                <button className="btn btn-outline-secondary">Sign Up</button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};