import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import setClass from "classnames";
import { mix } from "mixwith";
import PropTypes from "prop-types";
import React from "react";

import { ThreeDEditorFullscreen } from "./components/3d_editor/ThreeDEditorFullscreen";
import EditorSelectionInfo from "./components/3d_editor_selection_info/EditorSelectionInfo";
import HeaderMenuToolbar from "./components/header_menu/HeaderMenuToolbar";
import DefaultImportModalDialog from "./components/include/DefaultImportModalDialog";
import { FullscreenComponentMixin } from "./components/include/FullscreenComponentMixin";
import { DarkMaterialUITheme } from "./components/include/material-ui/theme";
import ItemsList from "./components/items_list/ItemsList";
import SourceEditor from "./components/source_editor/SourceEditor";
import { Material } from "./material";

class MaterialsDesigner extends mix(React.Component).with(FullscreenComponentMixin) {
    constructor(props) {
        super(props);
        this.state = {
            isFullscreen: false,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        const [nextProps_, thisProps_, nextState_, thisState_] = [
            nextProps,
            this.props,
            nextState,
            this.state,
        ].map(JSON.stringify);
        return !(nextProps_ === thisProps_) || !(nextState_ === thisState_);
    }

    toggleFullscreen = () => {
        this.setState({ isFullscreen: !this.state.isFullscreen });
    };

    render() {
        return (
            <this.FullscreenHandlerComponent
                className={setClass(this.props.className)}
                enabled={this.state.isFullscreen}
                onChange={(isFullscreen) => this.setState({ isFullscreen })}
            >
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={DarkMaterialUITheme}>
                        <div
                            className={setClass(
                                "materials-designer col-xs-12",
                                this.props.className,
                            )}
                            id="materialEditForm"
                        >
                            <div className="bgm-dark row">
                                {/* TODO: find out how to avoid passing material to header */}
                                <HeaderMenuToolbar
                                    isLoading={this.props.isLoading}
                                    material={this.props.material}
                                    materials={this.props.materials}
                                    index={this.props.index}
                                    isFullscreen={this.state.isFullscreen}
                                    toggleFullscreen={this.toggleFullscreen}
                                    onUndo={this.props.onUndo}
                                    onRedo={this.props.onRedo}
                                    onReset={this.props.onReset}
                                    onClone={this.props.onClone}
                                    onToggleIsNonPeriodic={this.props.onToggleIsNonPeriodic}
                                    onUpdate={this.props.onUpdate}
                                    onAdd={this.props.onAdd}
                                    onExport={this.props.onExport}
                                    onSave={this.props.onSave}
                                    onExit={this.props.onExit}
                                    ImportModal={this.props.ImportModal || DefaultImportModalDialog}
                                    SaveActionDialog={this.props.SaveActionDialog}
                                    onGenerateSupercell={this.props.onGenerateSupercell}
                                    onGenerateSurface={this.props.onGenerateSurface}
                                    onSetBoundaryConditions={this.props.onSetBoundaryConditions}
                                    maxCombinatorialBasesCount={
                                        this.props.maxCombinatorialBasesCount
                                    }
                                    defaultMaterialsSet={this.props.defaultMaterialsSet}
                                />
                                <div className="bgm-dark col-xs-12">
                                    <ItemsList
                                        className="col-md-2 p-5"
                                        materials={this.props.materials}
                                        index={this.props.index}
                                        onItemClick={this.props.onItemClick}
                                        onRemove={this.props.onRemove}
                                        onNameUpdate={this.props.onNameUpdate}
                                    />
                                    <SourceEditor
                                        className="col-md-4 p-5"
                                        material={this.props.material}
                                        onUpdate={this.props.onUpdate}
                                    />
                                    <ThreeDEditorFullscreen
                                        className="col-md-6 p-0"
                                        editable
                                        material={this.props.material}
                                        isConventionalCellShown={this.props.isConventionalCellShown}
                                        boundaryConditions={this.props.material.boundaryConditions}
                                        onUpdate={(material) => {
                                            // convert made material to MD material and re-set metadata
                                            const newMaterial =
                                                Material.createFromMadeMaterial(material);
                                            newMaterial.metadata =
                                                this.props.material.metadata || {};
                                            this.props.onUpdate(newMaterial);
                                        }}
                                    />
                                </div>
                                <div
                                    className="bgm-dark col-xs-12 p-0"
                                    style={{
                                        // TODO: move out of here
                                        padding: "40px",
                                        borderTop: "1px solid",
                                        backgroundColor: "#202020",
                                    }}
                                >
                                    <EditorSelectionInfo />
                                </div>
                            </div>
                        </div>
                    </ThemeProvider>
                </StyledEngineProvider>
            </this.FullscreenHandlerComponent>
        );
    }
}

MaterialsDesigner.propTypes = {
    isLoading: PropTypes.bool,
    showToolbar: PropTypes.bool,

    // eslint-disable-next-line react/forbid-prop-types
    material: PropTypes.object.isRequired,
    isConventionalCellShown: PropTypes.bool,

    // eslint-disable-next-line react/forbid-prop-types
    materials: PropTypes.array,
    index: PropTypes.number,

    onUpdate: PropTypes.func,

    // ItemsList
    onItemClick: PropTypes.func,
    onNameUpdate: PropTypes.func,

    // Toolbar
    onGenerateSupercell: PropTypes.func,
    onGenerateSurface: PropTypes.func,
    onSetBoundaryConditions: PropTypes.func,
    onToggleIsNonPeriodic: PropTypes.func,

    // Undo-Redo
    onUndo: PropTypes.func,
    onRedo: PropTypes.func,
    onReset: PropTypes.func,

    onAdd: PropTypes.func,
    onExport: PropTypes.func,
    onSave: PropTypes.func,
    onExit: PropTypes.func,

    ImportModal: PropTypes.func,
    SaveActionDialog: PropTypes.func,

    onRemove: PropTypes.func,

    maxCombinatorialBasesCount: PropTypes.number,

    defaultMaterialsSet: PropTypes.array,
};

export default MaterialsDesigner;
