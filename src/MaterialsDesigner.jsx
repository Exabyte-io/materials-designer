import FullscreenComponentMixin from "@exabyte-io/cove.js/dist/other/fullscreen";
import { DarkMaterialUITheme } from "@exabyte-io/cove.js/dist/theme";
import ThemeProvider from "@exabyte-io/cove.js/dist/theme/provider";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { StyledEngineProvider } from "@mui/material/styles";
import setClass from "classnames";
import { mix } from "mixwith";
import PropTypes from "prop-types";
import React from "react";

import { ThreeDEditorFullscreen } from "./components/3d_editor/ThreeDEditorFullscreen";
import EditorSelectionInfo from "./components/3d_editor_selection_info/EditorSelectionInfo";
import HeaderMenuToolbar from "./components/header_menu/HeaderMenuToolbar";
import DefaultImportModalDialog from "./components/include/DefaultImportModalDialog";
import ItemsList from "./components/items_list/ItemsList";
import SourceEditor from "./components/source_editor/SourceEditor";
import { Material } from "./material";

const GRID_CONFIG_BY_VISIBILITY = {
    // "111" means that all three components are visible
    "#111": {
        1: { xs: 12, md: 2.5, lg: 2, xl: 1.5 },
        2: { xs: 12, md: 4.75, lg: 4.375, l: 4 },
        3: { xs: 12, md: 4.75, lg: 5.625, l: 6.5 },
    },
    "#001": {
        1: { xs: 12 },
        2: { xs: 12 },
        3: { xs: 12 },
    },
    "#010": {
        1: { xs: 12 },
        2: { xs: 12 },
        3: { xs: 12 },
    },
    "#100": {
        1: { xs: 12 },
        2: { xs: 12 },
        3: { xs: 12 },
    },
    "#011": {
        1: { xs: 0 },
        2: { xs: 12, md: 6 },
        3: { xs: 12, md: 6 },
    },
    "#101": {
        1: { xs: 12, md: 3 },
        2: { xs: 12, md: 0 },
        3: { xs: 12, md: 9 },
    },
    "#110": {
        1: { xs: 12, md: 4 },
        2: { xs: 12, md: 8 },
        3: { xs: 12, md: 0 },
    },
};
class MaterialsDesigner extends mix(React.Component).with(FullscreenComponentMixin) {
    constructor(props) {
        super(props);
        this.state = {
            isFullscreen: false,
            isVisibleItemsList: true,
            isVisibleSourceEditor: true,
            isVisibleThreeDEditorFullscreen: true,
            importMaterialsDialogProps: null,
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

    getGridConfig = () => {
        const { isVisibleItemsList, isVisibleSourceEditor, isVisibleThreeDEditorFullscreen } =
            this.state;
        const arrayOfOnesAsStrings = [
            isVisibleItemsList,
            isVisibleSourceEditor,
            isVisibleThreeDEditorFullscreen,
        ].map((e) => String(Number(e)));
        const visibilityKey = `#${arrayOfOnesAsStrings.join("")}`;
        return GRID_CONFIG_BY_VISIBILITY[visibilityKey];
    };

    checkIfOnlyOneGridItemIsVisible = () => {
        const { isVisibleItemsList, isVisibleSourceEditor, isVisibleThreeDEditorFullscreen } =
            this.state;
        return (
            [isVisibleItemsList, isVisibleSourceEditor, isVisibleThreeDEditorFullscreen]
                .map((e) => Number(e))
                .reduce((a, b) => a + b, 0) === 1
        );
    };

    toggleFullscreen = () => {
        this.setState({ isFullscreen: !this.state.isFullscreen });
    };

    onSectionVisibilityToggle = (componentName) => {
        const stateKey = `isVisible${componentName}`;
        if (stateKey in this.state) {
            // if only one grid item is visible, it should not be possible to hide it
            if (this.checkIfOnlyOneGridItemIsVisible() && this.state[stateKey]) return;
            // otherwise, toggle the visibility
            this.setState({ [stateKey]: !this.state[stateKey] }, () => {
                // Trigger resize event to update the 3D viewer/editor size
                window.dispatchEvent(new Event("resize"));
            });
        }
    };

    renderDefaultImportModal = () => {
        return this.state.importMaterialsDialogProps ? (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <DefaultImportModalDialog open {...this.state.importMaterialsDialogProps} />
        ) : null;
    };

    openDefaultImportModal = (props) => {
        this.setState({ importMaterialsDialogProps: props });
    };

    closeDefaultImportModal = () => {
        this.setState({ importMaterialsDialogProps: null });
    };

    render() {
        const { isVisibleItemsList, isVisibleSourceEditor, isVisibleThreeDEditorFullscreen } =
            this.state;
        const gridConfig = this.getGridConfig();
        console.log("-----", gridConfig);
        return (
            <this.FullscreenHandlerComponent
                className={setClass(this.props.className)}
                enabled={this.state.isFullscreen}
                onChange={(isFullscreen) => this.setState({ isFullscreen })}
            >
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={DarkMaterialUITheme}>
                        <div id="materials-designer" className={setClass("", this.props.className)}>
                            <div className="bgm-dark">
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
                                    openImportModal={
                                        this.props.openImportModal || this.openDefaultImportModal
                                    }
                                    closeImportModal={
                                        this.props.closeImportModal || this.closeDefaultImportModal
                                    }
                                    openSaveActionDialog={this.props.openSaveActionDialog}
                                    onGenerateSupercell={this.props.onGenerateSupercell}
                                    onGenerateSurface={this.props.onGenerateSurface}
                                    onSetBoundaryConditions={this.props.onSetBoundaryConditions}
                                    maxCombinatorialBasesCount={
                                        this.props.maxCombinatorialBasesCount
                                    }
                                    defaultMaterialsSet={this.props.defaultMaterialsSet}
                                    onSectionVisibilityToggle={this.onSectionVisibilityToggle}
                                    isVisibleItemsList={isVisibleItemsList}
                                    isVisibleSourceEditor={isVisibleSourceEditor}
                                    isVisibleThreeDEditorFullscreen={
                                        isVisibleThreeDEditorFullscreen
                                    }
                                />
                                {this.renderDefaultImportModal()}
                                {/* Setting minHeight below to the same value as for 3d Viewer */}
                                <Grid
                                    container
                                    id="materials-designer-container"
                                    sx={{ minHeight: "calc(100vmin - 105px)" }}
                                >
                                    {isVisibleItemsList && (
                                        <Grid
                                            item
                                            // eslint-disable-next-line react/jsx-props-no-spreading
                                            {...gridConfig[1]}
                                            sx={{ borderRight: "1px solid" }}
                                        >
                                            <ItemsList
                                                materials={this.props.materials}
                                                index={this.props.index}
                                                onItemClick={this.props.onItemClick}
                                                onRemove={this.props.onRemove}
                                                onNameUpdate={this.props.onNameUpdate}
                                            />
                                        </Grid>
                                    )}
                                    {isVisibleSourceEditor && (
                                        <Grid
                                            item
                                            // eslint-disable-next-line react/jsx-props-no-spreading
                                            {...gridConfig[2]}
                                            sx={{ borderRight: "1px solid" }}
                                        >
                                            <SourceEditor
                                                material={this.props.material}
                                                onUpdate={this.props.onUpdate}
                                            />
                                        </Grid>
                                    )}
                                    {isVisibleThreeDEditorFullscreen && (
                                        // eslint-disable-next-line react/jsx-props-no-spreading
                                        <Grid item {...gridConfig[3]}>
                                            <ThreeDEditorFullscreen
                                                editable
                                                material={this.props.material}
                                                isConventionalCellShown={
                                                    this.props.isConventionalCellShown
                                                }
                                                boundaryConditions={
                                                    this.props.material.boundaryConditions
                                                }
                                                onUpdate={(material) => {
                                                    // convert made material to MD material and re-set metadata
                                                    const newMaterial =
                                                        Material.createFromMadeMaterial(material);
                                                    newMaterial.metadata =
                                                        this.props.material.metadata || {};
                                                    this.props.onUpdate(newMaterial);
                                                }}
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Box className="bgm-dark" sx={{ borderTop: "1px solid" }}>
                                            <EditorSelectionInfo />
                                        </Box>
                                    </Grid>
                                </Grid>
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

    openImportModal: PropTypes.func,
    closeImportModal: PropTypes.func,
    openSaveActionDialog: PropTypes.func,

    onRemove: PropTypes.func,

    maxCombinatorialBasesCount: PropTypes.number,
    // eslint-disable-next-line react/forbid-prop-types
    defaultMaterialsSet: PropTypes.array,
};

export default MaterialsDesigner;
