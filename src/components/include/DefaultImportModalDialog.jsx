import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import { Made } from "@exabyte-io/made.js";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import React from "react";
import NPMsAlert from "react-s-alert";

import { Material } from "../../material";

const dropZoneStyle = (dragging) => ({
    height: "160px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    border: "2px dashed gray",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: dragging && "grey",
});
const dataGridStyle = (dragging) => ({
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
            defaultMaterialsList: this.getDefaultMaterialsList() || [],
            selectedMaterials: [],
        };

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
                const materialConfig = Made.parsers.nativeFormatParsers.convertFromNativeFormat(
                    file.text,
                );
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
            NPMsAlert.warning("Error: file(s) cannot be read (inaccessible?)");
            return;
        }

        validFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onloadend = (evt) => {
                const text = evt.target.result;
                const lastModifiedUNIX = new Date(file.lastModified);
                const lastModified = this.formatDate(lastModifiedUNIX);
                try {
                    const format = Made.parsers.nativeFormatParsers.detectFormat(text);
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

    getDefaultMaterialsList = () => {
        const { defaultMaterialsSet } = this.props;
        return defaultMaterialsSet.map((material) => {
            return { label: material.name || "Not available", value: material };
        });
    };

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

    addMaterialsAsJSONFile = () => {
        const { selectedMaterials, files } = this.state;

        if (!selectedMaterials.length) {
            return;
        }

        const newFiles = selectedMaterials.map((selectedMaterial) => {
            const config = selectedMaterial.value;
            return {
                id: config.id || files.length,
                fileName: config.name || "Not available",
                format: "json",
                text: JSON.stringify(config) || "Not available",
                lastModified: this.formatDate(new Date()),
            };
        });

        this.setState({
            files: [...newFiles, ...files],
            selectedMaterials: [],
        });
    };

    onSubmit = () => {
        this.handleSubmit();
        // eslint-disable-next-line react/destructuring-assignment
        this.props.onClose();
    };

    render() {
        const { show, onClose } = this.props;
        const { files, dragging, selectedMaterials, defaultMaterialsList } = this.state;

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
                id="defaultImportModalDialog"
                title="Import Materials"
                onClose={onClose}
                onSubmit={this.onSubmit}
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={10}>
                        <Autocomplete
                            disablePortal
                            multiple
                            renderInput={(params) => (
                                // eslint-disable-next-line react/jsx-props-no-spreading
                                <TextField {...params} label="Default set of Materials" />
                            )}
                            value={selectedMaterials}
                            options={defaultMaterialsList}
                            getOptionLabel={(option) => option.label}
                            onChange={(event, value) => this.setState({ selectedMaterials: value })}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    this.addMaterialsAsJSONFile();
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            onClick={this.addMaterialsAsJSONFile}
                            disabled={!selectedMaterials.length}
                        >
                            Select
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl variant="standard" sx={{ width: "100%" }}>
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
                                <>
                                    {/* TODO: move to Cove.js and/or use from a library */}
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
                                        onChange={(event) =>
                                            this.handleFileChange(event.target.files)
                                        }
                                    />
                                </>
                            )}
                        </FormControl>
                    </Grid>
                </Grid>
            </Dialog>
        );
    }
}

DefaultImportModalDialog.propTypes = {
    title: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    defaultMaterialsSet: PropTypes.array,
};

DefaultImportModalDialog.defaultProps = {
    defaultMaterialsSet: [],
};

export default DefaultImportModalDialog;
