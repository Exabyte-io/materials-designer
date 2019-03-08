import React from 'react';
import _ from 'underscore';
import {Made} from "made.js";
import Alert from 'react-s-alert';
import {ModalHeader, ModalBody, ModalFooter} from 'react-bootstrap';

import {Material} from "../../../material";
import {ModalDialog} from '../../include/ModalDialog';
import {displayMessage} from "../../../i18n/messages";

// TODO: adjust this component and SourceEditor to inherit from the same one - XYZBasisEditor

class CombinatorialBasisDialog extends ModalDialog {

    constructor(props) {
        super(props);
        this.state = {
            validated: true,
            message: '',
            xyz: this.props.material.getBasisAsXyz(),
            manualEditStarted: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState({xyz: newProps.material.getBasisAsXyz()});
    }

    handleChange(event) {
        // update the input field immediately on typing
        const value = event.target.value;
        this.setState({xyz: value}, () => {
            this._validateXYZ(value)
        });

    }

    assertCombinatorialBasesCount(bases) {
        // TODO by MM:  Meteor.settings.public.maxCombinatorialBasesCount || 100
        const maxCombinatorialBasesCount = 100;
        if (bases.length > maxCombinatorialBasesCount) {
            Alert.warning(displayMessage('combinatorialBasesCountExceeded', maxCombinatorialBasesCount));
            return false;
        }
        return true;
    }

    handleSubmit() {

        // TODO: 1. move the logic for combinatorial set generation to Made;
        // TODO 2. avoid modifying materials directly inside this component move the below logic to reducer
        const _xyzText = this.state.xyz;
        const material = this.props.material;
        if (!this._validateXYZ(_xyzText)) return; // don't proceed if cannot validate xyz

        // create combinatorial set from a given basis
        const newBases = new Made.parsers.xyz.CombinatorialBasis(_xyzText).allBasisConfigs;

        if (!this.assertCombinatorialBasesCount(newBases)) return;

        const newMaterials = [];
        _.each(newBases, (elm, idx) => {
            // first set units from existing material, as allBasises() returns no units
            const latticeConfig = material.lattice;
            const lattice = new Made.Lattice(latticeConfig);
            const basisConfig = Object.assign({}, material.basis, elm);
            const basis = new Made.Basis({
                ...basisConfig,
                cell: lattice.vectorArrays
            });
            // then create material
            const newMaterialConfig = Object.assign({},
                material.toJSON(),
                {
                    basis: basis.toJSON(),
                    name: `${material.name} - ${basis.formula}`
                }
            );
            const newMaterial = new Material(newMaterialConfig);
            newMaterial.cleanOnCopy();
            newMaterials.push(newMaterial);
        });
        // pass up the chain
        this.props.onSubmit(newMaterials);
    }

    _validateXYZ(value) {
        try {
            Made.parsers.xyz.validate(value);
            // only show the success message first time after last failure
            if (!this.state.validated) {
                this.setState({
                    validated: true,
                    message: displayMessage('basis.validationSuccess')
                });
            } else {
                // already validated before -> remove message
                this.setState({message: ''});
            }
        } catch (err) {
            this.setState({
                validated: false,
                message: displayMessage('basis.validationError')
            });
            return false;
        }
        return true;
    }

    renderHeader() {
        return (
            <ModalHeader className="bgm-dark" closeButton={true}>
                <h4 className="modal-title">{this.props.title}
                    <a className="m-l-10 combinatorial-info"
                        href="https://docs.exabyte.io/materials-designer/header-menu/advanced/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <i className="zmdi zmdi-info"/>
                    </a>
                </h4>
            </ModalHeader>
        )
    }

    renderBody() {
        return (
            <ModalBody className="bgm-dark">
                <div className="xyz"
                    style={{minHeight: '65vmin'}}>
                    <textarea name="basis-xyz"
                        style={{height: '60vmin'}}
                        className="material-textarea form-control fg-input"
                        onFocus={() => {
                            this.setState({manualEditStarted: true});
                        }}
                        onBlur={(e) => {
                            this.setState({manualEditStarted: false});
                        }}
                        value={this.state.xyz}
                        onChange={this.handleChange}
                    >
                     </textarea>
                    <div className="row m-t-10">
                        <div className="col-md-12">
                            <button id="generate-combinatorial" className="btn btn-custom btn-block"
                                onClick={this.handleSubmit}>Generate Combinatorial Set
                            </button>
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
                    <div className="col-md-12 text-center">
                        <span className={this.state.validated ? "text-success" : "text-danger"}>
                            {this.state.message}
                            </span>
                    </div>
                </div>
            </ModalFooter>
        )
    }
}

CombinatorialBasisDialog.PropTypes = {
    onSubmit: React.PropTypes.func,
    material: React.PropTypes.object
};

export default CombinatorialBasisDialog;
