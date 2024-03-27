import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Switch from "@mui/material/Switch";
import PropTypes from "prop-types";
import React from "react";
const ToggleSwitch = function ToggleSwitch({ color, id, title, name, checked, disabled, onStateChange, }) {
    const htmlFor = "form-" + id + "-label";
    return (_jsxs("div", { "data-ts-color": color, children: [_jsx("label", { id: id + "-label", htmlFor: htmlFor, children: title }), _jsx(Switch, { id: htmlFor, name: name, checked: checked, disabled: disabled, onChange: onStateChange, inputProps: { "aria-label": "controlled" } })] }));
};
ToggleSwitch.propTypes = {
    color: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onStateChange: PropTypes.func.isRequired,
    checked: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    disabled: PropTypes.bool,
};
ToggleSwitch.defaultProps = {
    name: "",
    disabled: false,
};
export default ToggleSwitch;
