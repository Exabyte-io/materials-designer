import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import { Made } from "@exabyte-io/made.js";
import DeleteIcon from "@mui/icons-material/Delete";
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
    defaultMaterialsSet: Made.Material[];
}

interface StandataImportModalState {
    selectedMaterial: Made.Material | null;
    selectedMaterials: Made.Material[];
}

class StandataImportModal extends React.Component<
    StandataImportModalProps,
    StandataImportModalState
> {
    constructor(props: StandataImportModalProps) {
        super(props);
        this.state = {
            selectedMaterial: null,
            selectedMaterials: [],
        };
    }

    handleMaterialSelect = (material: Made.Material | null) => {
        if (material) {
            this.setState((prevState) => ({
                selectedMaterials: [...prevState.selectedMaterials, material],
                selectedMaterial: null,
            }));
        }
    };

    handleRemoveMaterial = (id: number) => {
        this.setState((prevState) => ({
            selectedMaterials: prevState.selectedMaterials.filter((_, index) => index !== id),
        }));
    };

    addMaterials = () => {
        const { selectedMaterials } = this.state;
        const newMaterials = selectedMaterials.map((material) => new Made.Material(material));
        const { onSubmit } = this.props;
        onSubmit(newMaterials);
        this.setState({ selectedMaterials: [] });
    };

    render() {
        const { show, onClose, defaultMaterialsSet } = this.props,
            { selectedMaterial, selectedMaterials } = this.state;

        const columns: GridColDef[] = [
            { field: "name", headerName: "Name", flex: 1 },
            { field: "lattice-type", headerName: "Lattice", flex: 1 },
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
                            options={defaultMaterialsSet}
                            getOptionLabel={(material) => material.name || "Not available"}
                            value={selectedMaterial}
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
                                ...material,
                                id: index,
                            }))}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            disableSelectionOnClick
                        />
                    </Grid>
                </Grid>
            </Dialog>
        );
    }
}

export default StandataImportModal;
