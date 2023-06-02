import { Made } from "@exabyte-io/made.js";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import React from "react";
import NPMsAlert from "react-s-alert";

import { Material } from "../../material";

const dropZoneStyle = (dragging) => ({
    height: "160px",
    width: "560px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    border: "2px dashed gray",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: dragging && "grey",
});
const paperStyle = {
    position: "absolute",
    top: "10%",
    width: "800px",
};

const dataGridStyle = (dragging) => ({
    height: "400px",
    backgroundColor: dragging && "grey",
});

const buttonContainerStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignContent: "flex-end",
};
class DefaultImportModalDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileNames: [],
            formats: [],
            texts: [],
            dragging: false,
        };
        this.title = "Import Materials";

        this.reader = new FileReader();
        this.reader.onloadend = this.handleFileRead;
    }

    handleFileRead = (evt) => {
        this.setState((prevState) => ({ texts: [...prevState.texts, evt.target.result] }));
    };

    handleSubmit() {
        const { texts } = this.state;
        const newMaterialConfigs = [];
        const errors = [];

        texts.forEach((text) => {
            try {
                const materialConfig = Made.parsers.nativeFormats.convertFromNative(text);
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

        const { onSubmit } = this.props;
        onSubmit(newMaterials);

        this.setState({
            fileNames: [],
            formats: [],
            texts: [],
        });
    }

    handleDragOver = (e) => {
        const { dragging } = this.state;
        e.preventDefault();
        if (!dragging) {
            this.setState({ dragging: true });
        }
    };

    handleDragLeave = (e) => {
        e.preventDefault();
        this.setState({ dragging: false });
    };

    handleDrop = (e) => {
        e.preventDefault();
        const { files } = e.dataTransfer;
        this.handleFileChange(files);
        this.setState({ dragging: false });
    };

    handleFileChange(files) {
        // Filter out invalid files
        const validFiles = Array.from(files).filter((file) => file && file.size);
        if (validFiles.length === 0) {
            NPMsAlert.warning("Error: file(s) cannot be read (unaccessible?)");
            return;
        }

        // Process each file
        let loadedFiles = 0;
        const { fileNames, texts, formats } = this.state;
        const newTexts = [...texts]; // clone existing texts array
        const newFormats = [...formats];
        // Append new valid file names to existing ones
        const newFileNames = [...fileNames, ...validFiles.map((file) => file.name)];
        this.setState({ fileNames: newFileNames });

        validFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onloadend = (evt) => {
                newTexts[index + texts.length] = evt.target.result; // append to existing texts array
                loadedFiles += 1;

                // Detect file format immediately after reading
                try {
                    const format = Made.parsers.nativeFormats.detectFormat(evt.target.result);
                    // Append to existing formats array
                    newFormats.push(format);
                } catch (error) {
                    newFormats.push(error.message);
                }

                if (loadedFiles === validFiles.length) {
                    this.setState({ texts: newTexts, formats: newFormats });
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

            const newFormats = [...prevState.formats];
            newFormats.splice(fileIndex, 1);

            // Return the new state
            return { fileNames: newFileNames, texts: newTexts, formats: newFormats };
        });
    };

    onSubmit = () => {
        this.handleSubmit();
        // eslint-disable-next-line react/destructuring-assignment
        this.props.onClose();
    };

    render() {
        const { show, onClose, onSubmit, title } = this.props;
        const { fileNames, formats, dragging } = this.state;

        const rows = fileNames.map((fileName, i) => ({
            id: i,
            fileName,
            lastModified: fileNames[i]?.lastModified || "Not available",
            format: formats[i] || "Not available",
        }));

        const columns = [
            { field: "fileName", headerName: "File Name", flex: 1 },
            { field: "format", headerName: "Format", flex: 1 },
            { field: "lastModified", headerName: "Last Modified", flex: 1 },
            {
                field: "actions",
                headerName: "Actions",
                flex: 1,
                sortable: false,
                filterable: false,
                disableColumnMenu: true,
                renderHeader: () => (
                    <div style={buttonContainerStyle}>
                        <Button
                            data-name="add-button"
                            variant="contained"
                            color="primary"
                            size="small"
                            component="label"
                        >
                            Add
                            <input
                                data-name="fileapi"
                                style={{ display: "none" }}
                                type="file"
                                hidden
                                multiple
                                onChange={(event) => this.handleFileChange(event.target.files)}
                            />
                        </Button>
                    </div>
                ),
                renderCell: (params) => (
                    <div style={buttonContainerStyle}>
                        <Button
                            variant="contained"
                            color="warning"
                            size="small"
                            onClick={() => this.handleFileRemove(params.row.fileName)}
                        >
                            Remove
                        </Button>
                    </div>
                ),
            },
        ];

        return (
            <Dialog
                open={show}
                transitionDuration={0}
                PaperProps={{ style: paperStyle }}
                id="defaultImportModalDialog"
            >
                <DialogTitle>{this.title || title}</DialogTitle>

                <DialogContent>
                    <FormControl variant="standard" sx={{ width: "100%", alignContent: "center" }}>
                        {fileNames.length > 0 ? (
                            <div
                                onDragOver={this.handleDragOver}
                                onDragLeave={this.handleDragLeave}
                                onDrop={this.handleDrop}
                            >
                                <DataGrid
                                    data-name="datagrid"
                                    hideFooter
                                    rows={rows}
                                    columns={columns}
                                    pageSize={1}
                                    style={dataGridStyle(dragging)}
                                />
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="fileapi">
                                    <div
                                        data-name="dropzone"
                                        onDragOver={this.handleDragOver}
                                        onDragLeave={this.handleDragLeave}
                                        onDrop={this.handleDrop}
                                        style={dropZoneStyle(dragging)}
                                    >
                                        Drop files here or click to upload
                                    </div>
                                </label>
                                <input
                                    data-name="fileapi"
                                    style={{ display: "none" }}
                                    type="file"
                                    id="fileapi"
                                    hidden
                                    multiple
                                    onChange={(event) => this.handleFileChange(event.target.files)}
                                />
                            </div>
                        )}
                    </FormControl>
                </DialogContent>

                <DialogActions>
                    <Button data-name="Cancel" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button data-name="Submit" onClick={this.onSubmit || onSubmit}>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

DefaultImportModalDialog.propTypes = {
    title: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default DefaultImportModalDialog;
