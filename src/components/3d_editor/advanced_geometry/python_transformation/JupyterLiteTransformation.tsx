import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import JupyterLiteSession from "@exabyte-io/cove.js/dist/other/jupyterlite/JupyterLiteSession";
import MessageHandler from "@exabyte-io/cove.js/dist/other/jupyterlite/MessageHandler";
import { Made } from "@exabyte-io/made.js";
import { IframeMessageSchema, MaterialSchema } from "@mat3ra/esse/lib/js/types";
import { darkScrollbar } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
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
        this.messageHandler.addHandlers("set-data", [this.createMaterials]);
        this.messageHandler.addHandlers("get-data", [this.returnMaterials]);
    }

    componentDidUpdate(prevProps: JupyterLiteTransformationProps) {
        const { materials } = this.props;
        if (prevProps.materials !== materials) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ materials });
        }
    }

    returnMaterials = () => {
        const { selectedMaterials } = this.state;
        return selectedMaterials.map((material) => material.toJSON());
    };

    // handleSendData = (variableName: string) => {
    //     // In case functions to retrieve a value depend on the variable name, we can filter based on that
    //     const handlers = [{ variableName: "materials_in", handler: this.returnMaterials }];
    //     return handlers.find((handler) => handler.variableName === variableName)?.handler;
    // };

    createMaterials = (data: any) => {
        try {
            const configs = data as MaterialSchema[];
            if (Array.isArray(configs)) {
                this.setState({
                    newMaterials: configs.map((config) => new Made.Material(config)),
                });
            }
        } catch (e) {
            console.log(e);
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
                    <button onClick={() => this.messageHandler.sendData("materials_in")}>
                        Test Send
                    </button>
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
                                originURL="http://localhost:8000"
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
