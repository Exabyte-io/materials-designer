import { Made } from "@exabyte-io/made.js";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import { PropTypes } from "prop-types";
import React from "react";
import NPMsAlert from "react-s-alert";

import { Material } from "../../material";
import { ActionDialog } from "./ActionDialog";

class DefaultImportModalDialog extends ActionDialog {
    constructor(props) {
        super(props);
        this.state = {
            fileNames: [],
            texts: [],
            dragging: false,
        };
        this.title = "Import Materials";

        this.handleDragOver = this.handleDragOver.bind(this);
        this.handleDragLeave = this.handleDragLeave.bind(this);
        this.handleDrop = this.handleDrop.bind(this);

        this.reader = new FileReader();
        this.reader.onloadend = this.handleFileRead;
    }

    handleFileRead(evt) {
        this.setState((prevState) => ({ texts: [...prevState.texts, evt.target.result] }));
    }

    onSubmit = () => {
        this.handleSubmit();
        this.props.onClose();
    };

    handleSubmit() {
        const newMaterialConfigs = [];
        const errors = [];

        this.state.texts.forEach((text) => {
            try {
                const materialConfig = Made.parsers.convertFromNative(text);
                newMaterialConfigs.push(materialConfig);
            } catch (error) {
                errors.push(error.message);
            }
        });

        if (errors.length > 0) {
            NPMsAlert.error(`Failed to convert some files: ${errors.join(", ")}`);
            return;
        }

        const newMaterials = newMaterialConfigs.map((config) => {
            const newMaterial = new Material(config);
            newMaterial.cleanOnCopy();
            return newMaterial;
        });

        this.props.onSubmit(newMaterials);

        this.setState({
            fileNames: [],
            texts: [],
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        if (!this.state.dragging) {
            this.setState({ dragging: true });
        }
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.setState({ dragging: false });
    }

    handleDrop(e) {
        e.preventDefault();
        const { files } = e.dataTransfer;
        this.handleFileChange(files);
        this.setState({ dragging: false });
    }

    handleFileChange(files) {
        // Filter out invalid files
        const validFiles = Array.from(files).filter((file) => file && file.size);
        if (validFiles.length === 0) {
            NPMsAlert.warning("Error: file(s) cannot be read (unaccessible?)");
            return;
        }

        // Append new valid file names to existing ones
        const fileNames = [...this.state.fileNames, ...validFiles.map((file) => file.name)];
        this.setState({ fileNames });

        // Process each file
        let loadedFiles = 0;
        const texts = [...this.state.texts]; // clone existing texts array
        validFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onloadend = (evt) => {
                texts[index + this.state.texts.length] = evt.target.result; // append to existing texts array
                loadedFiles += 1;
                if (loadedFiles === validFiles.length) {
                    this.setState({ texts });
                }
            };
            reader.readAsText(file);
        });
    }

    handleFileRemove = (fileNameToRemove) => {
        this.setState((prevState) => {
            const fileIndex = prevState.fileNames.findIndex(
                (fileName) => fileName === fileNameToRemove,
            );

            // If the file was not found, do nothing
            if (fileIndex === -1) {
                return prevState;
            }

            // Remove file's name from fileNames
            const newFileNames = [...prevState.fileNames];
            newFileNames.splice(fileIndex, 1);

            // Remove file's text from texts
            const newTexts = [...prevState.texts];
            newTexts.splice(fileIndex, 1);

            // Return the new state
            return { fileNames: newFileNames, texts: newTexts };
        });
    };

    renderContent() {
        const dropZoneStyle = {
            height: "200px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            justifyText: "center",
            border: "2px dashed gray",
            borderRadius: "5px",
            cursor: "pointer",
            backgroundColor: this.state.dragging && "grey",
        };
        return (
            <form>
                <FormControl variant="standard" sx={{ mx: 1, width: 400 }}>
                    <label htmlFor="fileapi">
                        <div
                            onDragOver={this.handleDragOver}
                            onDragLeave={this.handleDragLeave}
                            onDrop={this.handleDrop}
                            style={dropZoneStyle}
                        >
                            Drop files here or click to upload
                        </div>
                    </label>
                    <input
                        style={{ display: "none" }}
                        type="file"
                        id="fileapi"
                        hidden
                        multiple
                        onChange={(event) => this.handleFileChange(event.target.files)}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            overflowX: "auto",
                            overflowY: "hidden",
                            gap: "10px",
                            p: 1,
                            height: "50px",
                        }}
                    >
                        {this.state.fileNames.length > 0 ? (
                            this.state.fileNames.map((fileName) => (
                                <Chip
                                    key={fileName}
                                    label={fileName}
                                    onDelete={() => this.handleFileRemove(fileName)}
                                />
                            ))
                        ) : (
                            <div>No files uploaded yet</div>
                        )}
                    </Box>
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
