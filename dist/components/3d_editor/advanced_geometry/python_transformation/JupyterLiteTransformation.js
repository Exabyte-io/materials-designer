import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import MessageHandler from "@exabyte-io/cove.js/dist/other/iframe-messaging";
import JupyterLiteSession from "@exabyte-io/cove.js/dist/other/jupyterlite/JupyterLiteSession";
import { Made } from "@mat3ra/made";
import { darkScrollbar } from "@mui/material";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { enqueueSnackbar } from "notistack";
import React from "react";
import { theme } from "../../../../settings";
import MaterialsSelector from "./MaterialsSelector";
const DEFAULT_NOTEBOOK_PATH = "api-examples/other/materials_designer/Introduction.ipynb";
class JupyterLiteTransformation extends React.Component {
    constructor(props) {
        super(props);
        this.messageHandler = new MessageHandler();
        this.returnSelectedMaterials = () => {
            const { selectedMaterials } = this.state;
            return selectedMaterials.map((material) => material.toJSON());
        };
        this.validateMaterialConfigs = (configs) => {
            const validationErrors = [];
            const validatedMaterials = configs.reduce((validMaterials, config) => {
                try {
                    const material = new Made.Material(config);
                    material.validate();
                    validMaterials.push(material);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }
                catch (e) {
                    validationErrors.push(`Failed to create material ${config.name}: ${JSON.stringify(e.details.error[0])}`);
                }
                return validMaterials;
            }, []);
            return { validatedMaterials, validationErrors };
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.handleSetMaterials = (data) => {
            const configs = data.materials;
            if (Array.isArray(configs)) {
                const { validatedMaterials, validationErrors } = this.validateMaterialConfigs(configs);
                this.setState({ newMaterials: validatedMaterials });
                validationErrors.forEach((errorMessage) => {
                    enqueueSnackbar(errorMessage, { variant: "error" });
                });
            }
            else {
                enqueueSnackbar("Invalid material data received", { variant: "error" });
            }
        };
        this.handleSubmit = async () => {
            const { onSubmit, materials } = this.props;
            const { newMaterials } = this.state;
            onSubmit(newMaterials);
            this.setState({ selectedMaterials: [materials[0]], newMaterials: [] });
        };
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
    componentDidUpdate(prevProps) {
        const { materials } = this.props;
        if (prevProps.materials !== materials) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ materials });
        }
        this.messageHandler.sendData(this.returnSelectedMaterials());
    }
    render() {
        const { materials, selectedMaterials, newMaterials } = this.state;
        const { title, show, onHide } = this.props;
        return (_jsx(Dialog, { id: "jupyterlite-transformation-dialog", open: show, onClose: onHide, fullWidth: true, maxWidth: "xl", onSubmit: this.handleSubmit, title: title, isSubmitButtonDisabled: newMaterials.length === 0, children: _jsxs(Grid, { container: true, spacing: 1, id: "jupyterlite-transformation-dialog-content", sx: {
                    height: "calc(100vh - 260px)",
                    ...(theme.palette.mode === "dark" ? darkScrollbar() : null),
                }, children: [_jsx(Grid, { item: true, xs: 12, md: 4, alignItems: "center", children: _jsxs(Typography, { variant: "subtitle1", children: ["Input Materials (", _jsx("code", { children: "materials_in" }), ")"] }) }), _jsx(Grid, { item: true, xs: 12, md: 8, children: _jsx(MaterialsSelector, { materials: materials, selectedMaterials: selectedMaterials, setSelectedMaterials: (newMaterials) => this.setState({ selectedMaterials: newMaterials }), testId: "materials-in-selector" }) }), _jsx(Grid, { pt: 0, item: true, xs: 12, id: "execution-cells", sx: {
                            height: "calc(100% - 80px)",
                            overflow: "hidden",
                        }, children: _jsx(Paper, { sx: {
                                height: "100%",
                            }, children: _jsx(JupyterLiteSession, { defaultNotebookPath: DEFAULT_NOTEBOOK_PATH, messageHandler: this.messageHandler }) }) }), _jsx(Grid, { item: true, container: true, xs: 12, md: 4, alignItems: "center", children: _jsxs(Typography, { variant: "subtitle1", children: ["Output Materials (", _jsx("code", { children: "materials_out" }), ")"] }) }), _jsx(Grid, { item: true, xs: 12, md: 8, children: _jsx(MaterialsSelector, { materials: newMaterials, selectedMaterials: newMaterials, setSelectedMaterials: (newMaterials) => this.setState({ newMaterials }) }) })] }) }));
    }
}
export default JupyterLiteTransformation;
