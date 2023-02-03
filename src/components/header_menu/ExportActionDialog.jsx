import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import React from "react";

import { ActionDialog } from "../include/ActionDialog";

class ExportActionDialog extends ActionDialog {
    constructor(props) {
        super(props);
        this.state = {
            format: "json",
            useMultiple: false,
        };
        this.title = "Export Items";
    }

    handleChange = (name) => (event) => {
        this.setState({ [name]: event.target.value });
    };

    onSubmit = () => {
        this.props.onSubmit(this.state.format, this.state.useMultiple);
        this.props.onClose();
    };

    renderContent() {
        return (
            <form>
                <FormControl>
                    <InputLabel>Format</InputLabel>
                    <Select
                        native
                        value={this.state.format}
                        onChange={this.handleChange("format")}
                        input={<Input id="format-native" />}
                    >
                        <option value="json">json</option>
                        <option value="poscar">poscar</option>
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel>Export all</InputLabel>
                    <Select
                        native
                        value={this.state.useMultiple}
                        onChange={this.handleChange("useMultiple")}
                        input={<Input id="export-multiple" />}
                    >
                        <option value={false}>no</option>
                        <option value>yes</option>
                    </Select>
                </FormControl>
            </form>
        );
    }
}

export default ExportActionDialog;
