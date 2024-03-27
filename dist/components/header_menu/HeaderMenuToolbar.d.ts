export default HeaderMenuToolbar;
declare class HeaderMenuToolbar extends React.Component<any, any, any> {
    constructor(config: any);
    state: {
        showSupercellDialog: boolean;
        showSurfaceDialog: boolean;
        showExportMaterialsDialog: boolean;
        showStandataImportDialog: boolean;
        showDefaultImportModalDialog: boolean;
        showCombinatorialDialog: boolean;
        showInterpolateDialog: boolean;
        showThreejsEditorModal: boolean;
        showBoundaryConditionsDialog: boolean;
        showPythonTransformation: boolean;
        showJupyterLiteTransformation: boolean;
    };
    _handleConventionalCellSelect: () => any;
    renderIOMenu(): import("react/jsx-runtime").JSX.Element;
    renderEditMenu(): import("react/jsx-runtime").JSX.Element;
    renderViewMenu(): import("react/jsx-runtime").JSX.Element;
    renderAdvancedMenu(): import("react/jsx-runtime").JSX.Element;
    openPageByURL: (url: any) => void;
    renderHelpMenu(): import("react/jsx-runtime").JSX.Element;
    renderSpinner(): import("react/jsx-runtime").JSX.Element;
    renderImportModal: () => any;
    renderSaveActionDialog: () => any;
    renderThreejsEditorModal(): import("react/jsx-runtime").JSX.Element;
    render(): import("react/jsx-runtime").JSX.Element;
}
declare namespace HeaderMenuToolbar {
    namespace propTypes {
        const className: PropTypes.Requireable<string>;
        const isLoading: PropTypes.Validator<boolean>;
        const material: PropTypes.Validator<object>;
        const materials: PropTypes.Validator<any[]>;
        const index: PropTypes.Validator<number>;
        const maxCombinatorialBasesCount: PropTypes.Validator<number>;
        const defaultMaterialsSet: PropTypes.Validator<any[]>;
        const onUpdate: PropTypes.Validator<(...args: any[]) => any>;
        const onUndo: PropTypes.Validator<(...args: any[]) => any>;
        const onRedo: PropTypes.Validator<(...args: any[]) => any>;
        const onSave: PropTypes.Validator<(...args: any[]) => any>;
        const onReset: PropTypes.Validator<(...args: any[]) => any>;
        const onClone: PropTypes.Validator<(...args: any[]) => any>;
        const onToggleIsNonPeriodic: PropTypes.Validator<(...args: any[]) => any>;
        const onAdd: PropTypes.Validator<(...args: any[]) => any>;
        const onExport: PropTypes.Validator<(...args: any[]) => any>;
        const onExit: PropTypes.Validator<(...args: any[]) => any>;
        const onGenerateSupercell: PropTypes.Validator<(...args: any[]) => any>;
        const onGenerateSurface: PropTypes.Validator<(...args: any[]) => any>;
        const onSetBoundaryConditions: PropTypes.Validator<(...args: any[]) => any>;
        const onSectionVisibilityToggle: PropTypes.Validator<(...args: any[]) => any>;
        const isVisibleItemsList: PropTypes.Validator<boolean>;
        const isVisibleSourceEditor: PropTypes.Validator<boolean>;
        const isVisibleThreeDEditorFullscreen: PropTypes.Validator<boolean>;
        const openImportModal: PropTypes.Validator<(...args: any[]) => any>;
        const closeImportModal: PropTypes.Validator<(...args: any[]) => any>;
        const openSaveActionDialog: PropTypes.Requireable<(...args: any[]) => any>;
        const children: PropTypes.Requireable<PropTypes.ReactNodeLike>;
    }
    namespace defaultProps {
        const className_1: undefined;
        export { className_1 as className };
        const openSaveActionDialog_1: null;
        export { openSaveActionDialog_1 as openSaveActionDialog };
        const children_1: null;
        export { children_1 as children };
    }
}
import React from "react";
import PropTypes from "prop-types";
