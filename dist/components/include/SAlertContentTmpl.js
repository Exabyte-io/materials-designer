import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable jsx-a11y/label-has-associated-control, jsx-a11y/control-has-associated-label */
import PropTypes from "prop-types";
import React from "react";
const SAlertContentTmpl = function SAlertContentTmpl({ id, classNames, condition, styles, message, handleClose, }) {
    return (_jsxs("div", { id: id, style: styles, className: `alert alert-${condition} ${classNames} growl-animated animated`, children: [_jsx("button", { type: "button", "data-growl": "dismiss", className: "close s-alert-close", onClick: handleClose }), _jsx("span", { children: message })] }));
};
SAlertContentTmpl.propTypes = {
    id: PropTypes.string.isRequired,
    classNames: PropTypes.string.isRequired,
    condition: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    styles: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    handleClose: PropTypes.func.isRequired,
};
export default SAlertContentTmpl;
