import { MaterialSchema } from "@exabyte-io/code.js/dist/types";
import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import { Made } from "@exabyte-io/made.js";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";

interface StandataImportModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (materials: Made.Material[]) => void;
    defaultMaterialConfigs: MaterialSchema[];
}

interface StandataImportModalState {
    selectedMaterialConfig: MaterialSchema | null;
    selectedMaterialConfigs: MaterialSchema[];
}

class StandataImportModal extends React.Component<
    StandataImportModalProps,
    StandataImportModalState
> {
    constructor(props: StandataImportModalProps) {
        super(props);
        this.state = {
            selectedMaterialConfig: null,
            selectedMaterialConfigs: [],
        };
    }

    handleMaterialSelect = (materialConfig: MaterialSchema | null) => {
        if (materialConfig) {
            this.setState((prevState) => ({
                selectedMaterialConfigs: [...prevState.selectedMaterialConfigs, materialConfig],
                selectedMaterialConfig: null,
            }));
        }
    };

    handleRemoveMaterial = (index: number) => {
        this.setState((prevState) => ({
            selectedMaterialConfigs: prevState.selectedMaterialConfigs.filter(
                (_, i) => i !== index,
            ),
        }));
    };

    addMaterials = () => {
        const { selectedMaterialConfigs } = this.state;
        const materials = selectedMaterialConfigs.map((config) => new Made.Material(config));
        const { onSubmit } = this.props;
        onSubmit(materials);
        this.setState({ selectedMaterialConfigs: [] });
    };

    render() {
        const { show, onClose, defaultMaterialConfigs } = this.props;
        const { selectedMaterialConfig, selectedMaterialConfigs } = this.state;

        const selectedMaterials = selectedMaterialConfigs.map(
            (config) => new Made.Material(config),
        );

        const columns: GridColDef[] = [
            { field: "name", headerName: "Name", flex: 1 },
            { field: "lattice", headerName: "Lattice", flex: 1 },
            { field: "formula", headerName: "Formula", flex: 1 },
            {
                field: "actions",
                headerName: "Actions",
                flex: 0.5,
                sortable: false,
                filterable: false,
                disableColumnMenu: true,
                renderCell: (params) => (
                    <Button
                        id={`${params.row.name.replace(/\s+/g, "-")}-remove-button`}
                        variant="text"
                        color="warning"
                        size="small"
                        onClick={() => this.handleRemoveMaterial(params.row.id)}
                    >
                        Remove
                    </Button>
                ),
            },
        ];

        return (
            <Dialog
                open={show}
                id="standataImportModalDialog"
                title="Import from Standata"
                onClose={onClose}
                onSubmit={this.addMaterials}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Autocomplete
                            disablePortal
                            size="small"
                            options={defaultMaterialConfigs || []}
                            value={selectedMaterialConfig || null}
                            getOptionLabel={(material) => material.name || "Not available"}
                            onChange={(event, newValue) => this.handleMaterialSelect(newValue)}
                            renderInput={(params) => (
                                // eslint-disable-next-line react/jsx-props-no-spreading
                                <TextField {...params} label="Select Material" />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} style={{ height: 400 }}>
                        <DataGrid
                            data-name="data-grid"
                            hideFooter
                            rows={selectedMaterials.map((material, index) => ({
                                name: material.name,
                                lattice: material.lattice?.type || "TRI",
                                formula: material.formula || "Not available",
                                id: index,
                            }))}
                            columns={columns}
                        />
                    </Grid>
                </Grid>
            </Dialog>
        );
    }
}

export default StandataImportModal;
