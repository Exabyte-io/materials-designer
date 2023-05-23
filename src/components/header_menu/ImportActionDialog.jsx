import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import React from "react";

import { ActionDialog } from "../include/ActionDialog";

class ImportActionDialog extends ActionDialog {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
        };
        this.title = "Import File";
    }

    handleFileChange = (event) => {
        this.setState({ selectedFile: event.target.files[0] });
    };

    onSubmit = () => {
        this.props.onSubmit(this.state.format, this.state.selectedFile);
        this.props.onClose();
    };

    renderContent() {
        return (
            <form>
                <FormControl variant="standard" sx={{ mx: 1, minWidth: 120 }}>
                    <InputLabel htmlFor="import-format">Format</InputLabel>
                    <Select
                        native
                        value={this.state.format}
                        onChange={this.state.format}
                        input={<Input id="import-format" />}
                    >
                        <option value="json">JSON</option>
                        <option value="poscar">POSCAR</option>
                        <option disabled value="xyz">
                            XYZ
                        </option>
                        <option disabled value="cif">
                            CIF
                        </option>
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="import-native">File</InputLabel>
                    <Input id="import-native" type="file" onChange={this.handleFileChange} />
                </FormControl>
            </form>
        );
    }
}

export default ImportActionDialog;
