import { jsx as _jsx } from "react/jsx-runtime";
// Load styling, bootstrap needs to be loaded first
import "@exabyte-io/wave.js/dist/stylesheets/main.css";
import "./stylesheets/main.scss";
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
import React from "react";
import ReactDOM from "react-dom";
import { MaterialsDesignerContainer } from "./MaterialsDesignerContainer";
/*
 * Set timeout to ensure Codemirror CSS is loaded: https://github.com/graphql/graphiql/issues/33#issuecomment-318188555
 * CSS is loaded in the component using CodeMirror (eg. `Basis`).
 */
setTimeout(() => {
    // Store component reference in window to access it in console for debugging/tests purposes
    // eslint-disable-next-line react/no-render-return-value
    window.MDContainer = ReactDOM.render(_jsx(MaterialsDesignerContainer, {}), document.getElementById("root"));
}, 0);
