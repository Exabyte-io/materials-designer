/* eslint-disable react/sort-comp */
import { ThreejsEditorModal } from "@exabyte-io/wave.js";
import setClass from "classnames";
import PropTypes from "prop-types";
import React from "react";

import AddCircleIcon from "@material-ui/icons/AddCircle";
import AssignmentIcon from "@material-ui/icons/Assignment";
// TODO: rename other menu icons similarly
import SupercellIcon from "@material-ui/icons/BorderClear";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import CloneIcon from "@material-ui/icons/Collections";
import DeviceHubIcon from "@material-ui/icons/DeviceHub";
import BoundaryConditionsIcon from "@material-ui/icons/Directions";
import NanotubeIcon from "@material-ui/icons/DonutLarge";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ConventionalCellIcon from "@material-ui/icons/FormatShapes";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import GetAppIcon from "@material-ui/icons/GetApp";
import HelpIcon from "@material-ui/icons/Help";
import SlabIcon from "@material-ui/icons/Layers";
import CombinatorialSetIcon from "@material-ui/icons/LibraryAdd";
import RedoIcon from "@material-ui/icons/Redo";
import SaveIcon from "@material-ui/icons/Save";
import InterpolatedSetIcon from "@material-ui/icons/SwapVert";
import ThreeDEditorIcon from "@material-ui/icons/ThreeDRotation";
import PolymerIcon from "@material-ui/icons/Timeline";
import UndoIcon from "@material-ui/icons/Undo";

import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";

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
                        <GetAppIcon />
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
                    Toggle &#34;isNonPeriodic&#34;
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

    openPageByURL = (url) => {
        window.open(url, "_blank");
    };

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
        const { ImportModal, onAdd } = this.props;
        return ImportModal ? (
            <ImportModal
                show={showImportMaterialsDialog}
                onHide={() => this.setState({ showImportMaterialsDialog: false })}
                onSubmit={(materials) => {
                    onAdd(materials);
                    this.setState({ showImportMaterialsDialog: false });
                }}
            />
        ) : null;
    }

    renderSaveActionDialog() {
        const { SaveActionDialog, material, onSave } = this.props;
        const { showSaveMaterialsDialog } = this.state;
        return SaveActionDialog ? (
            <SaveActionDialog
                show={showSaveMaterialsDialog}
                material={material}
                onClose={() => this.setState({ showSaveMaterialsDialog: false })}
                onSubmit={onSave}
            />
        ) : null;
    }

    renderThreejsEditorModal() {
        const { onAdd, materials } = this.props;
        const { showThreejsEditorModal } = this.state;
        return (
            <ThreejsEditorModal
                show={showThreejsEditorModal}
                onHide={(material) => {
                    this.setState({ showThreejsEditorModal: !showThreejsEditorModal });
                    if (material) {
                        // convert made material to MD material
                        const newMaterial = Material.createFromMadeMaterial(material);
                        newMaterial.isUpdated = true; // to show it as new (yellow color)
                        onAdd(newMaterial);
                    }
                }}
                materials={materials}
                modalId="threejs-editor"
            />
        );
    }

    render() {
        const {
            showThreejsEditorModal,
            showSupercellDialog,
            showSurfaceDialog,
            showBoundaryConditionsDialog,
            showCombinatorialDialog,
            showExportMaterialsDialog,
            showInterpolateDialog,
        } = this.state;
        const {
            className,
            material,
            materials,
            index,
            onAdd,
            onExport,
            onGenerateSupercell,
            onGenerateSurface,
            onSetBoundaryConditions,
            maxCombinatorialBasesCount,
        } = this.props;
        if (showThreejsEditorModal) return this.renderThreejsEditorModal();
        return (
            <Toolbar
                className={setClass(className, "materials-designer-header-menu")}
                style={{ borderBottom: "1px solid" }}
            >
                {this.renderIOMenu()}
                {this.renderEditMenu()}
                {this.renderViewMenu()}
                {this.renderAdvancedMenu()}
                {this.renderHelpMenu()}
                {this.renderSpinner()}

                <SupercellDialog
                    show={showSupercellDialog}
                    modalId="supercellModal"
                    backdropColor="dark"
                    onSubmit={onGenerateSupercell}
                    onHide={() => this.setState({ showSupercellDialog: false })}
                />

                <SurfaceDialog
                    show={showSurfaceDialog}
                    modalId="surfaceModal"
                    backdropColor="dark"
                    onSubmit={onGenerateSurface}
                    onHide={() => this.setState({ showSurfaceDialog: false })}
                />

                <BoundaryConditionsDialog
                    show={showBoundaryConditionsDialog}
                    modalId="BoundaryConditionsModal"
                    backdropColor="dark"
                    material={material}
                    onSubmit={onSetBoundaryConditions}
                    onHide={() => this.setState({ showBoundaryConditionsDialog: false })}
                />

                {this.renderImportModal()}

                <ExportActionDialog
                    show={showExportMaterialsDialog}
                    onClose={() => this.setState({ showExportMaterialsDialog: false })}
                    onSubmit={onExport}
                />

                {this.renderSaveActionDialog()}

                <CombinatorialBasisDialog
                    title="Generate Combinatorial Set"
                    modalId="combinatorialSetModal"
                    show={showCombinatorialDialog}
                    maxCombinatorialBasesCount={maxCombinatorialBasesCount}
                    backdropColor="dark"
                    material={material}
                    onHide={() => this.setState({ showCombinatorialDialog: false })}
                    onSubmit={(...args) => {
                        onAdd(...args);
                        this.setState({ showCombinatorialDialog: false });
                    }}
                />

                <InterpolateBasesDialog
                    title="Generate Interpolated Set"
                    modalId="interpolatedSetModal"
                    show={showInterpolateDialog}
                    backdropColor="dark"
                    material={material}
                    material2={materials[index + 1 === materials.length ? 0 : index + 1]}
                    onHide={() => this.setState({ showInterpolateDialog: false })}
                    onSubmit={(...args) => {
                        onAdd(...args);
                        this.setState({ showInterpolateDialog: false });
                    }}
                />
            </Toolbar>
        );
    }
}

HeaderMenuToolbar.propTypes = {
    className: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    material: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    materials: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    isFullscreen: PropTypes.bool.isRequired,
    maxCombinatorialBasesCount: PropTypes.number.isRequired,

    onUpdate: PropTypes.func.isRequired,
    onUndo: PropTypes.func.isRequired,
    onRedo: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onClone: PropTypes.func.isRequired,
    onToggleIsNonPeriodic: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    onExport: PropTypes.func.isRequired,
    onExit: PropTypes.func.isRequired,
    onGenerateSupercell: PropTypes.func.isRequired,
    onGenerateSurface: PropTypes.func.isRequired,
    onSetBoundaryConditions: PropTypes.func.isRequired,

    ImportModal: PropTypes.func.isRequired,
    SaveActionDialog: PropTypes.func.isRequired,
    toggleFullscreen: PropTypes.func.isRequired,
};

HeaderMenuToolbar.defaultProps = {
    className: undefined,
};

export default HeaderMenuToolbar;
