import setClass from "classnames";
import $ from "jquery";
import React from "react";

const ToggleSwitch = function (props) {
    return (
        <div className={setClass("toggle-switch", props.class)} data-ts-color={props.color}>
            <label id={props.id + "-label"} className="ts-label">
                {props.title}
            </label>
            <input
                id={props.id}
                type="checkbox"
                name={props.name}
                checked={props.checked}
                disabled={props.disabled}
                onChange={(e) => {
                    props.onStateChange($(e.target).is(":checked"));
                }}
            />
            <label htmlFor={props.id} className="ts-helper" />
        </div>
    );
};

export default ToggleSwitch;
