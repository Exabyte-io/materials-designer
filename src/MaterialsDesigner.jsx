import IconByName from "@exabyte-io/cove.js/dist/mui/components/icon/IconByName";
import FullscreenComponentMixin from "@exabyte-io/cove.js/dist/other/fullscreen";
import theme, { DarkMaterialUITheme } from "@exabyte-io/cove.js/dist/theme";
import ThemeProvider from "@exabyte-io/cove.js/dist/theme/provider";
// eslint-disable-next-line import/no-unresolved
import data from "@exabyte-io/standata/lib/runtime_data/materials";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import ScopedCssBaseline from "@mui/material/ScopedCssBaseline";
import setClass from "classnames";
import { mix } from "mixwith";
import PropTypes from "prop-types";
import React from "react";

// TODO: use when converting to typescript
// import {MaterialSchema} from "@exabyte-io/code.js/dist/types";
import { ThreeDEditorFullscreen } from "./components/3d_editor/ThreeDEditorFullscreen";
import EditorSelectionInfo, {
    FOOTER_HEIGHT,
} from "./components/3d_editor_selection_info/EditorSelectionInfo";
import HeaderMenuToolbar from "./components/header_menu/HeaderMenuToolbar";
import ItemsList from "./components/items_list/ItemsList";
import BasisEditor from "./components/source_editor/Basis";
import LatticeEditor from "./components/source_editor/Lattice";
import { Material } from "./material";

const materialConfigs = Object.values(data.filesMapByName);

const APP_BAR_HEIGHT = 54;

const GRID_CONFIG_BY_VISIBILITY = {
    // "111" means that all three components are visible
    "#111": {
        1: { xs: 12, md: 2.5, lg: 2, xl: 1.5 },
        2: { xs: 12, md: 4.75, lg: 4.375, xl: 4 },
        3: { xs: 12, md: 4.75, lg: 5.625, xl: 6.5 },
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

    render() {
        const { isVisibleItemsList, isVisibleSourceEditor, isVisibleThreeDEditorFullscreen } =
            this.state;
        const gridConfig = this.getGridConfig();
        const mainContainerHeightDirective = `calc(100vh - ${
            APP_BAR_HEIGHT + FOOTER_HEIGHT - 8
        }px)`; // 8px is the padding + borders
        return (
            <ThemeProvider theme={DarkMaterialUITheme}>
                <ScopedCssBaseline enableColorScheme>
                    <Paper id="materials-designer">
                        <AppBar position="static" className={setClass("", this.props.className)}>
                            {/* TODO: find out how to avoid passing material to header */}
                            <HeaderMenuToolbar
                                isLoading={this.props.isLoading}
                                material={this.props.material}
                                materials={this.props.materials}
                                index={this.props.index}
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
                                openImportModal={this.props.openImportModal}
                                closeImportModal={this.props.closeImportModal}
                                openSaveActionDialog={this.props.openSaveActionDialog}
                                onGenerateSupercell={this.props.onGenerateSupercell}
                                onGenerateSurface={this.props.onGenerateSurface}
                                onSetBoundaryConditions={this.props.onSetBoundaryConditions}
                                maxCombinatorialBasesCount={this.props.maxCombinatorialBasesCount}
                                defaultMaterialsSet={this.props.defaultMaterialsSet}
                                onSectionVisibilityToggle={this.onSectionVisibilityToggle}
                                isVisibleItemsList={isVisibleItemsList}
                                isVisibleSourceEditor={isVisibleSourceEditor}
                                isVisibleThreeDEditorFullscreen={isVisibleThreeDEditorFullscreen}
                            >
                                <IconButton
                                    color="inherit"
                                    edge="start"
                                    disabled
                                    disableFocusRipple
                                    disableRipple
                                    sx={{ mr: 1 }}
                                >
                                    <IconByName
                                        size="large"
                                        edge="start"
                                        color="inherit"
                                        name="entities.material"
                                        sx={{ fontSize: "1.5rem" }}
                                    />
                                </IconButton>
                            </HeaderMenuToolbar>
                        </AppBar>
                        <Box
                            component="main"
                            sx={{
                                [theme.breakpoints.up("md")]: {
                                    height: mainContainerHeightDirective,
                                },
                                [theme.breakpoints.down("md")]: {
                                    maxHeight: mainContainerHeightDirective,
                                },
                                overflowY: "auto",
                            }}
                        >
                            <Grid
                                container
                                justifyContent="flex-start"
                                id="materials-designer-container"
                                sx={{ height: "100%" }}
                            >
                                {isVisibleItemsList && (
                                    <Grid
                                        item
                                        // eslint-disable-next-line react/jsx-props-no-spreading
                                        {...gridConfig[1]}
                                        sx={{
                                            borderRight: `1px solid ${theme.palette.grey[800]}`,
                                            height: "100%",
                                            overflowY: "auto",
                                        }}
                                    >
                                        <Grid
                                            item
                                            className="materials-designer-items-list"
                                            xs={12}
                                            mt={0.25}
                                        >
                                            <ItemsList
                                                materials={this.props.materials}
                                                index={this.props.index}
                                                onItemClick={this.props.onItemClick}
                                                onRemove={this.props.onRemove}
                                                onNameUpdate={this.props.onNameUpdate}
                                            />
                                        </Grid>
                                    </Grid>
                                )}
                                {isVisibleSourceEditor && (
                                    <Grid
                                        item
                                        // eslint-disable-next-line react/jsx-props-no-spreading
                                        {...gridConfig[2]}
                                        sx={{
                                            borderRight: `1px solid ${theme.palette.grey[800]}`,
                                            height: "100%",
                                            width: "100%",
                                            overflowY: "auto",
                                        }}
                                        className="materials-designer-source-editor"
                                    >
                                        <Grid item xs={12} mt={0.25}>
                                            <LatticeEditor
                                                material={this.props.material}
                                                onUpdate={this.props.onUpdate}
                                            />
                                        </Grid>
                                        <Grid item xs={12} mt={0.25}>
                                            <BasisEditor
                                                material={this.props.material}
                                                onUpdate={this.props.onUpdate}
                                            />
                                        </Grid>
                                    </Grid>
                                )}
                                {isVisibleThreeDEditorFullscreen && (
                                    // eslint-disable-next-line react/jsx-props-no-spreading
                                    <Grid item {...gridConfig[3]} mt={0.25}>
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
                        </Box>
                        <EditorSelectionInfo />
                    </Paper>
                </ScopedCssBaseline>
            </ThemeProvider>
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

MaterialsDesigner.defaultProps = {
    defaultMaterialsSet: materialConfigs,
};

export default MaterialsDesigner;
