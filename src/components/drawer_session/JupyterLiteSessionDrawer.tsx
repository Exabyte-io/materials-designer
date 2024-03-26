import ResizableDrawer from "@exabyte-io/cove.js/dist/mui/components/custom/resizable-drawer/ResizableDrawer";
import MessageHandler from "@exabyte-io/cove.js/dist/other/iframe-messaging";
import JupyterLiteSession from "@exabyte-io/cove.js/dist/other/jupyterlite/JupyterLiteSession";
import { MaterialSchema } from "@mat3ra/esse/dist/js/types";
import { Made } from "@mat3ra/made";
import { enqueueSnackbar } from "notistack";
import React from "react";

interface JupyterLiteTransformationProps {
    materials: Made.Material[];
    show: boolean;
    onUpdate: (newMaterials: Made.Material[]) => void;
    onHide: () => void;
    containerRef: React.RefObject<HTMLDivElement>;
}

const DEFAULT_NOTEBOOK_PATH = "api-examples/other/materials_designer/Introduction.ipynb";

class JupyterLiteSessionDrawer extends React.Component<JupyterLiteTransformationProps> {
    messageHandler = new MessageHandler();

    // eslint-disable-next-line no-useless-constructor
    constructor(props: JupyterLiteTransformationProps) {
        super(props);
    }

    componentDidMount() {
        this.messageHandler.addHandlers("set-data", [this.handleSetMaterials]);
        this.messageHandler.addHandlers("get-data", [this.returnSelectedMaterials]);
    }

    componentDidUpdate(prevProps: JupyterLiteTransformationProps) {
        this.messageHandler.sendData(this.returnSelectedMaterials());
    }

    returnSelectedMaterials = () => {
        const { materials } = this.props;
        return materials.map((material) => material.toJSON());
    };

    validateMaterialConfigs = (configs: MaterialSchema[]) => {
        const validationErrors: string[] = [];
        const validatedMaterials = configs.reduce((validMaterials, config) => {
            try {
                const material = new Made.Material(config);
                material.validate();
                validMaterials.push(material);
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

    handleSetMaterials = (data: any) => {
        const { onUpdate } = this.props;
        const configs = data.materials as MaterialSchema[];
        if (Array.isArray(configs)) {
            const { validatedMaterials, validationErrors } = this.validateMaterialConfigs(configs);

            onUpdate(validatedMaterials);

            validationErrors.forEach((errorMessage) => {
                enqueueSnackbar(errorMessage, { variant: "error" });
            });
        } else {
            enqueueSnackbar("Invalid material data received", { variant: "error" });
        }
    };

    render() {
        const { show, onHide, containerRef } = this.props;

        return (
            <div style={{ display: show ? "block" : "none" }}>
                <ResizableDrawer open={show} onClose={onHide} containerRef={containerRef}>
                    <JupyterLiteSession
                        originURL="https://jupyterlite.mat3ra.com"
                        defaultNotebookPath={DEFAULT_NOTEBOOK_PATH}
                        messageHandler={this.messageHandler}
                    />
                </ResizableDrawer>
            </div>
        );
    }
}

export default JupyterLiteSessionDrawer;
