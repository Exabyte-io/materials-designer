import React from "react";
import _ from "underscore";
import lodash from "lodash";
import {Made} from "made.js";
import Alert from 'react-s-alert';
import logger from "redux-logger";
import {connect} from "react-redux";
import {ActionCreators} from 'redux-undo';

import {createStore, applyMiddleware} from "redux";

import ReduxProvider from "./utils/react/provider";
import {createMaterialsDesignerReducer} from "./reducers";
import MaterialsDesignerComponent from "./MaterialsDesigner";
import {
    updateOneMaterial, updateNameForOneMaterial, cloneOneMaterial, updateMaterialsIndex,
    addMaterials, removeMaterials, exportMaterials, saveMaterials, generateSupercellForOneMaterial,
    generateSurfaceForOneMaterial, resetState,
} from "./actions";

const initialState = () => {
    return {
        index: 0,
        isLoading: false,
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
        onSave: (...args) => (dispatch(saveMaterials(dispatch, ...args))),

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

export class MaterialsDesignerContainer extends React.Component {

    constructor(props) {
        super(props);
        const initialState_ = initialState();
        initialState_.materials = props.initialMaterials;
        const reducer = createMaterialsDesignerReducer(initialState_, props.externalReducers);
        this.store = createStore(reducer, props.applyMiddleware ? applyMiddleware(logger) : undefined);
        this.container = MaterialsDesignerContainerHelper;
    }

    render() {
        const props = _.omit(this.props, "component");
        return (
            <div>
                <ReduxProvider
                    {...props}
                    container={this.container}
                    store={this.store}
                />
                <Alert
                    effect='stackslide'
                    position='bottom-right'
                    timeout={3000}
                    html={false}
                    stack={true}
                    offset={0}
                />
            </div>
        )
    }

}

MaterialsDesignerContainer.propTypes = {
    childrenProps: React.PropTypes.object,
    applyMiddleware: React.PropTypes.bool,
    initialMaterials: React.PropTypes.array,
    onExit: React.PropTypes.func,
    ImportModal: React.PropTypes.func,
    SaveActionDialog: React.PropTypes.func,
    externalReducers: React.PropTypes.object,
};

MaterialsDesignerContainer.defaultProps = {
    applyMiddleware: true,
    externalReducers: {},
    initialMaterials: Array(1).fill(new Made.Material(Made.defaultMaterialConfig)),
};
