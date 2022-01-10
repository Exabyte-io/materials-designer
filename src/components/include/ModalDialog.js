import setClass from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { Modal, ModalBody, ModalHeader } from "react-bootstrap";

export class ModalDialog extends React.Component {
    /**
     * @summary Rendering header in separate method, so subclasses can override it
     * @returns {ReactElement} the header element
     */
    renderHeader() {
        return (
            <ModalHeader closeButton>
                <h4 className="modal-title">{this.props.title}</h4>
            </ModalHeader>
        );
    }

    /**
     * @summary Rendering footer in separate method, so subclasses can override it
     * @returns {ReactElement} the footer element
     */
    renderFooter() {
        return null;
    }

    /**
     * @summary Rendering body in separate method, so subclasses can override it
     * @returns {ReactElement} the body element
     */
    renderBody() {
        return <ModalBody>{this.props.children}</ModalBody>;
    }

    render() {
        const className = setClass(
            this.props.className,
            this.props.isFullWidth ? "full-page-overlay" : "",
        );

        if (this.props.show) {
            document.body.classList.add("modal-backdrop-color-" + this.props.backdropColor);
        }

        // animations are disabled to avoid problems with automated tests
        return (
            <Modal
                id={this.props.modalId}
                animation={false}
                show={this.props.show}
                onHide={(e) => {
                    this.props.onHide(e);
                    document.body.classList.remove(
                        "modal-backdrop-color-" + this.props.backdropColor,
                    );
                }}
                className={className}
            >
                {this.renderHeader()}
                {this.renderBody()}
                {this.renderFooter()}
            </Modal>
        );
    }
}

ModalDialog.propTypes = {
    modalId: PropTypes.string,
    show: PropTypes.bool,
    onHide: PropTypes.func,
    title: PropTypes.string,
    className: PropTypes.string,
    isFullWidth: PropTypes.bool,
    backdropColor: PropTypes.string,
};

ModalDialog.defaultProps = {
    isFullWidth: false,
};
