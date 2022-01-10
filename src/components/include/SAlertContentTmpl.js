import PropTypes from "prop-types";
import React from "react";

export class SAlertContentTmpl extends React.Component {
    render() {
        return (
            <div
                id={this.props.id}
                style={this.props.styles}
                className={`alert alert-${this.props.condition} ${this.props.classNames} growl-animated animated`}
            >
                <button
                    data-growl="dismiss"
                    className="close s-alert-close"
                    onClick={this.props.handleClose}
                />
                <span>{this.props.message}</span>
            </div>
        );
    }
}

SAlertContentTmpl.propTypes = {
    id: PropTypes.string.isRequired,
    classNames: PropTypes.string.isRequired,
    condition: PropTypes.string.isRequired,
    styles: PropTypes.object.isRequired,
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    handleClose: PropTypes.func.isRequired,
    customFields: PropTypes.object,
};
