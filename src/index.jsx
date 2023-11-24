// Load styling, bootstrap needs to be loaded first
import "bootstrap/dist/css/bootstrap.css";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/stackslide.css";
import "@exabyte-io/wave.js/dist/stylesheets/main.css";
import "./stylesheets/main.scss";

// eslint-disable-next-line import/no-unresolved
import data from "@exabyte-io/standata/lib/runtime_data/materials";
import React from "react";
import ReactDOM from "react-dom";

import { MaterialsDesignerContainer } from "./MaterialsDesignerContainer";

const materials = Object.values(data.filesMapByName);
/*
 * Set timeout to ensure Codemirror CSS is loaded: https://github.com/graphql/graphiql/issues/33#issuecomment-318188555
 * CSS is loaded in the component using CodeMirror (eg. `Basis`).
 */
setTimeout(() => {
    // Store component reference in window to access it in console for debugging/tests purposes
    // eslint-disable-next-line react/no-render-return-value
    window.MDContainer = ReactDOM.render(
        <MaterialsDesignerContainer defaultMaterialsSet={materials} />,
        document.getElementById("root"),
    );
}, 0);
