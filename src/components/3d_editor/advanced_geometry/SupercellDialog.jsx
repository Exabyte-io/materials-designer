import math from "mathjs";
import PropTypes from "prop-types";
import React from "react";
import { ModalBody, ModalFooter, ModalHeader } from "react-bootstrap";

import { ModalDialog } from "../../include/ModalDialog";

class SupercellDialog extends ModalDialog {
    constructor(props) {
        super(props);
        this.state = {
            m11: 1,
            m12: 0,
            m13: 0,
            m21: 0,
            m22: 1,
            m23: 0,
            m31: 0,
            m32: 0,
            m33: 1,
            message: "",
        };
        this.handleGenerateSupercell = this.handleGenerateSupercell.bind(this);
    }

    getMatrix() {
        return math.matrix([
            [this.state.m11, this.state.m12, this.state.m13],
            [this.state.m21, this.state.m22, this.state.m23],
            [this.state.m31, this.state.m32, this.state.m33],
        ]);
    }

    handleGenerateSupercell() {
        const matrix = this.getMatrix();
        if (math.det(matrix) === 0) {
            this.setState({ message: "Matrix determinant must be non-zero." });
            return;
        }
        this.setState(
            {
                message: "",
            },
            () => {
                this.props.onSubmit(matrix.toArray());
                this.props.onHide();
            },
        );
    }

    renderHeader() {
        return (
            <ModalHeader className="bgm-dark" closeButton>
                <h4 className="modal-title">{this.props.title || "Generate supercell"}</h4>
            </ModalHeader>
        );
    }

    renderBody() {
        return (
            <ModalBody className="bgm-dark">
                <div id="supercell" className="supercell">
                    <div className="row" id="supercell-matrix">
                        <div className="col-xs-4 form-group fg-float">
                            <div className="fg-line ">
                                <input
                                    type="number"
                                    className="form-control fg-input m11"
                                    step="1"
                                    value={this.state.m11}
                                    onChange={(e) => {
                                        this.setState({ m11: parseFloat(e.target.value) });
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-xs-4 form-group fg-float">
                            <div className="fg-line ">
                                <input
                                    type="number"
                                    className="form-control fg-input m12"
                                    step="1"
                                    value={this.state.m12}
                                    onChange={(e) => {
                                        this.setState({ m12: parseFloat(e.target.value) });
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-xs-4 form-group fg-float">
                            <div className="fg-line ">
                                <input
                                    type="number"
                                    className="form-control fg-input m13"
                                    step="1"
                                    value={this.state.m13}
                                    onChange={(e) => {
                                        this.setState({ m13: parseFloat(e.target.value) });
                                    }}
                                />
                            </div>
                        </div>

                        <div className="col-xs-4 form-group fg-float">
                            <div className="fg-line ">
                                <input
                                    type="number"
                                    className="form-control fg-input m21"
                                    step="1"
                                    value={this.state.m21}
                                    onChange={(e) => {
                                        this.setState({ m21: parseFloat(e.target.value) });
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-xs-4 form-group fg-float">
                            <div className="fg-line ">
                                <input
                                    type="number"
                                    className="form-control fg-input m22"
                                    step="1"
                                    value={this.state.m22}
                                    onChange={(e) => {
                                        this.setState({ m22: parseFloat(e.target.value) });
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-xs-4 form-group fg-float">
                            <div className="fg-line ">
                                <input
                                    type="number"
                                    className="form-control fg-input m23"
                                    step="1"
                                    value={this.state.m23}
                                    onChange={(e) => {
                                        this.setState({ m23: parseFloat(e.target.value) });
                                    }}
                                />
                            </div>
                        </div>

                        <div className="col-xs-4 form-group fg-float">
                            <div className="fg-line ">
                                <input
                                    type="number"
                                    className="form-control fg-input m31"
                                    step="1"
                                    value={this.state.m31}
                                    onChange={(e) => {
                                        this.setState({ m31: parseFloat(e.target.value) });
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-xs-4 form-group fg-float">
                            <div className="fg-line ">
                                <input
                                    type="number"
                                    className="form-control fg-input m32"
                                    step="1"
                                    value={this.state.m32}
                                    onChange={(e) => {
                                        this.setState({ m32: parseFloat(e.target.value) });
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-xs-4 form-group fg-float">
                            <div className="fg-line ">
                                <input
                                    type="number"
                                    className="form-control fg-input m33"
                                    step="1"
                                    value={this.state.m33}
                                    onChange={(e) => {
                                        this.setState({ m33: parseFloat(e.target.value) });
                                    }}
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
                        <button
                            type="submit"
                            id="make-supercell"
                            className="btn btn-custom btn-block"
                            onClick={this.handleGenerateSupercell}
                        >
                            Submit
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <span className="text-danger">{this.state.message}</span>
                    </div>
                </div>
            </ModalFooter>
        );
    }
}

SupercellDialog.PropTypes = {
    onSubmit: PropTypes.func,
};

export default SupercellDialog;
