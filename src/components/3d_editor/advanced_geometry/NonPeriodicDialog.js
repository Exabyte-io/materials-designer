import React from "react";
import {ModalHeader, ModalBody} from "react-bootstrap";

import {ModalDialog} from "../../include/ModalDialog";

class NonPeriodicDialog extends ModalDialog {

    constructor(props) {
        super(props);
        this.state = {
            material: this.props.material
        };
        this.handleNonPeriodic = this.handleNonPeriodic.bind(this);
    }

    handleNonPeriodic() {
        this.setState({
            message: '',
        }, () => {
            this.props.onSubmit(this.state);
            this.props.onHide();
        });
    }

    renderHeader() {
        return (
            <ModalHeader className="bgm-dark" closeButton={true}>
                <h4 className="modal-title">{this.props.title || "(Non)-Periodic) Material Generated"}</h4>
            </ModalHeader>
        )
    }

    renderBody() {
        return (
            <ModalBody>
                <div className="row">
                    <div className="col-xs-12">
                        <button id="make-non-periodic" className="btn btn-custom btn-block"
                            onClick={this.handleNonPeriodic}>Update Material
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <span className="text-danger">{this.state.message}</span>
                    </div>
                </div>
            </ModalBody>
        );
    }
}

NonPeriodicDialog.PropTypes = {
    onSubmit: React.PropTypes.func
};

export default NonPeriodicDialog;
