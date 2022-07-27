/* eslint-disable react/jsx-props-no-spreading */
import lodash from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import NPMsAlert from "react-s-alert";
import { applyMiddleware, createStore } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
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
    undo,
    redo,
} from "./actions";
import SAlertContentTmpl from "./components/include/SAlertContentTmpl";
import { Material } from "./material";
import MaterialsDesignerComponent from "./MaterialsDesigner";
import { createMaterialsDesignerReducer } from "./reducers";
import ReduxProvider from "./utils/react/provider";

const initialMaterials = Array(1).fill(new Material());

const initialState = ({ materials = initialMaterials } = {}) => {
    return {
        index: 0,
        isLoading: false,
        materials,
    };
};

const mapStateToProps = (state, ownProps) => {
    // handle redux-undo modifications to state
    const { present } = state;
    return {
        index: present.index,
        material: present.materials ? present.materials[present.index] : null,
        materials: present.materials,
        editable: lodash.get(present, "editable", false),
        isLoading: present.isLoading,
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
        onUndo: () => dispatch(undo()),
        onRedo: () => dispatch(redo()),
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
        const initialState_ = initialState({ materials: props.initialMaterials });
        const externalReducers = props.materialsSave
            ? { [MATERIALS_SAVE]: props.materialsSave }
            : {};
        const reducer = createMaterialsDesignerReducer(initialState_, externalReducers);
        this.store = createStore(
            reducer,
            props.applyMiddleware ? applyMiddleware(thunk, logger) : applyMiddleware(thunk),
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
    // eslint-disable-next-line react/forbid-prop-types, react/require-default-props
    childrenProps: PropTypes.object,
    applyMiddleware: PropTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types
    initialMaterials: PropTypes.array,
    // eslint-disable-next-line react/require-default-props
    onExit: PropTypes.func,
    // eslint-disable-next-line react/require-default-props
    ImportModal: PropTypes.func,
    // eslint-disable-next-line react/require-default-props
    SaveActionDialog: PropTypes.func,
    // eslint-disable-next-line react/require-default-props
    materialsSave: PropTypes.func,
    // eslint-disable-next-line react/require-default-props
    maxCombinatorialBasesCount: PropTypes.number,
    // eslint-disable-next-line react/require-default-props
    isConventionalCellShown: PropTypes.bool,
};

MaterialsDesignerContainer.defaultProps = {
    applyMiddleware: true,
    initialMaterials,
};
