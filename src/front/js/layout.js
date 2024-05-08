import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import injectContext from "./store/appContext";

import Navbar from "./component/navbar.js";
import Listener from "./component/listener.js";

import Home from "./pages/home.js";
import Session from "./pages/session.js";
import Private from "./pages/private.js";
import Admin from "./pages/admin.js";

const Layout = () => {
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <BrowserRouter basename={basename}>
            <Navbar />
                <ScrollToTop>
                    <Routes>
                        <Route path="/"  element={<Home />}/>
                        <Route path="/home"  element={<Home />}/>
                        {
                            ["signup", "login", "logout", "unsign"].map(e=>
                                <Route key={`route-${e}`} path={`/${e}`} element={<Session mode={e} />} />
                            )
                        }
                        <Route path="/private" element={<Private />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                </ScrollToTop>
            <Listener />
        </BrowserRouter>
    );
};

export default injectContext(Layout);
