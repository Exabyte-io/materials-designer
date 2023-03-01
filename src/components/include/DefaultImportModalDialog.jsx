import { Made } from "@exabyte-io/made.js";
import { defaultMaterialConfig } from "@exabyte-io/made.js/lib/material";
import { PropTypes } from "prop-types";
import React from "react";
import { ModalBody, ModalHeader } from "react-bootstrap";
import NPMsAlert from "react-s-alert";
import _ from "underscore";

import { Material } from "../../material";
import BasisText from "../source_editor/BasisText";
import { ModalDialog } from "./ModalDialog";

const mockLatticeConstantMultiplicator = 2.0;

class DefaultImportModalDialog extends ModalDialog {
    constructor(props) {
        super(props);
        this.state = {
            xyz: "Paste your XYZ",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFileRead = this.handleFileRead.bind(this);

        this.reader = new FileReader();
        this.reader.onloadend = this.handleFileRead;
    }

    handleFileRead(evt) {
        this.setState({ xyz: evt.target.result });
    }

    handleSubmit() {
        if (!this.BasisTextComponent.state.isContentValidated) return;

        const basisConfig = Made.parsers.xyz.toBasisConfig(
            this.state.xyz,
            Made.ATOMIC_COORD_UNITS.cartesian,
        );

        // determine the max distance to use for cell for user's XYZ
        const x = [];
        const y = [];
        const z = [];
        basisConfig.coordinates.forEach((item) => {
            x.push(item.value[0]);
            y.push(item.value[1]);
            z.push(item.value[2]);
        });

        const diffX = _.max(x) - _.min(x);
        const diffY = _.max(y) - _.min(y);
        const diffZ = _.max(z) - _.min(z);
        const mockLatticeConstant = _.max([diffX, diffY, diffZ]) * mockLatticeConstantMultiplicator;

        const material = new Made.Material(defaultMaterialConfig);

        const latticeConfig = {
            ...material.lattice,
            ...{
                a: mockLatticeConstant,
                b: mockLatticeConstant,
                c: mockLatticeConstant,
            },
        };
        const lattice = new Made.Lattice(latticeConfig);

        const basis = new Made.Basis({
            ...basisConfig,
            cell: lattice.vectorArrays,
        });

        const newMaterialConfig = {
            ...material.toJSON(),
            ...{
                basis: basis.toJSON(),
                lattice: lattice.toJSON(),
                name: `${this.reader.currentFilename} - ${basis.formula}`,
            },
        };
        const newMaterial = new Material(newMaterialConfig);
        newMaterial.cleanOnCopy();

        Made.tools.material.getBasisConfigTranslatedToCenter(newMaterial);
        this.props.onSubmit([newMaterial]);
    }

    handleChange(content) {
        this.setState({ xyz: content });
    }

    handleFileChange(files) {
        if (!files[0] || !files[0].size)
            return NPMsAlert.warning("Error: file cannot be read (unaccessible?)");
        this.reader.currentFilename = files[0].name;
        this.reader.readAsText(files[0]);
    }

    renderHeader() {
        return (
            <ModalHeader className="bgm-dark" closeButton>
                <h4 className="modal-title">{this.props.title}</h4>
            </ModalHeader>
        );
    }

    renderBody() {
        return (
            <ModalBody className="bgm-dark">
                <BasisText
                    ref={(el) => {
                        this.BasisTextComponent = el;
                    }}
                    className="default-import-modal-basis-text"
                    content={this.state.xyz}
                    onChange={this.handleChange}
                />
                <input
                    type="file"
                    id="fileapi"
                    onChange={(event) => this.handleFileChange(event.target.files)}
                />

                <div className="row m-t-10">
                    <div className="col-md-12">
                        <button
                            id="default-import-modal-submit"
                            className="btn btn-custom btn-block"
                            type="button"
                            onClick={this.handleSubmit}
                        >
                            Submit your XYZ
                        </button>
                    </div>
                </div>
            </ModalBody>
        );
    }

    // TODO: resolve the linter issue:
    //   Line 150:17:  Expected 'this' to be used by class method 'renderFooter'  class-methods-use-this
    // renderFooter() {
    //     return null;
    // }
}

DefaultImportModalDialog.PropTypes = {
    onSubmit: PropTypes.func,
    material: PropTypes.object,
};

export default DefaultImportModalDialog;
