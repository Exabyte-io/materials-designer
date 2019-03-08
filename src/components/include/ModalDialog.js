import setClass from "classnames";
import React, {Component} from 'react';
import elementClass from 'element-class';
import {Modal, ModalHeader, ModalBody} from 'react-bootstrap';

export class ModalDialog extends Component {

    /**
     * @summary Rendering header in separate method, so subclasses can override it
     * @returns {ReactElement} the header element
     */
    renderHeader() {
        return (
            <ModalHeader closeButton={true}>
                <h4 className="modal-title">{this.props.title}</h4>
            </ModalHeader>
        )
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
        return (
            <ModalBody>
                {this.props.children}
            </ModalBody>
        )
    }

    render() {
        const className = setClass(this.props.className, this.props.isFullWidth ? "full-page-overlay" : "");

        if (this.props.show) {
            elementClass(document.body).add('modal-backdrop-color-' + this.props.backdropColor);
        }

        // animations are disabled to avoid problems with automated tests
        return (
            <Modal id={this.props.modalId}
                animation={false}
                show={this.props.show}
                onHide={(e) => {
                    this.props.onHide(e);
                    elementClass(document.body).remove('modal-backdrop-color-' + this.props.backdropColor);
                }}
                className={className}
            >
                {this.renderHeader()}
                {this.renderBody()}
                {this.renderFooter()}
            </Modal>
        )
    }
}

ModalDialog.propTypes = {
    modalId: React.PropTypes.string,
    show: React.PropTypes.bool,
    onHide: React.PropTypes.func,
    title: React.PropTypes.string,
    className: React.PropTypes.string,
    isFullWidth: React.PropTypes.bool,
    backdropColor: React.PropTypes.string
};

ModalDialog.defaultProps = {
    isFullWidth: false,
};
