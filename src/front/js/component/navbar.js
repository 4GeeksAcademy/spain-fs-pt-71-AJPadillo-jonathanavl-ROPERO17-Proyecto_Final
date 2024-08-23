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
                    {store.isLoggedIn && (
                        <p className="mb-0 mx-3">Hello, {store.currentUser.email}</p>
                    )}
                    {/* Botones de inicio de sesión/registro o cerrar sesión según el estado de autenticación */}
                    {!store.isLoggedIn ? (
                        <>
                            <Link to="/login">
                                <button className="btn btn-outline-primary mx-2">Login</button>
                            </Link>
                            <Link to="/signup">
                                <button className="btn btn-outline-secondary">Sign Up</button>
                            </Link>
                        </>
                    ) : (
                        <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                    )}
                </div>
            </div>
        </nav>
    );
};