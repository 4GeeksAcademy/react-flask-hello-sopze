import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import injectContext from "./store/appContext";

import Session from "./pages/Session.js";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

const Layout = () => {
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <BrowserRouter basename={basename}>
            <ScrollToTop>
                <Routes>
                    <Route path="/"  element={<Home />}/>
                    {
                        ["signup", "login", "logout", "unsign"].map(e=>
                            <Route key={`route-${e}`} path={`/${e}`} element={<Session mode={e} />} />
                        )
                    }
                    <Route path="/private" element={<Demo />} />
                    <Route path="/admin" element={<Demo />} />
                    <Route element={<h1>Not found!</h1>} />
                </Routes>
            </ScrollToTop>
        </BrowserRouter>
    );
};

export default injectContext(Layout);
