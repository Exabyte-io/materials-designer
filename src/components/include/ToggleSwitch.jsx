import Switch from "@mui/material/Switch";
import setClass from "classnames";
import PropTypes from "prop-types";
import React from "react";

function ToggleSwitch({ cls, color, id, title, name, checked, disabled, onStateChange }) {
    const htmlFor = "form-" + id + "-label";
    return (
        <div className={setClass("toggle-switch", cls)} data-ts-color={color}>
            <label id={id + "-label"} className="ts-label" htmlFor={htmlFor}>
                {title}
            </label>
            <Switch
                id={htmlFor}
                name={name}
                checked={checked}
                disabled={disabled}
                onChange={onStateChange}
                inputProps={{ "aria-label": "controlled" }}
            />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor={id} className="ts-helper" />
        </div>
    );
}

ToggleSwitch.propTypes = {
    cls: PropTypes.string.isRequired,
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
