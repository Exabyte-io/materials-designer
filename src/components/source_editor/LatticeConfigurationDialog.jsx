/* eslint-disable react/sort-comp */
import { Made } from "@exabyte-io/made.js";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
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
    UNSAFE_componentWillReceiveProps(newProps, newContext) {
        // update this component's state on props.material update
        this.setState({ lattice: newProps.material.lattice });
    }

    getLatticeUnitOptions() {
        const result = [];
        const { unitOptions } = this.props;
        unitOptions.forEach((item, i) => {
            result.push(
                // eslint-disable-next-line react/no-array-index-key
                <MenuItem value={item.value} key={"type" + i}>
                    {item.label}
                </MenuItem>,
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
                <MenuItem value={item.value} key={"type" + i}>
                    {item.label}
                </MenuItem>,
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
        const units = e.target.value;
        const newLattice = new Made.Lattice({
            ...lattice,
            units,
        });
        this.setState({ lattice: newLattice });
    }

    handleLatticeTypeSelected(e) {
        const { lattice } = this.state;
        const type = e.target.value;
        const newLattice = Made.Lattice.getDefaultPrimitiveLatticeConfigByType({
            ...lattice,
            type,
        });
        this.setState({ lattice: newLattice });
    }

    handleLatticeInputChanged(e) {
        const { lattice } = this.state;
        const val = Number(e.target.value);
        const { name } = e.target;
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
                    <Box className="lattice-basics" sx={{ display: "flex", gap: 1 }}>
                        <FormControl>
                            <InputLabel id="form-lattice-units">Lattice units</InputLabel>
                            <Select
                                labelId="form-lattice-units"
                                id="form-lattice-units"
                                value={lattice.units.length}
                                label="Lattice units"
                                size="small"
                                onChange={this.handleLatticeUnitSelected}
                            >
                                {this.getLatticeUnitOptions()}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel id="form-lattice-type">Lattice type</InputLabel>
                            <Select
                                labelId="form-lattice-type"
                                id="form-lattice-type"
                                data-tid="type"
                                value={lattice.type}
                                label="Lattice type"
                                size="small"
                                onChange={this.handleLatticeTypeSelected}
                            >
                                {this.getLatticeTypeOptions()}
                            </Select>
                        </FormControl>
                    </Box>
                    <Grid container spacing={1} className="lattice-params" mt={3}>
                        <Grid item xs={4} sx={{ mb: 2 }}>
                            <TextField
                                id="lattice-a-length"
                                label="Lattice 'a'"
                                variant="outlined"
                                name="a"
                                size="small"
                                disabled={this.isDisabled("a")}
                                value={lattice.a}
                                type="number"
                                onChange={this.handleLatticeInputChanged}
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        step: 0.05,
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                id="lattice-b-length"
                                label="Lattice 'b'"
                                variant="outlined"
                                name="b"
                                size="small"
                                disabled={this.isDisabled("b")}
                                value={lattice.b}
                                type="number"
                                onChange={this.handleLatticeInputChanged}
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        step: 0.05,
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                id="lattice-c-length"
                                label="Lattice 'c'"
                                variant="outlined"
                                name="c"
                                size="small"
                                disabled={this.isDisabled("b")}
                                value={lattice.c}
                                type="number"
                                onChange={this.handleLatticeInputChanged}
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        step: 0.05,
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} sx={{ mb: 2 }} className="lattice-params">
                        <Grid item xs={4}>
                            <TextField
                                id="form-angle-b-c"
                                label="angle (b^c)"
                                variant="outlined"
                                name="alpha"
                                size="small"
                                disabled={this.isDisabled("alpha")}
                                value={lattice.alpha}
                                type="number"
                                onChange={this.handleLatticeInputChanged}
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        step: 0.05,
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                id="form-angle-a-c"
                                label="angle (a^c)"
                                variant="outlined"
                                name="beta"
                                size="small"
                                disabled={this.isDisabled("beta")}
                                value={lattice.beta}
                                type="number"
                                onChange={this.handleLatticeInputChanged}
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        step: 0.05,
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                id="form-angle-a-b"
                                label="angle (a^b)"
                                variant="outlined"
                                name="gamma"
                                size="small"
                                disabled={this.isDisabled("gamma")}
                                value={lattice.gamma}
                                type="number"
                                onChange={this.handleLatticeInputChanged}
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        step: 0.05,
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                </form>
            </div>
        );
    }

    renderFooter() {
        const { submitButtonTxt } = this.props;
        const { preserveBasis } = this.state;
        return (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <ToggleSwitch
                    color="blue"
                    title="Preserve Basis"
                    onStateChange={() => this.setState({ preserveBasis: !preserveBasis })}
                    checked={preserveBasis}
                    id="access-level"
                />
                <Button
                    size="small"
                    variant="outlined"
                    className="save-lattice-config"
                    onClick={this.handleUpdateLattice}
                >
                    {submitButtonTxt}
                </Button>
            </Box>
        );
    }

    render() {
        return (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                {this.renderBody()}
                {this.renderFooter()}
            </Box>
        );
    }
}

LatticeConfigurationDialog.propTypes = {
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
