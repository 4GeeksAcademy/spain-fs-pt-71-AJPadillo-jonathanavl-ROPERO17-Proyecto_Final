import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";

import { Login } from "./pages/login";
import { Signup } from "./pages/signup";
import { ForgotPassword } from "./pages/password_reset/ForgotPassword";
import { ResetPasswordForm } from "./pages/password_reset/ResetPasswordForm";
import { ProfilePage } from "./pages/profilepage";
import { GameDetailsPage } from "./pages/GameDetailsPage";
import { Events } from "./pages/events";
import { PostPage } from "./pages/postpage";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import '../styles/home.css';

const Layout = () => {
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div className="app-background">
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Signup />} path="/signup" />
                        <Route element={<ForgotPassword/>} path="/ForgotPassword"/>
                        <Route path="/reset-password-form/:token" element={<ResetPasswordForm />} />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<ProfilePage />} path="/profilepage" />
                        <Route element={<Events />} path="/events" />
                        <Route element={<PostPage />} path="/post" />
                        <Route element={<GameDetailsPage />} path="/game/:gameId" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
