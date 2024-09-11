import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import logo from '../../img/logo.png';
import SearchBar from "./searchbar";

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
            <div className="container d-flex justify-content-between align-items-center">
                <Link to="/">
                    <img src={logo} alt="Logo" style={{ width: "110px" }} className="navbar-brand" />
                </Link>
                <div className="d-flex d-sm-none align-items-center">
                    {store.isLoggedIn ? (
                        <>
                            <Link to="/profilepage">
                                <img
                                    src={store.currentUser.profile_image || '/default-profile.png'} // Ruta a la imagen del perfil
                                    alt="Profile"
                                    className="rounded-circle"
                                    style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px' }}
                                />
                            </Link>
                            <button
                                onClick={handleLogout}
                                style={{ border: 'none', background: 'transparent', padding: '0' }} // Quitar borde negro
                            >
                                <img src="https://cdn3.iconfinder.com/data/icons/basicolor-essentials/24/029_logout-512.png"
                                    alt="Logout"
                                    className="rounded-circle"
                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                            </button>
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

                <div className="d-flex align-items-center">
                    <Link to="/" className="nav-link text-black mx-2">Home</Link>
                    <Link to="/post" className="nav-link text-black mx-2">Forum</Link>
                    <Link to="/events" className="nav-link text-black mx-2">Events</Link>
                    <SearchBar />
                </div>

                <div className="d-none d-md-flex align-items-center">
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
