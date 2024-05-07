import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import injectContext from "./store/appContext";

import Signin, { SIGN_MODE } from "./pages/signin";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

const Layout = () => {
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Routes>
                        <Route path="/"  element={<Home />}/>
                        <Route path="/signup" element={<Signin signmode={SIGN_MODE.signup} />}  />
                        <Route path="/login" element={<Signin signmode={SIGN_MODE.login} />}  />
                        <Route path="/logout" element={<Signin signmode={SIGN_MODE.logout} />}  />
                        <Route path="/unsign" element={<Signin signmode={SIGN_MODE.unsign} />}  />
                        <Route path="/private" element={<Demo />}  />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
