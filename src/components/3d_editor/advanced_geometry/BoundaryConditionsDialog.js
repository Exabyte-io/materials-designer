import React from "react";
import {BOUNDARY_CONDITIONS} from "@exabyte-io/wave.js/dist/enums";
import {ModalHeader, ModalBody, ModalFooter} from "react-bootstrap";

import {ModalDialog} from "../../include/ModalDialog";

export class BoundaryConditionsDialog extends ModalDialog {

    constructor(props) {
        super(props);
        this.initializeState();
        this.handleSetBoundaryConditions = this.handleSetBoundaryConditions.bind(this);
    }

    initializeState() {
        this.state = {
            boundaryType: this.props.material.boundaryConditions.type || "pbc",
            boundaryOffset: this.props.material.boundaryConditions.offset || 0,
        };

    }

    componentWillReceiveProps(nextProps, nextContext) {this.initializeState()}

    handleSetBoundaryConditions() {
        this.props.onSubmit(this.state);
        this.props.onHide();
    }

    renderHeader() {
        return (
            <ModalHeader className="bgm-dark" closeButton={true}>
                <h4 className="modal-title">{this.props.title || "Set Boundary Conditions"}</h4>
            </ModalHeader>
        )
    }

    getBoundaryTypeOptions() {
        return BOUNDARY_CONDITIONS.map(e => <option key={e.type} value={e.type}>{e.name}</option>)
    }

    renderBody() {
        return (
            <ModalBody className="bgm-dark">
                <div id="boundary-conditions">
                    <div className="row">
                        <div className="col-xs-6 form-group fg-float">
                            <div className="fg-line " data-tid="type">
                                <label>Type</label>
                                <select
                                    className="form-control fg-input"
                                    value={this.state.boundaryType}
                                    onChange={(e) => this.setState({boundaryType: e.target.value})}
                                >
                                    {this.getBoundaryTypeOptions()}
                                </select>
                            </div>
                        </div>
                        <div className="col-xs-6 form-group fg-float" data-tid="offset">
                            <div className="fg-line ">
                                <label>Offset (A)</label>
                                <input
                                    type="number"
                                    className="form-control fg-input"
                                    min="0"
                                    value={this.state.boundaryOffset}
                                    onChange={e => this.setState({boundaryOffset: parseFloat(e.target.value)})}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </ModalBody>
        );
    }

    renderFooter() {
        return (
            <ModalFooter className="bgm-dark">
                <div className="row">
                    <div className="col-xs-12">
                        <button id="boundary-conditions-submit" className="btn btn-custom btn-block"
                            onClick={this.handleSetBoundaryConditions}>Submit
                        </button>
                    </div>
                </div>
            </ModalFooter>
        )
    }
}

BoundaryConditionsDialog.PropTypes = {
    material: React.PropTypes.object,
    onSubmit: React.PropTypes.func,
};
