import React from "react";
import setClass from "classnames";

import Toolbar from 'material-ui-next/Toolbar';
import Divider from 'material-ui-next/Divider';
import {MenuItem} from 'material-ui-next/Menu';
import {ListItemIcon} from 'material-ui-next/List';
import IconButton from 'material-ui-next/IconButton';

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
    Contacts as ContactsIcon,
    Assignment as AssignmentIcon,

    // TODO: rename other menu icons similarly
    BorderClear as SupercellIcon,
    LibraryAdd as CombinatorialSetIcon,
    SwapVert as InterpolatedSetIcon,
    Layers as SlabIcon,
    Timeline as PolymerIcon,
    DonutLarge as NanotubeIcon,

} from 'material-ui-icons-next';

import {ButtonActivatedMenuMaterialUI} from "../include/material-ui/ButtonActivatedMenu";
//import {displayMessage} from "../../i18n/messages";

import SupercellDialog from "../3d_editor/advanced_geometry/SupercellDialog";
import SurfaceDialog from "../3d_editor/advanced_geometry/SurfaceDialog";
import CombinatorialBasisDialog from "../3d_editor/advanced_geometry/CombinatorialBasisDialog";
import InterpolateBasesDialog from "../3d_editor/advanced_geometry/InterpolateBasesDialog";
//import MaterialsExplorerModal from "../../../explorer/MaterialsExplorerModal";
import ExportActionDialog from "./ExportActionDialog";
import SaveActionDialog from "./SaveActionDialog";

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
            showSelectSetDialog: false,
            entitySetClsInstance: undefined, // intentionally undefined initially
        };
    }

    renderIOMenu() {
        return (
            <ButtonActivatedMenuMaterialUI title="Input/Output">
                <MenuItem onClick={() => this.setState({showImportMaterialsDialog: true})}>
                    <ListItemIcon><AddCircleIcon/></ListItemIcon>
                    Import
                </MenuItem>
                <MenuItem onClick={() => this.setState({showExportMaterialsDialog: true})}>
                    <ListItemIcon><FileDownloadIcon/></ListItemIcon>
                    Export
                </MenuItem>
                <MenuItem onClick={() => this.setState({showSaveMaterialsDialog: true})}>
                    <ListItemIcon><SaveIcon/></ListItemIcon>
                    Save
                </MenuItem>
                <MenuItem onClick={() => {
//                    Router.go('accountPage', {
//                        accountSlug: AccountsSelector.currentAccount().slug,
//                        tab: 'materials',
//                    }, {query: getRouteQueryParametersFromInSet(getInSetFromRoute())});
                }}>
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
                <MenuItem disabled>
                    <ListItemIcon><CheckIcon/></ListItemIcon>
                    Sidebar
                </MenuItem>
                <MenuItem disabled>
                    <ListItemIcon><CheckIcon/></ListItemIcon>
                    3D Editor
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
//                    disabled={!FeatureHandler.isAccessibleByCurrentAccount("SurfaceBuilder")}
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

    renderHelpMenu() {
        return (
            <ButtonActivatedMenuMaterialUI title="Help">
                <MenuItem disabled>
                    <ListItemIcon><HelpIcon/></ListItemIcon>
                    Documentation
                </MenuItem>
                <MenuItem disabled>
                    <ListItemIcon><AssignmentIcon/></ListItemIcon>
                    Tutorials
                </MenuItem>
                <MenuItem disabled>
                    <ListItemIcon><ContactsIcon/></ListItemIcon>
                    Contact
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

    render() {
        const style = {
            borderBottom: '1px solid',
        };
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

                {/*<MaterialsExplorerModal*/}
                    {/*title="Import materials"*/}
                    {/*show={this.state.showImportMaterialsDialog}*/}
                    {/*hintText="Search materials by name, formula, symmetry..."*/}
                    {/*modalId="material-add"*/}
                    {/*backdropColor='dark'*/}
                    {/*onHide={() => this.setState({showImportMaterialsDialog: false})}*/}
                    {/*onSubmit={(materials) => {*/}
                        {/*this.props.onAdd(materials);*/}
                        {/*this.setState({showImportMaterialsDialog: false});*/}
                    {/*}}*/}
                {/*/>*/}


                <ExportActionDialog
                    show={this.state.showExportMaterialsDialog}
                    onClose={() => this.setState({showExportMaterialsDialog: false})}
                    onSubmit={this.props.onExport}
                />

                <SaveActionDialog
                    show={this.state.showSaveMaterialsDialog}
                    tags={this.props.material.tags}
                    isPublic={this.props.material.isPublic}
                    isSetPublicVisible={this.props.isSetPublicVisible}
                    onClose={() => this.setState({showSaveMaterialsDialog: false})}
                    onSubmit={this.props.onSave}
                    entitySetClsInstance={this.state.entitySetClsInstance}
                    onShowSelectStateDialog={() => this.setState({
                            showSaveMaterialsDialog: false,
                        },
                        () => this.setState({showSelectSetDialog: true,})
                    )}
                />

                {/* SelectSet Dialog */}
                {/*<MaterialsExplorerModal*/}
                    {/*title="Select material set"*/}
                    {/*show={this.state.showSelectSetDialog}*/}
                    {/*hintText="Search by name"*/}
                    {/*modalId="materials-set-select"*/}
                    {/*omitEntitySetFunctions={false}*/}
                    {/*omitEntitySelection={true}*/}
                    {/*omitEntitySetSelection={false}*/}
                    {/*selectionLimit={1}*/}
                    {/*onHide={() => this.setState({*/}
                            {/*showSaveMaterialsDialog: true,*/}
                        {/*},*/}
                        {/*() => this.setState({showSelectSetDialog: false,})*/}
                    {/*)}*/}
                    {/*onSubmit={(entitySets) => {*/}
                        {/*const materialSet = entitySets[0];*/}
                        {/*if (entitySets.length > 1) {*/}
                            {/*// throw error re-using generic message for workflows*/}
{/*//                            sAlert.warning(displayMessage('workflow.errors.select.singleOnly'));*/}
                            {/*return*/}
                        {/*}*/}
                        {/*if (!materialSet.isEntitySet) {*/}
{/*//                            sAlert.warning(displayMessage('errors.notAnEntitySet'));*/}
                            {/*return;*/}
                        {/*}*/}
                        {/*this.setState({*/}
                                {/*showSelectSetDialog: false,*/}
                                {/*entitySetClsInstance: materialSet,*/}
                            {/*},*/}
                            {/*() => this.setState({showSaveMaterialsDialog: true,})*/}
                        {/*);*/}
                    {/*}}*/}
                {/*/>*/}

                <CombinatorialBasisDialog
                    title="Generate Combinatorial Set"
                    modalId="combinatorialSetModal"
                    show={this.state.showCombinatorialDialog}
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

    onGenerateSupercell: React.PropTypes.func,
    onGenerateSurface: React.PropTypes.func,
};

export default HeaderMenuToolbar;
