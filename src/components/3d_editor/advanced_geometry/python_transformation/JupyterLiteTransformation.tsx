import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import { Made } from "@exabyte-io/made.js";
import { darkScrollbar } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React from "react";
import NPMsAlert from "react-s-alert";

import { theme } from "../../../../settings";
import MaterialsSelector from "./MaterialsSelector";

interface JupyterLiteTransformationProps {
    materials: Made.Material[];
    show: boolean;
    onSubmit: (newMaterials: Made.Material[]) => void;
    onHide: () => void;
}

interface JupyterLiteTransformationState {
    materials: Made.Material[];
    newMaterials: Made.Material[];
}

// TODO: set to an actual URL during deployment
const ORIGIN_URL = "http://localhost:8000";
const LOCAL_URL = "http://localhost:3001";
const IFRAME_ID = "jupyter-lite-iframe";

class JupyterLiteTransformation extends React.Component<
    JupyterLiteTransformationProps,
    JupyterLiteTransformationState
> {
    constructor(props: JupyterLiteTransformationProps) {
        super(props);
        this.state = {
            materials: props.materials,
            newMaterials: [],
        };
    }

    componentDidMount() {
        window.addEventListener("message", this.handleReceiveMessage, false);
    }

    componentDidUpdate(prevProps: JupyterLiteTransformationProps) {
        const { materials } = this.props;
        if (prevProps.materials !== materials) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ materials });
        }
    }

    componentWillUnmount() {
        window.removeEventListener("message", this.handleReceiveMessage, false);
    }

    handleReceiveMessage = (event: any) => {
        if (event.origin !== ORIGIN_URL) {
            return;
        }
        if (event.data.type === "from-iframe-to-host") {
            console.log("Received data from JupyterLite:", event.data, event.origin);
            try {
                if (event.data.materials) {
                    const newMaterials = event.data.materials.map((materialConfig: any) => {
                        const newMaterial = new Made.Material(materialConfig);
                        return newMaterial;
                    });
                    this.setState({ newMaterials });
                }
                if (event.data.requestMaterials === true) this.sendMessageToIFrame();
            } catch (err) {
                console.log(err);
            }
        }
    };

    handleSubmit = async () => {
        const { onSubmit } = this.props;
        const { newMaterials } = this.state;

        onSubmit(newMaterials);
        this.setState({ newMaterials: [] });
    };

    sendMessageToIFrame() {
        const { materials } = this.state;
        const materialConfigs = materials.map((material) => material.toJSON());
        const message = {
            type: "from-host-to-iframe",
            materials: materialConfigs,
        };
        const iframe = document.getElementById(IFRAME_ID) as HTMLIFrameElement;
        if (!iframe) {
            NPMsAlert.error("JupyterLite iframe not found");
        }
        const postMessage = () => {
            if (iframe.contentWindow) {
                iframe.contentWindow.postMessage(message, ORIGIN_URL);
                console.debug("Sending message to JupyterLite:", message);
            }
        };

        if (iframe.onload) {
            postMessage();
        } else {
            iframe.onload = postMessage;
        }
    }

    render() {
        const { newMaterials } = this.state;
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
                isSubmitButtonDisabled={newMaterials.length === 0}
            >
                <DialogContent
                    sx={{
                        height: "calc(100vh - 300px)",
                        ...(theme.palette.mode === "dark" ? darkScrollbar() : null),
                    }}
                >
                    <Grid
                        container
                        direction="column"
                        spacing={2}
                        id="python-transformation-dialog-content"
                        height="100%"
                    >
                        <Grid item xs>
                            <iframe
                                name="jupyterlite"
                                title="JupyterLite"
                                id={IFRAME_ID}
                                src={ORIGIN_URL}
                                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-top-navigation-by-user-activation"
                                width="100%"
                                height="100%"
                            />
                        </Grid>
                        <Grid
                            item
                            container
                            spacing={2}
                            alignItems="center"
                            justifyContent="space-between"
                        >
                            <Grid item>
                                <Typography variant="subtitle1">
                                    Output Materials (<code>materials_out</code>)
                                </Typography>
                            </Grid>
                            <Grid item xs>
                                <MaterialsSelector
                                    materials={newMaterials}
                                    selectedMaterials={newMaterials}
                                    setSelectedMaterials={(newMaterials) =>
                                        this.setState({ newMaterials })
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        );
    }
}

export default JupyterLiteTransformation;
