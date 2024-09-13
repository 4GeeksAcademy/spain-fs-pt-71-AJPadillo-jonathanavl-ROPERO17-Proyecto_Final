import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        const userCreated = await actions.createUser(username, email, password);
        if (userCreated) {
            console.log("Usuario creado");
            const loginSuccess = await actions.login(username, password);
            if (loginSuccess) {
                console.log("Logeado con éxito");
                navigate('/');
            } else {
                console.log("Fallo al iniciar sesión");
            }
        } else {
            console.log("Fallo al crear el usuario");
        }
    };

    return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4" style={{ maxWidth: '500px', width: '100%' }}>
            <div className="card-body">
                <h2 className="m-auto text-center display-4 mb-4">Signup</h2>
                <form onSubmit={handleSignup}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
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
                </form>
            </div>
        </div>
    </div>
);
};