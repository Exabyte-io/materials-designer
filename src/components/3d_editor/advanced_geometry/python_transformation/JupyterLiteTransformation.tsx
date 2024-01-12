import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import IconByName from "@exabyte-io/cove.js/dist/mui/components/icon/IconByName";
import { Made } from "@exabyte-io/made.js";
import { darkScrollbar } from "@mui/material";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react";
import NPMsAlert from "react-s-alert";

import { theme } from "../../../../settings";
import CodeExecutionControls, { ExecutionStatus } from "./CodeExecutionControls";
import MaterialsSelector from "./MaterialsSelector";
import TransformationSelector, { Transformation } from "./TransformationSelector";

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
    transformation: Transformation | null;
    pythonCode: string;
}

const ORIGIN_URL = "http://localhost:3001";

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
            transformation: null,
            pythonCode: "",
        };
    }

    componentDidMount() {
        window.addEventListener("message", (event) => {
            console.log("added event listener, event:", event);

            if (event.data.type === "fromJupyterLite") {
                console.log("Received data from JupyterLite:", event.data.data);
            }
        });
    }

    componentDidUpdate(prevProps: JupyterLiteTransformationProps) {
        const { materials } = this.props;
        if (prevProps.materials !== materials) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ materials });
        }
    }

    handleSubmit = async () => {
        const { onSubmit, materials } = this.props;
        const { newMaterials } = this.state;

        onSubmit(newMaterials);
        this.setState({ selectedMaterials: [materials[0]], newMaterials: [] });
    };

    // eslint-disable-next-line class-methods-use-this
    sendMessageToIFrame(data: any) {
        const iframe = document.getElementById("jupyter-lite-iframe");
        if (iframe) {
            // @ts-ignore
            iframe.contentWindow.postMessage({ type: "fromHost", data }, window.location.origin);
            console.log("Sent data to JupyterLite:", data);
        } else {
            NPMsAlert.error("JupyterLite iframe not found");
        }
        // @ts-ignore
        window.frames.jupyterlite.postMessage({ type: "fromHost", data: "hello" });
    }

    render() {
        const {
            pythonCode,
            transformation,
            materials,
            selectedMaterials,
            newMaterials,
            executionStatus,
        } = this.state;
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
                        <Grid item xs={12}>
                            <Stack direction="row" display="flex" justifyContent="flex-end">
                                <Button
                                    id="download-code-button"
                                    color="secondary"
                                    onClick={() => {
                                        console.log("download code");
                                    }}
                                >
                                    Download Code
                                    <IconByName name="actions.download" />
                                </Button>
                                <CodeExecutionControls
                                    buttonProps={{
                                        id: "run-jl",
                                        title: "Run",
                                        variant: "contained",
                                        color: "primary",
                                    }}
                                    handleRun={() => {
                                        this.sendMessageToIFrame({
                                            type: "fromHost",
                                            data: {
                                                materials: selectedMaterials,
                                            },
                                        });
                                    }}
                                    executionStatus={executionStatus}
                                />
                            </Stack>
                        </Grid>
                        <Grid
                            pt={0}
                            item
                            xs={12}
                            id="execution-cells"
                            sx={{
                                height: "calc(100% - 165px)",
                                overflowY: "hidden",
                            }}
                        >
                            <Paper
                                sx={{
                                    height: "100%",
                                }}
                            >
                                {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
                                <iframe
                                    name="jupyterlite"
                                    id="jupyter-lite-iframe"
                                    src="https://jupyter-lite.mat3ra.com/lab/"
                                    sandbox="allow-scripts allow-same-origin"
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
