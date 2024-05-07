//import react into the bundle
import React from "react";
import ReactDOM from "react-dom";

//import your own components
import Layout from "./layout";

import "../styles/index.css"

//render your react application
ReactDOM.render(<Layout />, document.querySelector("#app"));
