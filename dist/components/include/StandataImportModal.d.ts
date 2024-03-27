import { MaterialSchema } from "@exabyte-io/code.js/dist/types";
import { Made } from "@exabyte-io/made.js";
import React from "react";
interface StandataImportModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (materials: Made.Material[]) => void;
    defaultMaterialConfigs: MaterialSchema[];
}
interface StandataImportModalState {
    selectedMaterialConfigs: MaterialSchema[];
}
declare class StandataImportModal extends React.Component<StandataImportModalProps, StandataImportModalState> {
    constructor(props: StandataImportModalProps);
    handleMaterialSelect: (materialConfigs: MaterialSchema[] | []) => void;
    handleRemoveMaterial: (index: number) => void;
    addMaterials: () => void;
    render(): import("react/jsx-runtime").JSX.Element;
}
export default StandataImportModal;
