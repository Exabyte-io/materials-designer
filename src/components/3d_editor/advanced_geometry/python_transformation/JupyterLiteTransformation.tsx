import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import MessageHandler from "@exabyte-io/cove.js/dist/other/iframe-messaging";
import JupyterLiteSession from "@exabyte-io/cove.js/dist/other/jupyterlite/JupyterLiteSession";
import { MaterialSchema } from "@mat3ra/esse/dist/js/types";
import { Made } from "@mat3ra/made";
import { darkScrollbar } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { enqueueSnackbar } from "notistack";
import React from "react";

import { theme } from "../../../../settings";
import MaterialsSelector from "./MaterialsSelector";

interface JupyterLiteTransformationProps {
    title: string;
    materials: Made.Material[];
    show: boolean;
    onSubmit: (newMaterials: Made.Material[]) => void;
    onHide: () => void;
}

interface JupyterLiteTransformationState {
    materials: Made.Material[];
    selectedMaterials: Made.Material[];
    newMaterials: Made.Material[];
}

const DEFAULT_NOTEBOOK_PATH = "api-examples/other/materials_designer/Introduction.ipynb";

class JupyterLiteTransformation extends React.Component<
    JupyterLiteTransformationProps,
    JupyterLiteTransformationState
> {
    messageHandler = new MessageHandler();

    constructor(props: JupyterLiteTransformationProps) {
        super(props);
        this.state = {
            materials: props.materials,
            selectedMaterials: [props.materials[0]],
            newMaterials: [],
        };
    }

    componentDidMount() {
        this.messageHandler.addHandlers("set-data", [this.handleSetMaterials]);
        this.messageHandler.addHandlers("get-data", [this.returnSelectedMaterials]);
    }

    componentDidUpdate(prevProps: JupyterLiteTransformationProps) {
        const { materials } = this.props;
        if (prevProps.materials !== materials) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ materials });
        }
        this.messageHandler.sendData(this.returnSelectedMaterials());
    }

    returnSelectedMaterials = () => {
        const { selectedMaterials } = this.state;
        return selectedMaterials.map((material) => material.toJSON());
    };

    validateMaterialConfigs = (configs: MaterialSchema[]) => {
        const validationErrors: string[] = [];
        const validatedMaterials = configs.reduce((validMaterials, config) => {
            try {
                const material = new Made.Material(config);
                material.validate();
                validMaterials.push(material);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
                validationErrors.push(
                    `Failed to create material ${config.name}: ${JSON.stringify(
                        e.details.error[0],
                    )}`,
                );
            }
            return validMaterials;
        }, [] as Made.Material[]);
        return { validatedMaterials, validationErrors };
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleSetMaterials = (data: any) => {
        const configs = data.materials as MaterialSchema[];
        if (Array.isArray(configs)) {
            const { validatedMaterials, validationErrors } = this.validateMaterialConfigs(configs);

            this.setState({ newMaterials: validatedMaterials });

            validationErrors.forEach((errorMessage) => {
                enqueueSnackbar(errorMessage, { variant: "error" });
            });
        } else {
            enqueueSnackbar("Invalid material data received", { variant: "error" });
        }
    };

    handleSubmit = async () => {
        const { onSubmit, materials } = this.props;
        const { newMaterials } = this.state;

        onSubmit(newMaterials);
        this.setState({ selectedMaterials: [materials[0]], newMaterials: [] });
    };

    render() {
        const { materials, selectedMaterials, newMaterials } = this.state;
        const { title, show, onHide } = this.props;

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
                                defaultNotebookPath={DEFAULT_NOTEBOOK_PATH}
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

export default JupyterLiteTransformation;
