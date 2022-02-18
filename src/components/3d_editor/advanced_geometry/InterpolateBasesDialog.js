import { Made } from "@exabyte-io/made.js";
import PropTypes from "prop-types";
import React from "react";
import { ModalBody, ModalFooter, ModalHeader } from "react-bootstrap";
import _ from "underscore";

import { displayMessage } from "../../../i18n/messages";
import { Material } from "../../../material";
import { ShowIf } from "../../../utils/react/showif";
import { ModalDialog } from "../../include/ModalDialog";
import BasisText from "../../source_editor/BasisText";

class InterpolateBasesDialog extends ModalDialog {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            numberOfSteps: 1,
            materialIndex: 0,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // eslint-disable-next-line no-unused-vars
    componentWillReceiveProps(nextProps, nextContext) {
        const basis1 = nextProps.material.Basis;
        const basis2 = nextProps.material2.Basis;
        if (!_.isEqual(basis1.elementsArray, basis2.elementsArray)) {
            this.setState({ message: displayMessage("basis.elementsNotEqual") });
        } else {
            // reset the message
            this.setState({ message: "" });
        }
    }

    getOptions = () => {
        return ["initial", "final"].map((value, idx) => {
            return (
                // eslint-disable-next-line react/no-array-index-key
                <option key={idx} value={idx}>
                    {value}
                </option>
            );
        });
    };

    handleSubmit() {
        // do nothing when bases elements are not equal
        if (this.state.message) return;

        const basis1 = this.props.material.Basis;
        const basis2 = this.props.material2.Basis;
        const { material } = this.props;

        // create combinatorial set from a given basis
        // eslint-disable-next-line new-cap
        const newBases = new Made.tools.basis.interpolate(basis1, basis2, this.state.numberOfSteps);

        const newMaterials = [];
        _.each(newBases, (newBasis, idx) => {
            const newMaterialConfig = {
                ...material.toJSON(),
                basis: newBasis.toJSON(),
                name: `${idx} - ${material.name} - ${newBasis.formula}`,
            };
            const newMaterial = new Material(newMaterialConfig);
            newMaterial.isUpdated = true;
            newMaterial.cleanOnCopy();
            newMaterials.push(newMaterial);
        });
        // pass up the chain and add materials with `atIndex = true`
        this.props.onSubmit(newMaterials, true);
    }

    renderHeader() {
        return (
            <ModalHeader className="bgm-dark" closeButton>
                <h4 className="modal-title">
                    {this.props.title}
                    <a
                        className="m-l-10 combinatorial-info"
                        href="https://docs.exabyte.io/materials-designer/header-menu/advanced/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <i className="zmdi zmdi-info" />
                    </a>
                </h4>
            </ModalHeader>
        );
    }

    renderBody() {
        const xyzContent = [this.props.material, this.props.material2][
            this.state.materialIndex
        ].getBasisAsXyz();
        return (
            <ModalBody className="bgm-dark">
                <div className="xyz" style={{ minHeight: "65vmin" }}>
                    <div className="col-xs-4 form-group fg-float">
                        <div className="fg-line ">
                            <label htmlFor="form-number-immediate-steps">
                                # of intermediate steps
                            </label>
                            <input
                                id="form-number-immediate-steps"
                                type="number"
                                className="form-control fg-input numberOfSteps"
                                step="1"
                                min="0"
                                value={this.state.numberOfSteps}
                                onChange={(e) => {
                                    this.setState({ numberOfSteps: parseInt(e.target.value, 10) });
                                }}
                            />
                        </div>
                    </div>

                    <div className="col-xs-4 form-group fg-float">
                        <div className="fg-line ">
                            <label htmlFor="form-initial-final-structures">
                                Initial/Final structures
                            </label>
                            <select
                                id="form-initial-final-structures"
                                type="number"
                                className="form-control fg-input materialIndex"
                                value={this.state.materialIndex}
                                onChange={(e) => {
                                    this.setState({ materialIndex: parseInt(e.target.value, 10) });
                                }}
                            >
                                {this.getOptions()}
                            </select>
                        </div>
                    </div>

                    <BasisText
                        readOnly
                        ref={(el) => {
                            this.BasisTextComponent = el;
                        }}
                        className="col-xs-12 interpolated-bases"
                        content={xyzContent}
                    />

                    <div className="col-xs-12 m-t-15">
                        <button
                            type="submit"
                            id="generate-interpolated-set"
                            className="btn btn-custom btn-block"
                            onClick={this.handleSubmit}
                        >
                            Generate Interpolated Set
                        </button>
                    </div>
                </div>
            </ModalBody>
        );
    }

    renderFooter() {
        return (
            <ShowIf condition={Boolean(this.state.message)}>
                <ModalFooter className="bgm-dark">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <span className={this.state.validated ? "text-success" : "text-danger"}>
                                {this.state.message}
                            </span>
                        </div>
                    </div>
                </ModalFooter>
            </ShowIf>
        );
    }
}

InterpolateBasesDialog.PropTypes = {
    onSubmit: PropTypes.func,
    material: PropTypes.object, // initial
    material2: PropTypes.object, // final
};

export default InterpolateBasesDialog;
