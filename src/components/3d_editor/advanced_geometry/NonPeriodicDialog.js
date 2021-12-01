import React from "react";
import {ModalHeader, ModalBody, ModalFooter} from "react-bootstrap";

import {ModalDialog} from "../../include/ModalDialog";
import ToggleSwitch from "../../include/ToggleSwitch";

class NonPeriodicDialog extends ModalDialog {

    constructor(props) {
        super(props);
        this.state = {
            isNonPeriodic: false
        }
        this.handleNonPeriodic = this.handleNonPeriodic.bind(this);
    }

    handleNonPeriodic() {
        //TODO: update lattice & basis
        console.log(this.state.isNonPeriodic);
        return this.state.isNonPeriodic;
    }

    renderHeader() {
        return (
            <ModalHeader className="bgm-dark" closeButton={true}>
                <h4 className="modal-title">{this.props.title || "Make (Non)-Periodic"}</h4>
            </ModalHeader>
        )
    }

    renderBody() {
        return (
            <ModalBody className="bgm-dark">
                <div className="non-periodic">
                    <div className="col-xs-12">
                        <ToggleSwitch
                            color="blue" title="Non-Periodic"
                            class="pull-left"
                            value={this.state.isNonPeriodic}
                            onStateChange={() => this.setState({isNonPeriodic: !this.state.isNonPeriodic})}
                            checked={this.state.isNonPeriodic}
                            id="access-level"
                        />
                    </div>
                </div>
            </ModalBody>
        )
    }
    renderFooter() {
        return (
            <ModalFooter className="bgm-dark">
                <div className="row">
                    <div className="col-xs-12">
                        <button id="make-non-periodic" className="btn btn-custom btn-block"
                                onClick={this.handleNonPeriodic}>Submit
                        </button>
                    </div>
                </div>
            </ModalFooter>
        );
    }
}

NonPeriodicDialog.PropTypes = {
    onSubmit: React.PropTypes.func
};

export default NonPeriodicDialog;
