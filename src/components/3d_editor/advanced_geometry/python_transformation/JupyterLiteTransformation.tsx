import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import JupyterLiteSession from "@exabyte-io/cove.js/dist/other/jupyterlite/JupyterLiteSession";
import { darkScrollbar } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React from "react";

import { theme } from "../../../../settings";
import BaseJupyterLiteSessionComponent, {
    BaseJupyterLiteProps,
} from "../../../include/jupyterlite/BaseJupyterLiteComponent";
import MaterialsSelector from "./MaterialsSelector";

class JupyterLiteTransformationDialog extends BaseJupyterLiteSessionComponent {
    state = {
        selectedMaterials: [this.props.materials[0]],
        newMaterials: [],
    };

    componentDidUpdate(prevProps: BaseJupyterLiteProps) {
        if (prevProps.materials !== this.props.materials) {
            this.setState({ selectedMaterials: [this.props.materials[0]], newMaterials: [] });
        }
    }

    handleSubmit = () => {
        this.props.onMaterialsUpdate(this.state.newMaterials);
    };

    render() {
        const { title, show, onHide, materials } = this.props;
        const { selectedMaterials, newMaterials } = this.state;

        return (
            <Dialog
                id="jupyterlite-transformation-dialog"
                open={show}
                onClose={onHide}
                fullWidth
                maxWidth="xl"
                onSubmit={this.handleSubmit}
                title={title}
                isSubmitButtonDisabled={newMaterials.length === 0}
            >
                <Grid
                    container
                    spacing={1}
                    id="jupyterlite-transformation-dialog-content"
                    sx={{
                        height: "calc(100vh - 260px)",
                        ...(theme.palette.mode === "dark" ? darkScrollbar() : null),
                    }}
                >
                    <Grid item xs={12} md={4} alignItems="center">
                        <Typography variant="subtitle1">
                            Input Materials (<code>materials_in</code>)
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <MaterialsSelector
                            materials={materials}
                            selectedMaterials={selectedMaterials}
                            setSelectedMaterials={(newMaterials) =>
                                this.setState({ selectedMaterials: newMaterials })
                            }
                            testId="materials-in-selector"
                        />
                    </Grid>
                    <Grid
                        pt={0}
                        item
                        xs={12}
                        id="execution-cells"
                        sx={{
                            height: "calc(100% - 80px)",
                            overflow: "hidden",
                        }}
                    >
                        <Paper
                            sx={{
                                height: "100%",
                            }}
                        >
                            <JupyterLiteSession
                                defaultNotebookPath={this.DEFAULT_NOTEBOOK_PATH}
                                messageHandler={this.messageHandler}
                            />
                        </Paper>
                    </Grid>
                    <Grid item container xs={12} md={4} alignItems="center">
                        <Typography variant="subtitle1">
                            Output Materials (<code>materials_out</code>)
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <MaterialsSelector
                            materials={newMaterials}
                            selectedMaterials={newMaterials}
                            setSelectedMaterials={(newMaterials) => this.setState({ newMaterials })}
                        />
                    </Grid>
                </Grid>
            </Dialog>
        );
    }
}

export default JupyterLiteTransformationDialog;
