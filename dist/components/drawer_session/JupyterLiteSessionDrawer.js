import { jsx as _jsx } from "react/jsx-runtime";
import ResizableDrawer from "@exabyte-io/cove.js/dist/mui/components/custom/resizable-drawer/ResizableDrawer";
import MessageHandler from "@exabyte-io/cove.js/dist/other/iframe-messaging";
import JupyterLiteSession from "@exabyte-io/cove.js/dist/other/jupyterlite/JupyterLiteSession";
import { Made } from "@mat3ra/made";
import { enqueueSnackbar } from "notistack";
import React from "react";
const DEFAULT_NOTEBOOK_PATH = "api-examples/other/materials_designer/Introduction.ipynb";
class JupyterLiteSessionDrawer extends React.Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
        this.messageHandler = new MessageHandler();
        this.returnSelectedMaterials = () => {
            const { materials } = this.props;
            return materials.map((material) => material.toJSON());
        };
        this.validateMaterialConfigs = (configs) => {
            const validationErrors = [];
            const validatedMaterials = configs.reduce((validMaterials, config) => {
                try {
                    const material = new Made.Material(config);
                    material.validate();
                    validMaterials.push(material);
                }
                catch (e) {
                    validationErrors.push(`Failed to create material ${config.name}: ${JSON.stringify(e.details.error[0])}`);
                }
                return validMaterials;
            }, []);
            return { validatedMaterials, validationErrors };
        };
        this.handleSetMaterials = (data) => {
            const { onUpdate } = this.props;
            const configs = data.materials;
            if (Array.isArray(configs)) {
                const { validatedMaterials, validationErrors } = this.validateMaterialConfigs(configs);
                onUpdate(validatedMaterials);
                validationErrors.forEach((errorMessage) => {
                    enqueueSnackbar(errorMessage, { variant: "error" });
                });
            }
            else {
                enqueueSnackbar("Invalid material data received", { variant: "error" });
            }
        };
    }
    componentDidMount() {
        this.messageHandler.addHandlers("set-data", [this.handleSetMaterials]);
        this.messageHandler.addHandlers("get-data", [this.returnSelectedMaterials]);
    }
    componentDidUpdate(prevProps) {
        this.messageHandler.sendData(this.returnSelectedMaterials());
    }
    render() {
        const { show, onHide, containerRef } = this.props;
        return (_jsx("div", { style: { display: show ? "block" : "none" }, children: _jsx(ResizableDrawer, { open: show, onClose: onHide, containerRef: containerRef, children: _jsx(JupyterLiteSession, { originURL: "https://jupyterlite.mat3ra.com", defaultNotebookPath: DEFAULT_NOTEBOOK_PATH, messageHandler: this.messageHandler }) }) }));
    }
}
export default JupyterLiteSessionDrawer;
