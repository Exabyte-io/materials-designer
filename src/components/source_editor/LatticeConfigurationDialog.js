/* eslint-disable react/sort-comp */
import { Made } from "@exabyte-io/made.js";
import $ from "jquery";
import PropTypes from "prop-types";
import React from "react";

import { Material } from "../../material";
import { deepClone } from "../../utils/index";
import ToggleSwitch from "../include/ToggleSwitch";

/**
 * @summary Crystal Lattice configuration dialog.
 *
 * @property {object} unitOptions unit options to provide
 * @property {object} typeOptions type options to provide
 * @property {object} lattice the lattice
 * @property {func} onSubmit submitting the data event
 */
class LatticeConfigurationDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lattice: props.material.lattice,
            // used to preserve Basis in Angstroms
            preserveBasis: false,
        };

        this.handleUpdateLattice = this.handleUpdateLattice.bind(this);
        this.handleLatticeUnitSelected = this.handleLatticeUnitSelected.bind(this);
        this.handleLatticeTypeSelected = this.handleLatticeTypeSelected.bind(this);
        this.handleLatticeInputChanged = this.handleLatticeInputChanged.bind(this);
    }

    // eslint-disable-next-line no-unused-vars
    componentWillReceiveProps(newProps, newContext) {
        // update this component's state on props.material update
        this.setState({ lattice: newProps.material.lattice });
    }

    getLatticeUnitOptions() {
        const result = [];
        const { unitOptions } = this.props;
        unitOptions.forEach((item, i) => {
            result.push(
                // eslint-disable-next-line react/no-array-index-key
                <option value={item.value} key={"unit" + i}>
                    {item.label}
                </option>,
            );
        });
        return result;
    }

    getLatticeTypeOptions() {
        const result = [];
        const { typeOptions } = this.props;
        typeOptions.forEach((item, i) => {
            result.push(
                // eslint-disable-next-line react/no-array-index-key
                <option value={item.value} key={"type" + i}>
                    {item.label}
                </option>,
            );
        });
        return result;
    }

    isDisabled = () => {
        // TODO: implement converter from primitive to conventional cells and re-enable editables
        // const lattice = new Made.Lattice(this.state.lattice);
        return false; // !lattice.editables[param];
    };

    handleLatticeUnitSelected(e) {
        const { lattice } = this.state;
        const units = $(e.target).val();
        const newLattice = new Made.Lattice({
            ...lattice,
            units,
        });
        this.setState({ lattice: newLattice });
    }

    handleLatticeTypeSelected(e) {
        const { lattice } = this.state;
        const type = $(e.target).val();
        const newLattice = Made.Lattice.getDefaultPrimitiveLatticeConfigByType({
            ...lattice,
            type,
        });
        this.setState({ lattice: newLattice });
    }

    handleLatticeInputChanged(e) {
        const { lattice } = this.state;
        const val = Number($(e.target).val());
        const name = $(e.target).attr("name");
        const latticeConf = deepClone(lattice);
        latticeConf[name] = val;
        const newLattice = Made.Lattice.getDefaultPrimitiveLatticeConfigByType(latticeConf, true);
        this.setState({ lattice: newLattice });
    }

    handleUpdateLattice() {
        const { material, onUpdate, onSubmit } = this.props;
        const { preserveBasis, lattice } = this.state;
        const oldMaterialCopy = material.clone();
        if (preserveBasis) {
            oldMaterialCopy.toCartesian();
        } else {
            oldMaterialCopy.toCrystal();
        }
        const newMaterialConfig = {
            ...oldMaterialCopy.toJSON(),
            lattice,
        };

        // preserve basis if asked to do so (eg. when constructing a slab)
        const newMaterial = new Material(newMaterialConfig);
        // assert basis is stored in 'crystal' units
        newMaterial.toCrystal();
        onUpdate(newMaterial);
        onSubmit();
    }

    renderBody() {
        const { lattice } = this.state;
        return (
            <div className="crystal-lattice-config">
                <form
                    className="crystal-lattice-config"
                    ref={(e) => {
                        // eslint-disable-next-line react/no-unused-class-component-methods
                        this.form = e;
                    }}
                >
                    <div className="col-xs-12 p-0 lattice-basics">
                        <div className="col-md-6">
                            <div className="form-group">
                                <div className="fg-line">
                                    <label htmlFor="form-lattice-units">Lattice units</label>
                                    <select
                                        id="form-lattice-units"
                                        label="Lattice Units"
                                        name="units"
                                        className="form-control fc-alt"
                                        value={lattice.units.length}
                                        onChange={this.handleLatticeUnitSelected}
                                    >
                                        {this.getLatticeUnitOptions()}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group ">
                                <div className="fg-line">
                                    <label htmlFor="form-lattice-type">Lattice type</label>
                                    <select
                                        id="form-lattice-type"
                                        label="Lattice type"
                                        name="type"
                                        className="form-control fc-alt"
                                        value={lattice.type}
                                        onChange={this.handleLatticeTypeSelected}
                                    >
                                        {this.getLatticeTypeOptions()}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 p-0 lattice-params m-t-20">
                        <div className="col-xs-4">
                            <div className="form-group">
                                <div className="fg-line">
                                    <label className="fg-label" htmlFor="lattice-a-length">
                                        Lattice &#39;a&#39;
                                    </label>
                                    <input
                                        id="lattice-a-length"
                                        type="number"
                                        name="a"
                                        className="form-control fc-alt fg-input"
                                        min="0"
                                        step="0.05"
                                        disabled={this.isDisabled("a")}
                                        value={lattice.a}
                                        onChange={this.handleLatticeInputChanged}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-4">
                            <div className="form-group">
                                <div className="fg-line">
                                    <label className="fg-label" htmlFor="lattice-b-length">
                                        Lattice &#39;b&#39;
                                    </label>
                                    <input
                                        id="lattice-b-length"
                                        type="number"
                                        name="b"
                                        className="form-control fc-alt fg-input"
                                        min="0"
                                        step="0.05"
                                        disabled={this.isDisabled("b")}
                                        value={lattice.b}
                                        onChange={this.handleLatticeInputChanged}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-4">
                            <div className="form-group">
                                <div className="fg-line">
                                    <label className="fg-label" htmlFor="lattice-c-length">
                                        Lattice &#39;c&#39;
                                    </label>
                                    <input
                                        id="lattice-c-length"
                                        type="number"
                                        name="c"
                                        className="form-control fc-alt fg-input"
                                        min="0"
                                        step="0.05"
                                        disabled={this.isDisabled("c")}
                                        value={lattice.c}
                                        onChange={this.handleLatticeInputChanged}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 p-0 lattice-params m-b-20">
                        <div className="col-xs-4">
                            <div className="form-group">
                                <div className="fg-line">
                                    <label className="fg-label" htmlFor="form-angle-b-c">
                                        angle (b^c)
                                    </label>
                                    <input
                                        id="form-angle-b-c"
                                        type="number"
                                        name="alpha"
                                        className="form-control fc-alt fg-input"
                                        min="0"
                                        step="0.05"
                                        disabled={this.isDisabled("alpha")}
                                        value={lattice.alpha}
                                        onChange={this.handleLatticeInputChanged}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-4">
                            <div className="form-group">
                                <div className="fg-line">
                                    <label className="fg-label" htmlFor="form-angle-a-c">
                                        angle (a^c)
                                    </label>
                                    <input
                                        id="form-angle-a-c"
                                        type="number"
                                        name="beta"
                                        className="form-control fc-alt fg-input"
                                        min="0"
                                        step="0.05"
                                        disabled={this.isDisabled("beta")}
                                        value={lattice.beta}
                                        onChange={this.handleLatticeInputChanged}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-4">
                            <div className="form-group">
                                <div className="fg-line">
                                    <label className="fg-label" htmlFor="form-angle-a-b">
                                        angle (a^b)
                                    </label>
                                    <input
                                        id="form-angle-a-b"
                                        type="number"
                                        name="gamma"
                                        className="form-control fc-alt fg-input"
                                        min="0"
                                        step="0.05"
                                        disabled={this.isDisabled("gamma")}
                                        value={lattice.gamma}
                                        onChange={this.handleLatticeInputChanged}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    renderFooter() {
        const { submitButtonTxt } = this.props;
        const { preserveBasis } = this.state;
        return (
            <div className="col-xs-12 p-0">
                <ToggleSwitch
                    color="blue"
                    title="Preserve Basis"
                    class="pull-left"
                    onStateChange={() => this.setState({ preserveBasis: !preserveBasis })}
                    checked={preserveBasis}
                    id="access-level"
                />
                <button
                    type="submit"
                    className="btn btn-custom pull-right save-lattice-config"
                    data-dismiss="modal"
                    onClick={this.handleUpdateLattice}
                >
                    {submitButtonTxt}
                </button>
            </div>
        );
    }

    render() {
        const { className } = this.props;
        return (
            <div className={className}>
                {this.renderBody()}
                {this.renderFooter()}
            </div>
        );
    }
}

LatticeConfigurationDialog.propTypes = {
    className: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    unitOptions: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    typeOptions: PropTypes.array.isRequired,
    submitButtonTxt: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    material: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

LatticeConfigurationDialog.defaultProps = {
    submitButtonTxt: "Apply Edits",
};

export default LatticeConfigurationDialog;
