import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import { Made } from "@exabyte-io/made.js";
import { darkScrollbar } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React from "react";

import { theme } from "../../../../settings";
import { ExecutionStatus } from "./CodeExecutionControls";
import MaterialsSelector from "./MaterialsSelector";

interface JupyterLiteTransformationProps {
    materials: Made.Material[];
    show: boolean;
    onSubmit: (newMaterials: Made.Material[]) => void;
    onHide: () => void;
}

interface JupyterLiteTransformationState {
    materials: Made.Material[];
    selectedMaterials: Made.Material[];
    newMaterials: Made.Material[];
    executionStatus: ExecutionStatus;
}

const ORIGIN_URL = "http://localhost:8000";
const IFRAME_ID = "jupyter-lite-iframe";

class JupyterLiteTransformation extends React.Component<
    JupyterLiteTransformationProps,
    JupyterLiteTransformationState
> {
    constructor(props: JupyterLiteTransformationProps) {
        super(props);
        this.state = {
            materials: props.materials,
            selectedMaterials: [props.materials[0]],
            newMaterials: [],
            executionStatus: ExecutionStatus.Ready,
        };
    }

    componentDidMount() {
        window.addEventListener("message", this.handleReceiveMessage, false);
    }

    componentDidUpdate(
        prevProps: JupyterLiteTransformationProps,
        prevState: JupyterLiteTransformationState,
    ) {
        const { materials } = this.props;
        if (prevProps.materials !== materials) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ materials });
        }

        const { selectedMaterials } = this.state;
        if (prevState.selectedMaterials !== selectedMaterials) {
            this.sendMessageToIFrame();
        }
    }

    componentWillUnmount() {
        window.removeEventListener("message", this.handleReceiveMessage, false);
    }

    handleReceiveMessage = (event: any) => {
        // Check if the message is from the expected source
        if (event.origin !== ORIGIN_URL) {
            return;
        }
        if (event.data.type === "from-iframe-to-host") {
            console.log("Received data from JupyterLite:", event.data, event.origin);
            try {
                if (Array.isArray(event.data.data.materials)) {
                    this.setState({ newMaterials: event.data.data.materials });
                }
            } catch (err) {
                console.log(err);
            }
            if (event.data.requestData === true) {
                this.sendMessageToIFrame();
            }
        }
    };

    handleSubmit = async () => {
        const { onSubmit, materials } = this.props;
        const { newMaterials } = this.state;

        onSubmit(newMaterials);
        this.setState({ selectedMaterials: [materials[0]], newMaterials: [] });
    };

    sendMessageToIFrame() {
        const { selectedMaterials } = this.state;
        const message = {
            type: "from-host-to-iframe",
            data: selectedMaterials.map((material) => material.toJSON()),
        };
        const iframe = document.getElementById(IFRAME_ID) as HTMLIFrameElement;
        if (!iframe) {
            console.error("JupyterLite iframe not found");
        }
        const postMessage = () => {
            if (iframe.contentWindow) {
                iframe.contentWindow.postMessage(message, ORIGIN_URL);
            }
        };

        if (iframe.onload) {
            postMessage();
        } else {
            iframe.onload = postMessage;
        }
    }

    render() {
        const { materials, selectedMaterials, newMaterials, executionStatus } = this.state;
        const { show, onHide } = this.props;

        return (
            <Dialog
                id="python-transformation-dialog"
                open={show}
                onClose={onHide}
                fullWidth
                maxWidth="xl"
                onSubmit={this.handleSubmit}
                title="Jupyter Lite Transformation"
                isSubmitButtonDisabled={executionStatus !== ExecutionStatus.Ready}
            >
                <DialogContent
                    sx={{
                        height: "calc(100vh - 260px)",
                        ...(theme.palette.mode === "dark" ? darkScrollbar() : null),
                    }}
                >
                    <Grid
                        container
                        spacing={2}
                        id="python-transformation-dialog-content"
                        sx={{ height: "100%" }}
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
                                height: "calc(100% - 165px)",
                                overflow: "hidden",
                            }}
                        >
                            <Paper
                                sx={{
                                    height: "100%",
                                }}
                            >
                                <iframe
                                    name="jupyterlite"
                                    title="JupyterLite"
                                    id={IFRAME_ID}
                                    src={ORIGIN_URL}
                                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-top-navigation-by-user-activation allow-downloads"
                                    width="100%"
                                    height="100%"
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
                                setSelectedMaterials={(newMaterials) =>
                                    this.setState({ newMaterials })
                                }
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        );
    }
}

export default JupyterLiteTransformation;
