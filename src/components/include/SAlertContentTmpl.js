/* eslint-disable jsx-a11y/label-has-associated-control */
import PropTypes from "prop-types";
import React from "react";

const SAlertContentTmpl = function SAlertContentTmpl({
    id,
    classNames,
    condition,
    styles,
    message,
    handleClose,
}) {
    return (
        <div
            id={id}
            style={styles}
            className={`alert alert-${condition} ${classNames} growl-animated animated`}
        >
            <button
                type="button"
                data-growl="dismiss"
                className="close s-alert-close"
                onClick={handleClose}
            />
            <span>{message}</span>
        </div>
    );
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
