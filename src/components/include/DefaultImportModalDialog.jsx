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
            files: [],
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
        const { files } = this.state;
        const newMaterialConfigs = [];
        const errors = [];

        files.forEach((file) => {
            try {
                const materialConfig = Made.parsers.nativeFormats.convertFromNative(file.text);
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
            files: [],
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

        validFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onloadend = (evt) => {
                const text = evt.target.result;
                const lastModifiedUNIX = new Date(file.lastModified);
                const lastModified = this.formatDate(lastModifiedUNIX);
                try {
                    const format = Made.parsers.nativeFormats.detectFormat(text);
                    const newFile = {
                        id: files.length + index,
                        fileName: file.name,
                        format,
                        text,
                        lastModified,
                    };

                    this.setState((prevState) => ({
                        files: [...prevState.files, newFile],
                    }));
                } catch (error) {
                    file.format = error.message;
                }
            };
            reader.readAsText(file);
        });
    }

    formatDate = (date) => {
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        // getMonth() returns a zero-based month index, so we add 1
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();

        return `${hours}:${minutes}:${seconds} ${month}/${day}/${year}`;
    };

    handleFileRemove = (fileNameToRemove) => {
        this.setState((prevState) => ({
            files: prevState.files.filter((file) => file.fileName !== fileNameToRemove),
        }));
    };

    onSubmit = () => {
        this.handleSubmit();
        // eslint-disable-next-line react/destructuring-assignment
        this.props.onClose();
    };

    render() {
        const { show, onClose, onSubmit, title } = this.props;
        const { files, dragging } = this.state;

        const rows = files.map((file, i) => ({
            id: i,
            fileName: file.fileName,
            lastModified: file.lastModified || "Not available",
            format: file.format || "Not available",
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
                            // Not to mess with CSS replace dots with dashes
                            id={`${params.row.fileName.replace(/\./g, "-")}-remove-button`}
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
                        {files.length > 0 ? (
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
