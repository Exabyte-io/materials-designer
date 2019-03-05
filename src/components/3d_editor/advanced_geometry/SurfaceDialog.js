import React from "react";
import {ModalHeader, ModalBody, ModalFooter} from "react-bootstrap";
import {ModalDialog} from "/imports/ui/exports";

class SurfaceDialog extends ModalDialog {

    constructor(props) {
        super(props);
        this.state = {
            h: 1,
            k: 0,
            l: 0,
            thickness: 3,
            vacuumRatio: 0.80,
            vx: 1,
            vy: 1,
            message: ''
        };
        this.handleGenerateSurface = this.handleGenerateSurface.bind(this);
    }

    handleGenerateSurface() {
        const array = [this.state.h, this.state.k, this.state.l];
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
                <h4 className="modal-title">{this.props.title || "Generate surface/slab"}</h4>
            </ModalHeader>
        )
    }

    renderBody() {
        return (
            <ModalBody className="bgm-dark">
                <div id="surface" className="surface">
                    <div className="row" id="surface-matrix">
                        <div className="col-xs-4 form-group fg-float">
                            <div className="fg-line " data-tid="miller-h">
                                <label>Miller h</label>
                                <input
                                    type="number" className="form-control fg-input" step="1" min="0"
                                    value={this.state.h} tabIndex="1"
                                    onChange={e => this.setState({h: parseFloat(e.target.value)})}
                                />
                            </div>
                        </div>
                        <div className="col-xs-4 form-group fg-float" data-tid="miller-k">
                            <div className="fg-line ">
                                <label>Miller k</label>
                                <input
                                    type="number" className="form-control fg-input" step="1" min="0"
                                    value={this.state.k} tabIndex="2"
                                    onChange={e => this.setState({k: parseFloat(e.target.value)})}
                                />
                            </div>
                        </div>
                        <div className="col-xs-4 form-group fg-float" data-tid="miller-l">
                            <div className="fg-line ">
                                <label>Miller l</label>
                                <input
                                    type="number" className="form-control fg-input" step="1" min="0"
                                    value={this.state.l} tabIndex="3"
                                    onChange={e => this.setState({l: parseFloat(e.target.value)})}
                                />
                            </div>
                        </div>

                        <div className="col-xs-6 form-group fg-float" data-tid="thickness">
                            <div className="fg-line ">
                                <label>Thickness in layers</label>
                                <input
                                    type="number" className="form-control fg-input m21" step="1" min="1"
                                    value={this.state.thickness}
                                    onChange={e => this.setState({thickness: parseFloat(e.target.value)})}
                                />
                            </div>
                        </div>

                        <div className="col-xs-6 form-group fg-float" data-tid="vacuum-ratio">
                            <div className="fg-line ">
                                <label>Vacuum ratio</label>
                                <input
                                    type="number" className="form-control fg-input m21" step="0.01" min="0" max="0.99"
                                    value={this.state.vacuumRatio}
                                    onChange={e => this.setState({vacuumRatio: parseFloat(e.target.value)})}
                                />
                            </div>
                        </div>

                        <div className="col-xs-6 form-group fg-float" data-tid="vx">
                            <div className="fg-line ">
                                <label>Supercell dimension x</label>
                                <input
                                    type="number" className="form-control fg-input m21" step="1" min="1"
                                    value={this.state.vx}
                                    onChange={e => this.setState({vx: parseFloat(e.target.value)})}
                                />
                            </div>
                        </div>

                        <div className="col-xs-6 form-group fg-float" data-tid="vy">
                            <div className="fg-line ">
                                <label>Supercell dimension y</label>
                                <input
                                    type="number" className="form-control fg-input m21" step="1" min="1"
                                    value={this.state.vy}
                                    onChange={e => this.setState({vy: parseFloat(e.target.value)})}
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
                        <button id="make-surface" className="btn btn-custom btn-block"
                            onClick={this.handleGenerateSurface}>Submit
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <span className="text-danger">{this.state.message}</span>
                    </div>
                </div>
            </ModalFooter>
        )
    }
}

SurfaceDialog.PropTypes = {
    onSubmit: React.PropTypes.func
};

export default SurfaceDialog;
