import React from "react";
import setClass from "classnames";

import Toolbar from 'material-ui-next/Toolbar';
import Divider from 'material-ui-next/Divider';
import {MenuItem} from 'material-ui-next/Menu';
import {ListItemIcon} from 'material-ui-next/List';
import IconButton from 'material-ui-next/IconButton';
import {ThreejsEditorModal} from "@exabyte-io/wave.js";

import {
    Check as CheckIcon,
    Undo as UndoIcon,
    Redo as RedoIcon,
    Close as CloseIcon,
    AddCircle as AddCircleIcon,
    FileDownload as FileDownloadIcon,
    Save as SaveIcon,
    ExitToApp as ExitToAppIcon,
    Collections as CollectionsIcon,
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,

    Help as HelpIcon,
    Assignment as AssignmentIcon,

    // TODO: rename other menu icons similarly
    BorderClear as SupercellIcon,
    LibraryAdd as CombinatorialSetIcon,
    SwapVert as InterpolatedSetIcon,
    Layers as SlabIcon,
    Timeline as PolymerIcon,
    DonutLarge as NanotubeIcon,

    ThreeDRotation as ThreeDEditorIcon,

} from 'material-ui-icons-next';

import ExportActionDialog from "./ExportActionDialog";
import SurfaceDialog from "../3d_editor/advanced_geometry/SurfaceDialog";
import SupercellDialog from "../3d_editor/advanced_geometry/SupercellDialog";
import {ButtonActivatedMenuMaterialUI} from "../include/material-ui/ButtonActivatedMenu";
import InterpolateBasesDialog from "../3d_editor/advanced_geometry/InterpolateBasesDialog";
import CombinatorialBasisDialog from "../3d_editor/advanced_geometry/CombinatorialBasisDialog";

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
        };
    }

    renderIOMenu() {
        return (
            <ButtonActivatedMenuMaterialUI title="Input/Output">
                <MenuItem
                    disabled={!Boolean(this.props.ImportModal)}
                    onClick={() => this.setState({showImportMaterialsDialog: true})}>
                    <ListItemIcon><AddCircleIcon/></ListItemIcon>
                    Import
                </MenuItem>
                <MenuItem
                    onClick={() => this.setState({showExportMaterialsDialog: true})}>
                    <ListItemIcon><FileDownloadIcon/></ListItemIcon>
                    Export
                </MenuItem>
                <MenuItem
                    disabled={!Boolean(this.props.SaveActionDialog)}
                    onClick={() => this.setState({showSaveMaterialsDialog: true})}>
                    <ListItemIcon><SaveIcon/></ListItemIcon>
                    Save
                </MenuItem>
                <MenuItem
                    disabled={!Boolean(this.props.onExit)}
                    onClick={this.props.onExit}>
                    <ListItemIcon><ExitToAppIcon/></ListItemIcon>
                    Exit
                </MenuItem>
            </ButtonActivatedMenuMaterialUI>
        );
    }

    renderEditMenu() {
        return (
            <ButtonActivatedMenuMaterialUI title="Edit">
                <MenuItem onClick={this.props.onUndo}><ListItemIcon><UndoIcon/></ListItemIcon>Undo</MenuItem>
                <MenuItem onClick={this.props.onRedo}><ListItemIcon><RedoIcon/></ListItemIcon>Redo</MenuItem>
                <MenuItem onClick={this.props.onReset}><ListItemIcon><CloseIcon/></ListItemIcon>Reset</MenuItem>
                <Divider/>
                <MenuItem onClick={this.props.onClone}><ListItemIcon><CollectionsIcon/></ListItemIcon>Clone</MenuItem>
            </ButtonActivatedMenuMaterialUI>
        );
    }

    renderViewMenu() {
        return (
            <ButtonActivatedMenuMaterialUI title="View">
                <MenuItem onClick={() => this.setState({showThreejsEditorModal: true})}>
                    <ListItemIcon><ThreeDEditorIcon/></ListItemIcon>
                    Multi-Material 3D Editor
                </MenuItem>
                <MenuItem disabled>
                    <ListItemIcon><CheckIcon/></ListItemIcon>
                    Sidebar
                </MenuItem>
                <MenuItem disabled>
                    <ListItemIcon><CheckIcon/></ListItemIcon>
                    Source Editor
                </MenuItem>
                <MenuItem disabled>
                    <ListItemIcon><CheckIcon/></ListItemIcon>
                    Selection Info
                </MenuItem>
                <Divider/>
                <MenuItem onClick={this.props.toggleFullscreen}>
                    <ListItemIcon>{this.props.isFullscreen ? <FullscreenExitIcon/> : <FullscreenIcon/>}</ListItemIcon>
                    {this.props.isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                </MenuItem>
            </ButtonActivatedMenuMaterialUI>
        );
    }

    renderAdvancedMenu() {
        return (
            <ButtonActivatedMenuMaterialUI title="Advanced">
                <MenuItem onClick={() => this.setState({showSupercellDialog: true})}>
                    <ListItemIcon><SupercellIcon/></ListItemIcon>
                    Supercell
                </MenuItem>
                <MenuItem onClick={() => this.setState({showCombinatorialDialog: true})}>
                    <ListItemIcon><CombinatorialSetIcon/></ListItemIcon>
                    Combinatorial set
                </MenuItem>
                <MenuItem onClick={() => this.setState({showInterpolateDialog: true})}>
                    <ListItemIcon><InterpolatedSetIcon/></ListItemIcon>
                    Interpolated set
                </MenuItem>
                <MenuItem
                    onClick={() => this.setState({showSurfaceDialog: true})}>
                    <ListItemIcon><SlabIcon/></ListItemIcon>
                    Surface / slab
                </MenuItem>
                <MenuItem disabled>
                    <ListItemIcon><PolymerIcon/></ListItemIcon>
                    Polymer
                </MenuItem>
                <MenuItem disabled>
                    <ListItemIcon><NanotubeIcon/></ListItemIcon>
                    Nanotube
                </MenuItem>
            </ButtonActivatedMenuMaterialUI>
        );
    }

    openPageByURL(url) {window.open(url, "_blank")}

    renderHelpMenu() {
        return (
            <ButtonActivatedMenuMaterialUI title="Help">
                <MenuItem onClick={() => this.openPageByURL("https://docs.exabyte.io/materials-designer/overview/")}>
                    <ListItemIcon><HelpIcon/></ListItemIcon>
                    Documentation
                </MenuItem>
                <MenuItem
                    onClick={() => this.openPageByURL("https://docs.exabyte.io/tutorials/materials/overview/")}>
                    <ListItemIcon><AssignmentIcon/></ListItemIcon>
                    Tutorials
                </MenuItem>
            </ButtonActivatedMenuMaterialUI>
        );
    }

    renderSpinner() {
        return (
            <IconButton disabled className="spinner-icon">
                {
                    Boolean(this.props.isLoading)
                        ?
                        <i className="zmdi zmdi-spinner zmdi-hc-spin"/>
                        :
                        <i className="zmdi zmdi-check"/>
                }
            </IconButton>
        )
    }

    renderImportModal() {
        return Boolean(this.props.ImportModal) ?
            <this.props.ImportModal
                show={this.state.showImportMaterialsDialog}
                onHide={() => this.setState({showImportMaterialsDialog: false})}
                onSubmit={(materials) => {
                    this.props.onAdd(materials);
                    this.setState({showImportMaterialsDialog: false});
                }}
            />
            : null;
    }

    renderSaveActionDialog() {
        return Boolean(this.props.SaveActionDialog) ?
            <this.props.SaveActionDialog
                show={this.state.showSaveMaterialsDialog}
                material={this.props.material}
                onClose={() => this.setState({showSaveMaterialsDialog: false})}
                onSubmit={this.props.onSave}
            />
            : null;
    }

    renderThreejsEditorModal() {
        return <ThreejsEditorModal
            show={this.state.showThreejsEditorModal}
            onHide={(material) => {
                this.setState({showThreejsEditorModal: !this.state.showThreejsEditorModal});
                if (material) {
                    material.isUpdated = true; // to show it as new (yellow color)
                    this.props.onAdd(material);
                }
            }}
            materials={this.props.materials}
            modalId="threejs-editor"
        />
    }

    render() {
        if (this.state.showThreejsEditorModal) return this.renderThreejsEditorModal();
        const style = {borderBottom: '1px solid'};
        return (
            <Toolbar
                className={setClass(this.props.className, "materials-designer-header-menu")}
                style={style}
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
                    backdropColor='dark'
                    onSubmit={this.props.onGenerateSupercell}
                    onHide={() => this.setState({showSupercellDialog: false})}
                />

                <SurfaceDialog
                    show={this.state.showSurfaceDialog}
                    modalId="surfaceModal"
                    backdropColor='dark'
                    onSubmit={this.props.onGenerateSurface}
                    onHide={() => this.setState({showSurfaceDialog: false})}
                />

                {this.renderImportModal()}


                <ExportActionDialog
                    show={this.state.showExportMaterialsDialog}
                    onClose={() => this.setState({showExportMaterialsDialog: false})}
                    onSubmit={this.props.onExport}
                />

                {this.renderSaveActionDialog()}

                <CombinatorialBasisDialog
                    title="Generate Combinatorial Set"
                    modalId="combinatorialSetModal"
                    show={this.state.showCombinatorialDialog}
                    maxCombinatorialBasesCount={this.props.maxCombinatorialBasesCount}
                    backdropColor='dark'
                    material={this.props.material}
                    onHide={() => this.setState({showCombinatorialDialog: false})}
                    onSubmit={(...args) => {
                        this.props.onAdd(...args);
                        this.setState({showCombinatorialDialog: false});
                    }}
                />

                <InterpolateBasesDialog
                    title="Generate Interpolated Set"
                    modalId="interpolatedSetModal"
                    show={this.state.showInterpolateDialog}
                    backdropColor='dark'
                    material={this.props.material}
                    material2={this.props.materials[
                        (this.props.index + 1 === this.props.materials.length) ? 0 : this.props.index + 1
                        ]}
                    onHide={() => this.setState({showInterpolateDialog: false})}
                    onSubmit={(...args) => {
                        this.props.onAdd(...args);
                        this.setState({showInterpolateDialog: false});
                    }}
                />

            </Toolbar>
        )
    }
}
}

HeaderMenuToolbar.propTypes = {
    isLoading: React.PropTypes.bool,
    material: React.PropTypes.object,

    onUpdate: React.PropTypes.func,

    onUndo: React.PropTypes.func,
    onRedo: React.PropTypes.func,
    onReset: React.PropTypes.func,
    onClone: React.PropTypes.func,

    onAdd: React.PropTypes.func,
    onExport: React.PropTypes.func,
    onExit: React.PropTypes.func,

    onGenerateSupercell: React.PropTypes.func,
    onGenerateSurface: React.PropTypes.func,

    ImportModal: React.PropTypes.func,
    SaveActionDialog: React.PropTypes.func,

    maxCombinatorialBasesCount: React.PropTypes.number,

};

export default HeaderMenuToolbar;
