/** eslint-disable-next-line react/no-unused-prop-types * */
import MessageHandler from "@exabyte-io/cove.js/dist/other/iframe-messaging";
import { Made } from "@mat3ra/made";
import { enqueueSnackbar } from "notistack";
import React from "react";
class BaseJupyterLiteSessionComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.messageHandler = new MessageHandler();
        // eslint-disable-next-line react/no-unused-class-component-methods
        this.DEFAULT_NOTEBOOK_PATH = "api-examples/other/materials_designer/Introduction.ipynb";
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
                    validationErrors.push(`Failed to create material ${config.name}: ${e.message}`);
                }
                return validMaterials;
            }, []);
            return { validatedMaterials, validationErrors };
        };
        this.handleSetMaterials = (data) => {
            const configs = data.materials;
            if (Array.isArray(configs)) {
                const { validatedMaterials, validationErrors } = this.validateMaterialConfigs(configs);
                const { onMaterialsUpdate } = this.props;
                onMaterialsUpdate(validatedMaterials);
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
}
export default BaseJupyterLiteSessionComponent;
