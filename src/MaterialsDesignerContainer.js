import _ from "underscore";
import lodash from "lodash";
import {connect} from "react-redux";
import {createStore, applyMiddleware} from "redux";
import logger from "redux-logger";
import {ActionCreators} from 'redux-undo';

import {Material} from "../../../material";
import {AccountsSelector} from "/imports/accounts/selector";

import MaterialsDesignerComponent from "./MaterialsDesigner";
import {
    updateOneMaterial, updateNameForOneMaterial, cloneOneMaterial,
    updateMaterialsIndex,
    addMaterials, removeMaterials, exportMaterials, saveMaterials,
    generateSupercellForOneMaterial, generateSurfaceForOneMaterial,
    resetState,
} from "./actions";

const initialState = () => {
    const account = AccountsSelector.currentAccount();
    const defaultMaterial = (account && account.defaultMaterial) || Material.createDefault();
    return {
        materials: Array(1).fill(defaultMaterial),
        index: 0,
        isLoading: false,
        isSetPublicVisible: account && account.serviceLevel.privateDataAllowed || false,
    }
};

const mapStateToProps = (state, ownProps) => {
    // handle redux-undo modifications to state
    state = state.present;
    return Object.assign({}, {
        index: state.index,
        material: state.materials ? state.materials[state.index] : null,
        materials: state.materials,
        editable: lodash.get(state, 'editable', false),
        isLoading: state.isLoading,
        isSetPublicVisible: state.isSetPublicVisible,
    }, ownProps.parentProps);
};

const mapDispatchToProps = (dispatch) => {
    return {
        // Material
        onUpdate: (material, index) => (dispatch(updateOneMaterial(material, index))),
        onNameUpdate: (name, index) => (dispatch(updateNameForOneMaterial(name, index))),
        onItemClick: (index) => (dispatch(updateMaterialsIndex(index))),

        // Toolbar
        onAdd: (materials, addAtIndex) => dispatch(addMaterials(materials, addAtIndex)),
        onRemove: (indices) => (dispatch(removeMaterials(indices))),
        onExport: (format, useMultiple) => (dispatch(exportMaterials(format, useMultiple))),
        onSave: (...args) => (dispatch(saveMaterials(...args, dispatch))),

        onGenerateSupercell: (matrix) => (dispatch(generateSupercellForOneMaterial(matrix))),
        onGenerateSurface: (config) => (dispatch(generateSurfaceForOneMaterial(config))),

        // Undo-Redo
        onUndo: () => dispatch(ActionCreators.undo()),
        onRedo: () => dispatch(ActionCreators.redo()),
        onReset: () => dispatch(resetState(initialState())),
        onClone: () => dispatch(cloneOneMaterial()),

    }
};

const MaterialsDesignerContainerHelper = connect(
    mapStateToProps,
    mapDispatchToProps
)(MaterialsDesignerComponent);

import React from "react";
import ReduxProvider from "/imports/utils/react/provider";
import {createMaterialsDesignerReducer} from "./reducers";

export class MaterialsDesignerContainer extends React.Component {

    constructor(props) {
        super(props);
        const reducer = createMaterialsDesignerReducer(initialState());
        this.store = createStore(reducer, Meteor.settings.public.isProduction ? undefined : applyMiddleware(logger));
        this.container = MaterialsDesignerContainerHelper;
    }

    render() {
        const props = _.omit(this.props, "component");
        return (
            <ReduxProvider
                {...props}
                container={this.container}
                store={this.store}
            />
        )
    }

}

MaterialsDesignerContainer.propTypes = {
    childrenProps: React.PropTypes.object,
};

MaterialsDesignerContainer.defaultProps = {};

export default MaterialsDesignerContainer;
