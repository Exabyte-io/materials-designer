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
    id: React.PropTypes.string.isRequired,
    classNames: React.PropTypes.string.isRequired,
    condition: React.PropTypes.string.isRequired,
    styles: React.PropTypes.object.isRequired,
    message: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]).isRequired,
    handleClose: React.PropTypes.func.isRequired,
    customFields: React.PropTypes.object,
};
