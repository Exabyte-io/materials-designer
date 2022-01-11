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
        const { title } = this.props;
        return (
            <ModalHeader closeButton>
                <h4 className="modal-title">{title}</h4>
            </ModalHeader>
        );
    }

    /**
     * @summary Rendering footer in separate method, so subclasses can override it
     * @returns {ReactElement} the footer element
     */
    // eslint-disable-next-line class-methods-use-this
    renderFooter() {
        return null;
    }

    /**
     * @summary Rendering body in separate method, so subclasses can override it
     * @returns {ReactElement} the body element
     */
    renderBody() {
        const { children } = this.props;
        return <ModalBody>{children}</ModalBody>;
    }

    render() {
        const { className, isFullWidth, show, onHide, modalId, backdropColor } = this.props;
        const longClassName = setClass(className, isFullWidth ? "full-page-overlay" : "");

        if (show) {
            document.body.classList.add("modal-backdrop-color-" + backdropColor);
        }

        // animations are disabled to avoid problems with automated tests
        return (
            <Modal
                id={modalId}
                animation={false}
                show={show}
                onHide={(e) => {
                    onHide(e);
                    document.body.classList.remove("modal-backdrop-color-" + backdropColor);
                }}
                className={longClassName}
            >
                {this.renderHeader()}
                {this.renderBody()}
                {this.renderFooter()}
            </Modal>
        );
    }
}

ModalDialog.propTypes = {
    modalId: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    isFullWidth: PropTypes.bool,
    backdropColor: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

ModalDialog.defaultProps = {
    isFullWidth: false,
};
