// Load styling, bootstrap needs to be loaded first
import "bootstrap/dist/css/bootstrap.css";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/stackslide.css";
import "@exabyte-io/wave.js/dist/stylesheets/main.css";
import "./stylesheets/main.scss";

import React from "react";
import ReactDOM from "react-dom";

import { MaterialsDesignerContainer } from "./MaterialsDesignerContainer";

/*
 * Set timeout to ensure Codemirror CSS is loaded: https://github.com/graphql/graphiql/issues/33#issuecomment-318188555
 * CSS is loaded in the component using CodeMirror (eg. `Basis`).
 */
setTimeout(() => {
    // Store component reference in window to access it in console for debugging/tests purposes
    window.MDContainer = ReactDOM.render(
        <MaterialsDesignerContainer />,
        document.getElementById("root"),
    );
}, 0);
