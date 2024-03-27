/** eslint-disable-next-line react/no-unused-prop-types * */
import MessageHandler from "@exabyte-io/cove.js/dist/other/iframe-messaging";
import { MaterialSchema } from "@mat3ra/esse/dist/js/types";
import { Made } from "@mat3ra/made";
import { enqueueSnackbar } from "notistack";
import React from "react";

export interface BaseJupyterLiteProps {
    materials: Made.Material[];
    // eslint-disable-next-line react/no-unused-prop-types
    show: boolean;
    onMaterialsUpdate: (newMaterials: Made.Material[]) => void;
    // eslint-disable-next-line react/no-unused-prop-types
    onHide: () => void;
    // eslint-disable-next-line react/no-unused-prop-types
    title?: string;
    // eslint-disable-next-line react/no-unused-prop-types
    containerRef?: React.RefObject<HTMLDivElement>;
}

class BaseJupyterLiteSessionComponent extends React.Component<BaseJupyterLiteProps> {
    messageHandler = new MessageHandler();

    // eslint-disable-next-line react/no-unused-class-component-methods
    DEFAULT_NOTEBOOK_PATH = "api-examples/other/materials_designer/Introduction.ipynb";

    componentDidMount() {
        this.messageHandler.addHandlers("set-data", [this.handleSetMaterials]);
        this.messageHandler.addHandlers("get-data", [this.returnSelectedMaterials]);
    }

    componentDidUpdate(prevProps: BaseJupyterLiteProps) {
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
                validationErrors.push(`Failed to create material ${config.name}: ${e.message}`);
            }
            return validMaterials;
        }, [] as Made.Material[]);
        return { validatedMaterials, validationErrors };
    };

    handleSetMaterials = (data: any) => {
        const configs = data.materials as MaterialSchema[];
        if (Array.isArray(configs)) {
            const { validatedMaterials, validationErrors } = this.validateMaterialConfigs(configs);
            const { onMaterialsUpdate } = this.props;
            onMaterialsUpdate(validatedMaterials);
            validationErrors.forEach((errorMessage) => {
                enqueueSnackbar(errorMessage, { variant: "error" });
            });
        } else {
            enqueueSnackbar("Invalid material data received", { variant: "error" });
        }
    };
}

export default BaseJupyterLiteSessionComponent;
