import { Made } from "@exabyte-io/made.js";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import { PropTypes } from "prop-types";
import React from "react";
import NPMsAlert from "react-s-alert";

import { Material } from "../../material";
import BasisText from "../source_editor/BasisText";
import { ActionDialog } from "./ActionDialog";

class DefaultImportModalDialog extends ActionDialog {
    constructor(props) {
        super(props);
        this.state = {
            text: "Paste here",
            fileNames: [],
            texts: [],
            show: false,
        };
        this.title = "Import Materials";
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFileRead = this.handleFileRead.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);

        this.reader = new FileReader();
        this.reader.onloadend = this.handleFileRead;
    }

    handleOpen() {
        this.setState({ show: true });
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleFileRead(evt) {
        this.setState((prevState) => ({ texts: [...prevState.texts, evt.target.result] }));
    }

    handleSubmit() {
        NPMsAlert.info("Files are imported. Conversion is not yet impelemented");

        const newMaterialConfigs = this.state.texts.map((text) =>
            Made.parsers.convertFromNative(text),
        );
        const newMaterials = newMaterialConfigs.map((config) => {
            const newMaterial = new Material(config);
            newMaterial.cleanOnCopy();
            return newMaterial;
        });

        this.props.onSubmit(newMaterials);
        this.handleClose();
    }

    handleChange(content) {
        this.setState({ text: content });
    }

    handleFileChange(files) {
        // Filter out invalid files
        const validFiles = Array.from(files).filter((file) => file && file.size);
        if (validFiles.length === 0) {
            NPMsAlert.warning("Error: file(s) cannot be read (unaccessible?)");
            return;
        }

        // Extract valid file names
        const fileNames = validFiles.map((file) => file.name);
        this.setState({ fileNames });

        // Process each file
        let loadedFiles = 0;
        const texts = [];
        validFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onloadend = (evt) => {
                texts[index] = evt.target.result;
                loadedFiles += 1;
                if (loadedFiles === validFiles.length) {
                    this.setState({ texts });
                }
            };
            reader.readAsText(file);
        });
    }

    renderContent() {
        return (
            <form>
                <FormControl variant="standard" sx={{ mx: 1, width: 400, overflowX: "hidden" }}>
                    <Box sx={{ maxHeight: 200, overflow: "auto" }}>
                        <BasisText
                            ref={(el) => {
                                this.BasisTextComponent = el;
                            }}
                            className="default-import-modal-basis-text"
                            content={this.state.text}
                            onChange={this.handleChange}
                        />
                    </Box>

                    <input
                        style={{ display: "none" }}
                        type="file"
                        id="fileapi"
                        hidden
                        multiple
                        onChange={(event) => this.handleFileChange(event.target.files)}
                    />
                    <label htmlFor="fileapi">
                        <Button variant="contained" color="primary" component="span">
                            Upload File
                        </Button>
                    </label>

                    <Box sx={{ display: "flex", overflowX: "auto", gap: "10px", p: 1 }}>
                        {this.state.fileNames.map((fileName) => (
                            <Chip key={fileName} label={fileName} />
                        ))}
                    </Box>
                    <Button
                        id="default-import-modal-submit"
                        variant="contained"
                        color="primary"
                        onClick={this.handleSubmit}
                        disabled={this.state.fileNames.length === 0}
                    >
                        Submit file
                    </Button>
                </FormControl>
            </form>
        );
    }
}

DefaultImportModalDialog.PropTypes = {
    onSubmit: PropTypes.func,
    material: PropTypes.object,
};

export default DefaultImportModalDialog;
