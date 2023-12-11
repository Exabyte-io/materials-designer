import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import { Made } from "@exabyte-io/made.js";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React from "react";

interface StandataImportModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (materials: Made.Material[]) => void;
    defaultMaterialsSet: Made.Material[];
}

interface StandataImportModalState {
    selectedMaterials: Made.Material[];
}

class StandataImportModal extends React.Component<
    StandataImportModalProps,
    StandataImportModalState
> {
    constructor(props: StandataImportModalProps) {
        super(props);
        this.state = {
            selectedMaterials: [],
        };
    }

    addMaterialsAsJSONFile = () => {
        const { selectedMaterials } = this.state;
        const newMaterials = selectedMaterials.map((material) => new Made.Material(material));
        const { onSubmit } = this.props;
        onSubmit(newMaterials);
    };

    render() {
        const { show, onClose, defaultMaterialsSet } = this.props;
        const { selectedMaterials } = this.state;
        const defaultMaterialsList = defaultMaterialsSet;

        return (
            <Dialog
                open={show}
                id="standataImportModalDialog"
                title="Import Default Materials"
                onClose={onClose}
                onSubmit={this.addMaterialsAsJSONFile}
            >
                <div>
                    <Autocomplete
                        disablePortal
                        multiple
                        options={defaultMaterialsList}
                        getOptionLabel={(material) => material.name || "Not available"}
                        value={selectedMaterials}
                        onChange={(event, value) => this.setState({ selectedMaterials: value })}
                        renderInput={(params) => (
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            <TextField {...params} label="Default set of Materials" />
                        )}
                    />
                    <Button
                        onClick={this.addMaterialsAsJSONFile}
                        disabled={!selectedMaterials.length}
                    >
                        Import
                    </Button>
                </div>
            </Dialog>
        );
    }
}

export default StandataImportModal;
