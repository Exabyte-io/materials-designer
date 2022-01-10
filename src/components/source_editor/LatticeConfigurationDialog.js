import { Made } from "@exabyte-io/made.js";
import $ from "jquery";
import React from "react";
import { ModalHeader } from "react-bootstrap";

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
            lattice: this.props.material.lattice,
            // used to preserve Basis in Angstroms
            preserveBasis: false,
        };

        this.handleUpdateLattice = this.handleUpdateLattice.bind(this);
        this.handleLatticeUnitSelected = this.handleLatticeUnitSelected.bind(this);
        this.handleLatticeTypeSelected = this.handleLatticeTypeSelected.bind(this);
        this.handleLatticeInputChanged = this.handleLatticeInputChanged.bind(this);
    }

    componentWillReceiveProps(newProps) {
        // update this component's state on props.material update
        this.setState({ lattice: newProps.material.lattice });
    }

    renderHeader() {
        return (
            <ModalHeader className="bgm-dark" closeButton>
                <h4 className="modal-title">Crystal Lattice (Primitive)</h4>
            </ModalHeader>
        );
    }

    getLatticeUnitOptions() {
        const result = [];
        this.props.unitOptions.forEach((item, i) => {
            result.push(
                <option value={item.value} key={"unit" + i}>
                    {item.label}
                </option>,
            );
        });
        return result;
    }

    getLatticeTypeOptions() {
        const result = [];
        this.props.typeOptions.forEach((item, i) => {
            result.push(
                <option value={item.value} key={"type" + i}>
                    {item.label}
                </option>,
            );
        });
        return result;
    }

    isDisabled(param) {
        // TODO: implement converter from primitive to conventional cells and re-enable editables
        // const lattice = new Made.Lattice(this.state.lattice);
        return false; // !lattice.editables[param];
    }

    handleLatticeUnitSelected(e) {
        const units = $(e.target).val();
        const lattice = new Made.Lattice({
            ...this.state.lattice,
            units,
        });
        this.setState({ lattice });
    }

    handleLatticeTypeSelected(e) {
        const type = $(e.target).val();
        const newLattice = Made.Lattice.getDefaultPrimitiveLatticeConfigByType({
            ...this.state.lattice,
            type,
        });
        this.setState({ lattice: newLattice });
    }

    handleLatticeInputChanged(e) {
        const val = Number($(e.target).val());
        const name = $(e.target).attr("name");
        const latticeConf = deepClone(this.state.lattice);
        latticeConf[name] = val;
        //        const lattice = new Made.Lattice(latticeConf);
        const newLattice = Made.Lattice.getDefaultPrimitiveLatticeConfigByType(latticeConf, true);
        this.setState({ lattice: newLattice });
    }

    handleUpdateLattice() {
        const oldMaterialCopy = this.props.material.clone();
        this.state.preserveBasis ? oldMaterialCopy.toCartesian() : oldMaterialCopy.toCrystal();

        const newMaterialConfig = {
            ...oldMaterialCopy.toJSON(),
            lattice: this.state.lattice,
        };

        // preserve basis if asked to do so (eg. when constructing a slab)
        const newMaterial = new Material(newMaterialConfig);
        // assert basis is stored in 'crystal' units
        newMaterial.toCrystal();
        this.props.onUpdate(newMaterial);
        this.props.onSubmit();
    }

    renderBody() {
        return (
            <div className="crystal-lattice-config">
                <form
                    className="crystal-lattice-config"
                    ref={(e) => {
                        this.form = e;
                    }}
                >
                    <div className="col-xs-12 p-0 lattice-basics">
                        <div className="col-md-6">
                            <div className="form-group ">
                                <label>Lattice units</label>
                                <div className="fg-line">
                                    <select
                                        label="Lattice Units"
                                        name="units"
                                        className="form-control fc-alt"
                                        value={this.state.lattice.units.length}
                                        onChange={this.handleLatticeUnitSelected}
                                    >
                                        {this.getLatticeUnitOptions()}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group ">
                                <label>Lattice type</label>
                                <div className="fg-line">
                                    <select
                                        label="Lattice type"
                                        name="type"
                                        className="form-control fc-alt"
                                        value={this.state.lattice.type}
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
                                <label className="fg-label">Lattice 'a'</label>
                                <div className="fg-line">
                                    <input
                                        type="number"
                                        name="a"
                                        className="form-control fc-alt fg-input"
                                        min="0"
                                        step="0.05"
                                        disabled={this.isDisabled("a")}
                                        value={this.state.lattice.a}
                                        onChange={this.handleLatticeInputChanged}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-4">
                            <div className="form-group">
                                <div className="fg-line">
                                    <label className="fg-label">Lattice 'b'</label>
                                    <input
                                        type="number"
                                        name="b"
                                        className="form-control fc-alt fg-input"
                                        min="0"
                                        step="0.05"
                                        disabled={this.isDisabled("b")}
                                        value={this.state.lattice.b}
                                        onChange={this.handleLatticeInputChanged}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-4">
                            <div className="form-group">
                                <div className="fg-line">
                                    <label className="fg-label">Lattice 'c'</label>
                                    <input
                                        type="number"
                                        name="c"
                                        className="form-control fc-alt fg-input"
                                        min="0"
                                        step="0.05"
                                        disabled={this.isDisabled("c")}
                                        value={this.state.lattice.c}
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
                                    <label className="fg-label">angle (b^c)</label>
                                    <input
                                        type="number"
                                        name="alpha"
                                        className="form-control fc-alt fg-input"
                                        min="0"
                                        step="0.05"
                                        disabled={this.isDisabled("alpha")}
                                        value={this.state.lattice.alpha}
                                        onChange={this.handleLatticeInputChanged}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-4">
                            <div className="form-group">
                                <div className="fg-line">
                                    <label className="fg-label">angle (a^c)</label>
                                    <input
                                        type="number"
                                        name="beta"
                                        className="form-control fc-alt fg-input"
                                        min="0"
                                        step="0.05"
                                        disabled={this.isDisabled("beta")}
                                        value={this.state.lattice.beta}
                                        onChange={this.handleLatticeInputChanged}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-4">
                            <div className="form-group">
                                <div className="fg-line">
                                    <label className="fg-label">angle (a^b)</label>
                                    <input
                                        type="number"
                                        name="gamma"
                                        className="form-control fc-alt fg-input"
                                        min="0"
                                        step="0.05"
                                        disabled={this.isDisabled("gamma")}
                                        value={this.state.lattice.gamma}
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
        return (
            <div className="col-xs-12 p-0">
                <ToggleSwitch
                    color="blue"
                    title="Preserve Basis"
                    class="pull-left"
                    onStateChange={() =>
                        this.setState({ preserveBasis: !this.state.preserveBasis })
                    }
                    checked={this.state.preserveBasis}
                    id="access-level"
                />
                <button
                    className="btn btn-custom pull-right save-lattice-config"
                    data-dismiss="modal"
                    onClick={this.handleUpdateLattice}
                >
                    {this.props.submitButtonTxt || "Apply Edits"}
                </button>
            </div>
        );
    }

    render() {
        return (
            <div className={this.props.className}>
                {this.renderBody()}
                {this.renderFooter()}
            </div>
        );
    }
}

LatticeConfigurationDialog.propTypes = {
    unitOptions: React.PropTypes.array.isRequired,
    typeOptions: React.PropTypes.array.isRequired,
    submitButtonTxt: React.PropTypes.string,
    material: React.PropTypes.object,
    onUpdate: React.PropTypes.func.isRequired,
};

export default LatticeConfigurationDialog;
