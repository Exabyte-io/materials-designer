import { Made } from "@exabyte-io/made.js";
import { PropTypes } from "prop-types";
import React from "react";
import { ModalBody, ModalHeader } from "react-bootstrap";
import NPMsAlert from "react-s-alert";

import { Material } from "../../material";
import BasisText from "../source_editor/BasisText";
import { ModalDialog } from "./ModalDialog";

class DefaultImportModalDialog extends ModalDialog {
    constructor(props) {
        super(props);
        this.state = {
            text: "Paste text here",
            fileName: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFileRead = this.handleFileRead.bind(this);

        this.reader = new FileReader();
        this.reader.onloadend = this.handleFileRead;
    }

    handleFileRead(evt) {
        this.setState({ text: evt.target.result });
    }

    handleSubmit() {
        const newMaterialConfig = Made.parsers.poscar.fromPoscar(this.state.text);
        newMaterialConfig.name = this.state.fileName;
        const newMaterial = new Material(newMaterialConfig);
        newMaterial.cleanOnCopy();

        this.props.onSubmit([newMaterial]);
    }

    handleChange(content) {
        this.setState({ text: content });
    }

    handleFileChange(files) {
        if (!files[0] || !files[0].size)
            return NPMsAlert.warning("Error: file cannot be read (unaccessible?)");
        this.reader.currentFilename = files[0].name;
        this.setState({ fileName: files[0].name });
        console.log("set file name", this.state.fileName);
        this.reader.readAsText(files[0]);
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
        return (
            <ModalBody className="bgm-dark">
                <BasisText
                    ref={(el) => {
                        this.BasisTextComponent = el;
                    }}
                    className="default-import-modal-basis-text"
                    content={this.state.text}
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
                            Submit file (POSCAR only)
                        </button>
                    </div>
                </div>
            </ModalBody>
        );
    }
}

DefaultImportModalDialog.PropTypes = {
    onSubmit: PropTypes.func,
    material: PropTypes.object,
};

export default DefaultImportModalDialog;
