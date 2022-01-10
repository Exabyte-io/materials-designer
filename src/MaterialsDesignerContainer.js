import lodash from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import NPMsAlert from "react-s-alert";
import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import { ActionCreators } from "redux-undo";
import _ from "underscore";

import {
    addMaterials,
    cloneOneMaterial,
    exportMaterials,
    generateSupercellForOneMaterial,
    generateSurfaceForOneMaterial,
    MATERIALS_SAVE,
    materialsToggleIsNonPeriodicForOne,
    removeMaterials,
    resetState,
    saveMaterials,
    setBoundaryConditionsForOneMaterial,
    updateMaterialsIndex,
    updateNameForOneMaterial,
    updateOneMaterial,
} from "./actions";
import { SAlertContentTmpl } from "./components/include/SAlertContentTmpl";
import { Material } from "./material";
import MaterialsDesignerComponent from "./MaterialsDesigner";
import { createMaterialsDesignerReducer } from "./reducers";
import ReduxProvider from "./utils/react/provider";

const initialState = () => {
    return {
        index: 0,
        isLoading: false,
    };
};

const mapStateToProps = (state, ownProps) => {
    // handle redux-undo modifications to state
    state = state.present;
    return {
        index: state.index,
        material: state.materials ? state.materials[state.index] : null,
        materials: state.materials,
        editable: lodash.get(state, "editable", false),
        isLoading: state.isLoading,
        ...ownProps.parentProps,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        // Material
        onUpdate: (material, index) => dispatch(updateOneMaterial(material, index)),
        onNameUpdate: (name, index) => dispatch(updateNameForOneMaterial(name, index)),
        onItemClick: (index) => dispatch(updateMaterialsIndex(index)),

        // Toolbar
        onAdd: (materials, addAtIndex) => dispatch(addMaterials(materials, addAtIndex)),
        onRemove: (indices) => dispatch(removeMaterials(indices)),
        onExport: (format, useMultiple) => dispatch(exportMaterials(format, useMultiple)),
        onSave: (config) => dispatch(saveMaterials(config, dispatch)),

        onGenerateSupercell: (matrix) => dispatch(generateSupercellForOneMaterial(matrix)),
        onGenerateSurface: (config) => dispatch(generateSurfaceForOneMaterial(config)),
        onSetBoundaryConditions: (config) => dispatch(setBoundaryConditionsForOneMaterial(config)),

        // Undo-Redo
        onUndo: () => dispatch(ActionCreators.undo()),
        onRedo: () => dispatch(ActionCreators.redo()),
        onReset: () => dispatch(resetState(initialState())),
        onClone: () => dispatch(cloneOneMaterial()),
        onToggleIsNonPeriodic: () => dispatch(materialsToggleIsNonPeriodicForOne()),
    };
};

const MaterialsDesignerContainerHelper = connect(
    mapStateToProps,
    mapDispatchToProps,
)(MaterialsDesignerComponent);

export class MaterialsDesignerContainer extends React.Component {
    constructor(props) {
        super(props);
        const initialState_ = initialState();
        initialState_.materials = props.initialMaterials;
        const externalReducers = props.materialsSave
            ? { [MATERIALS_SAVE]: props.materialsSave }
            : {};
        const reducer = createMaterialsDesignerReducer(initialState_, externalReducers);
        this.store = createStore(
            reducer,
            props.applyMiddleware ? applyMiddleware(logger) : undefined,
        );
        this.container = MaterialsDesignerContainerHelper;
    }

    render() {
        const props = _.omit(this.props, "component");
        return (
            <div>
                <ReduxProvider {...props} container={this.container} store={this.store} />
                <NPMsAlert
                    effect="stackslide"
                    position="bottom-right"
                    timeout={3000}
                    html={false}
                    stack
                    offset={0}
                    contentTemplate={SAlertContentTmpl}
                />
            </div>
        );
    }
}

MaterialsDesignerContainer.propTypes = {
    childrenProps: PropTypes.object,
    applyMiddleware: PropTypes.bool,
    initialMaterials: PropTypes.array,
    onExit: PropTypes.func,
    ImportModal: PropTypes.func,
    SaveActionDialog: PropTypes.func,
    materialsSave: PropTypes.func,
    maxCombinatorialBasesCount: PropTypes.number,
    isConventionalCellShown: PropTypes.bool,
};

MaterialsDesignerContainer.defaultProps = {
    applyMiddleware: true,
    initialMaterials: Array(1).fill(new Material()),
};
