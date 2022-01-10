import { ThreejsEditorModal } from "@exabyte-io/wave.js";
import {
    AddCircle as AddCircleIcon,
    Assignment as AssignmentIcon,
    // TODO: rename other menu icons similarly
    BorderClear as SupercellIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    Collections as CloneIcon,
    Directions as BoundaryConditionsIcon,
    DonutLarge as NanotubeIcon,
    ExitToApp as ExitToAppIcon,
    FileDownload as FileDownloadIcon,
    FormatShapes as ConventionalCellIcon,
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,
    Help as HelpIcon,
    Layers as SlabIcon,
    LibraryAdd as CombinatorialSetIcon,
    Redo as RedoIcon,
    Save as SaveIcon,
    SwapVert as InterpolatedSetIcon,
    ThreeDRotation as ThreeDEditorIcon,
    Timeline as PolymerIcon,
    Undo as UndoIcon,
} from "@material-ui/icons";
import DeviceHubIcon from "@material-ui/icons/DeviceHub";
import setClass from "classnames";
import Divider from "material-ui/Divider";
import IconButton from "material-ui/IconButton";
import { ListItemIcon } from "material-ui/List";
import { MenuItem } from "material-ui/Menu";
import Toolbar from "material-ui/Toolbar";
import PropTypes from "prop-types";
import React from "react";

import { Material } from "../../material";
import { BoundaryConditionsDialog } from "../3d_editor/advanced_geometry/BoundaryConditionsDialog";
import CombinatorialBasisDialog from "../3d_editor/advanced_geometry/CombinatorialBasisDialog";
import InterpolateBasesDialog from "../3d_editor/advanced_geometry/InterpolateBasesDialog";
import SupercellDialog from "../3d_editor/advanced_geometry/SupercellDialog";
import SurfaceDialog from "../3d_editor/advanced_geometry/SurfaceDialog";
import { ButtonActivatedMenuMaterialUI } from "../include/material-ui/ButtonActivatedMenu";
import ExportActionDialog from "./ExportActionDialog";

class HeaderMenuToolbar extends React.Component {
    constructor(config) {
        super(config);
        this.state = {
            showSupercellDialog: false,
            showSurfaceDialog: false,
            showImportMaterialsDialog: false,
            showExportMaterialsDialog: false,
            showSaveMaterialsDialog: false,
            showCombinatorialDialog: false,
            showInterpolateDialog: false,
            showThreejsEditorModal: false,
            showBoundaryConditionsDialog: false,
        };
    }

    _handleConventionalCellSelect = () => {
        const { material, onUpdate, index } = this.props;
        const newMaterial = material.getACopyWithConventionalCell();
        return onUpdate(newMaterial, index);
    };

    renderIOMenu() {
        const { ImportModal, SaveActionDialog, onExit } = this.props;
        return (
            <ButtonActivatedMenuMaterialUI title="Input/Output">
                <MenuItem
                    disabled={!ImportModal}
                    onClick={() => this.setState({ showImportMaterialsDialog: true })}
                >
                    <ListItemIcon>
                        <AddCircleIcon />
                    </ListItemIcon>
                    Import
                </MenuItem>
                <MenuItem onClick={() => this.setState({ showExportMaterialsDialog: true })}>
                    <ListItemIcon>
                        <FileDownloadIcon />
                    </ListItemIcon>
                    Export
                </MenuItem>
                <MenuItem
                    disabled={!SaveActionDialog}
                    onClick={() => this.setState({ showSaveMaterialsDialog: true })}
                >
                    <ListItemIcon>
                        <SaveIcon />
                    </ListItemIcon>
                    Save
                </MenuItem>
                <MenuItem disabled={!onExit} onClick={onExit}>
                    <ListItemIcon>
                        <ExitToAppIcon />
                    </ListItemIcon>
                    Exit
                </MenuItem>
            </ButtonActivatedMenuMaterialUI>
        );
    }

    renderEditMenu() {
        const { onUndo, onRedo, onReset, onClone, onToggleIsNonPeriodic } = this.props;
        return (
            <ButtonActivatedMenuMaterialUI title="Edit">
                <MenuItem onClick={onUndo}>
                    <ListItemIcon>
                        <UndoIcon />
                    </ListItemIcon>
                    Undo
                </MenuItem>
                <MenuItem onClick={onRedo}>
                    <ListItemIcon>
                        <RedoIcon />
                    </ListItemIcon>
                    Redo
                </MenuItem>
                <MenuItem onClick={onReset}>
                    <ListItemIcon>
                        <CloseIcon />
                    </ListItemIcon>
                    Reset
                </MenuItem>
                <Divider />
                <MenuItem onClick={onClone}>
                    <ListItemIcon>
                        <CloneIcon />
                    </ListItemIcon>
                    Clone
                </MenuItem>
                <Divider />
                <MenuItem onClick={this._handleConventionalCellSelect}>
                    <ListItemIcon>
                        <ConventionalCellIcon />
                    </ListItemIcon>
                    Use Conventional Cell
                </MenuItem>
                <MenuItem onClick={onToggleIsNonPeriodic}>
                    <ListItemIcon>
                        <DeviceHubIcon />
                    </ListItemIcon>
                    Toggle "isNonPeriodic"
                </MenuItem>
            </ButtonActivatedMenuMaterialUI>
        );
    }

    renderViewMenu() {
        const { toggleFullscreen, isFullscreen } = this.props;
        return (
            <ButtonActivatedMenuMaterialUI title="View">
                <MenuItem onClick={() => this.setState({ showThreejsEditorModal: true })}>
                    <ListItemIcon>
                        <ThreeDEditorIcon />
                    </ListItemIcon>
                    Multi-Material 3D Editor
                </MenuItem>
                <MenuItem disabled>
                    <ListItemIcon>
                        <CheckIcon />
                    </ListItemIcon>
                    Sidebar
                </MenuItem>
                <MenuItem disabled>
                    <ListItemIcon>
                        <CheckIcon />
                    </ListItemIcon>
                    Source Editor
                </MenuItem>
                <MenuItem disabled>
                    <ListItemIcon>
                        <CheckIcon />
                    </ListItemIcon>
                    Selection Info
                </MenuItem>
                <Divider />
                <MenuItem onClick={toggleFullscreen}>
                    <ListItemIcon>
                        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </ListItemIcon>
                    {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                </MenuItem>
            </ButtonActivatedMenuMaterialUI>
        );
    }

    renderAdvancedMenu() {
        return (
            <ButtonActivatedMenuMaterialUI title="Advanced">
                <MenuItem onClick={() => this.setState({ showSupercellDialog: true })}>
                    <ListItemIcon>
                        <SupercellIcon />
                    </ListItemIcon>
                    Supercell
                </MenuItem>
                <MenuItem onClick={() => this.setState({ showCombinatorialDialog: true })}>
                    <ListItemIcon>
                        <CombinatorialSetIcon />
                    </ListItemIcon>
                    Combinatorial set
                </MenuItem>
                <MenuItem onClick={() => this.setState({ showInterpolateDialog: true })}>
                    <ListItemIcon>
                        <InterpolatedSetIcon />
                    </ListItemIcon>
                    Interpolated set
                </MenuItem>
                <MenuItem onClick={() => this.setState({ showSurfaceDialog: true })}>
                    <ListItemIcon>
                        <SlabIcon />
                    </ListItemIcon>
                    Surface / slab
                </MenuItem>
                <MenuItem onClick={() => this.setState({ showBoundaryConditionsDialog: true })}>
                    <ListItemIcon>
                        <BoundaryConditionsIcon />
                    </ListItemIcon>
                    Boundary Conditions
                </MenuItem>
                <MenuItem disabled>
                    <ListItemIcon>
                        <PolymerIcon />
                    </ListItemIcon>
                    Polymer
                </MenuItem>
                <MenuItem disabled>
                    <ListItemIcon>
                        <NanotubeIcon />
                    </ListItemIcon>
                    Nanotube
                </MenuItem>
            </ButtonActivatedMenuMaterialUI>
        );
    }

    openPageByURL(url) {
        window.open(url, "_blank");
    }

    renderHelpMenu() {
        return (
            <ButtonActivatedMenuMaterialUI title="Help">
                <MenuItem
                    onClick={() =>
                        this.openPageByURL("https://docs.exabyte.io/materials-designer/overview/")
                    }
                >
                    <ListItemIcon>
                        <HelpIcon />
                    </ListItemIcon>
                    Documentation
                </MenuItem>
                <MenuItem
                    onClick={() =>
                        this.openPageByURL("https://docs.exabyte.io/tutorials/materials/overview/")
                    }
                >
                    <ListItemIcon>
                        <AssignmentIcon />
                    </ListItemIcon>
                    Tutorials
                </MenuItem>
            </ButtonActivatedMenuMaterialUI>
        );
    }

    renderSpinner() {
        const { isLoading } = this.props;
        return (
            <IconButton disabled className="spinner-icon">
                {isLoading ? (
                    <i className="zmdi zmdi-spinner zmdi-hc-spin" />
                ) : (
                    <i className="zmdi zmdi-check" />
                )}
            </IconButton>
        );
    }

    renderImportModal() {
        const { showImportMaterialsDialog } = this.state;
        return this.props.ImportModal ? (
            <this.props.ImportModal
                show={showImportMaterialsDialog}
                onHide={() => this.setState({ showImportMaterialsDialog: false })}
                onSubmit={(materials) => {
                    this.props.onAdd(materials);
                    this.setState({ showImportMaterialsDialog: false });
                }}
            />
        ) : null;
    }

    renderSaveActionDialog() {
        return this.props.SaveActionDialog ? (
            <this.props.SaveActionDialog
                show={this.state.showSaveMaterialsDialog}
                material={this.props.material}
                onClose={() => this.setState({ showSaveMaterialsDialog: false })}
                onSubmit={this.props.onSave}
            />
        ) : null;
    }

    renderThreejsEditorModal() {
        return (
            <ThreejsEditorModal
                show={this.state.showThreejsEditorModal}
                onHide={(material) => {
                    this.setState({ showThreejsEditorModal: !this.state.showThreejsEditorModal });
                    if (material) {
                        // convert made material to MD material
                        const newMaterial = Material.createFromMadeMaterial(material);
                        newMaterial.isUpdated = true; // to show it as new (yellow color)
                        this.props.onAdd(newMaterial);
                    }
                }}
                materials={this.props.materials}
                modalId="threejs-editor"
            />
        );
    }

    render() {
        if (this.state.showThreejsEditorModal) return this.renderThreejsEditorModal();
        return (
            <Toolbar
                className={setClass(this.props.className, "materials-designer-header-menu")}
                style={{ borderBottom: "1px solid" }}
            >
                {this.renderIOMenu()}
                {this.renderEditMenu()}
                {this.renderViewMenu()}
                {this.renderAdvancedMenu()}
                {this.renderHelpMenu()}
                {this.renderSpinner()}

                <SupercellDialog
                    show={this.state.showSupercellDialog}
                    modalId="supercellModal"
                    backdropColor="dark"
                    onSubmit={this.props.onGenerateSupercell}
                    onHide={() => this.setState({ showSupercellDialog: false })}
                />

                <SurfaceDialog
                    show={this.state.showSurfaceDialog}
                    modalId="surfaceModal"
                    backdropColor="dark"
                    onSubmit={this.props.onGenerateSurface}
                    onHide={() => this.setState({ showSurfaceDialog: false })}
                />

                <BoundaryConditionsDialog
                    show={this.state.showBoundaryConditionsDialog}
                    modalId="BoundaryConditionsModal"
                    backdropColor="dark"
                    material={this.props.material}
                    onSubmit={this.props.onSetBoundaryConditions}
                    onHide={() => this.setState({ showBoundaryConditionsDialog: false })}
                />

                {this.renderImportModal()}

                <ExportActionDialog
                    show={this.state.showExportMaterialsDialog}
                    onClose={() => this.setState({ showExportMaterialsDialog: false })}
                    onSubmit={this.props.onExport}
                />

                {this.renderSaveActionDialog()}

                <CombinatorialBasisDialog
                    title="Generate Combinatorial Set"
                    modalId="combinatorialSetModal"
                    show={this.state.showCombinatorialDialog}
                    maxCombinatorialBasesCount={this.props.maxCombinatorialBasesCount}
                    backdropColor="dark"
                    material={this.props.material}
                    onHide={() => this.setState({ showCombinatorialDialog: false })}
                    onSubmit={(...args) => {
                        this.props.onAdd(...args);
                        this.setState({ showCombinatorialDialog: false });
                    }}
                />

                <InterpolateBasesDialog
                    title="Generate Interpolated Set"
                    modalId="interpolatedSetModal"
                    show={this.state.showInterpolateDialog}
                    backdropColor="dark"
                    material={this.props.material}
                    material2={
                        this.props.materials[
                            this.props.index + 1 === this.props.materials.length
                                ? 0
                                : this.props.index + 1
                        ]
                    }
                    onHide={() => this.setState({ showInterpolateDialog: false })}
                    onSubmit={(...args) => {
                        this.props.onAdd(...args);
                        this.setState({ showInterpolateDialog: false });
                    }}
                />
            </Toolbar>
        );
    }
}

HeaderMenuToolbar.propTypes = {
    isLoading: PropTypes.bool,
    material: PropTypes.object,
    index: PropTypes.number,

    onUpdate: PropTypes.func,

    onUndo: PropTypes.func,
    onRedo: PropTypes.func,
    onReset: PropTypes.func,
    onClone: PropTypes.func,
    onToggleIsNonPeriodic: PropTypes.func,

    onAdd: PropTypes.func,
    onExport: PropTypes.func,
    onExit: PropTypes.func,

    onGenerateSupercell: PropTypes.func,
    onGenerateSurface: PropTypes.func,
    onSetBoundaryConditions: PropTypes.func,

    ImportModal: PropTypes.func,
    SaveActionDialog: PropTypes.func,

    maxCombinatorialBasesCount: PropTypes.number,
};

export default HeaderMenuToolbar;
