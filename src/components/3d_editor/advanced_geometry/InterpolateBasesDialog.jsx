import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import IconByName from "@exabyte-io/cove.js/dist/mui/components/icon/IconByName";
import { Made } from "@exabyte-io/made.js";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import React from "react";
import _ from "underscore";

import { displayMessage } from "../../../i18n/messages";
import { Material } from "../../../material";
import BasisText from "../../source_editor/BasisText";

class InterpolateBasesDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            numberOfSteps: 1,
            materialIndex: 0,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // eslint-disable-next-line no-unused-vars
    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        const basis1 = nextProps.material.Basis;
        const basis2 = nextProps.material2.Basis;
        if (!_.isEqual(basis1.elementsArray, basis2.elementsArray)) {
            this.setState({ message: displayMessage("basis.elementsNotEqual") });
        } else {
            // reset the message
            this.setState({ message: "" });
        }
    }

    handleSubmit() {
        const { message, numberOfSteps } = this.state;
        // do nothing when bases elements are not equal
        if (message) return;

        const { material, material2, onSubmit } = this.props;

        const basis1 = material.Basis;
        const basis2 = material2.Basis;

        // create combinatorial set from a given basis
        // eslint-disable-next-line new-cap
        const newBases = new Made.tools.basis.interpolate(basis1, basis2, numberOfSteps);

        const newMaterials = [];
        _.each(newBases, (newBasis, idx) => {
            const newMaterialConfig = {
                ...material.toJSON(),
                basis: newBasis.toJSON(),
                name: `${idx} - ${material.name} - ${newBasis.formula}`,
            };
            const newMaterial = new Material(newMaterialConfig);
            newMaterial.isUpdated = true;
            newMaterial.cleanOnCopy();
            newMaterials.push(newMaterial);
        });
        // pass up the chain and add materials with `atIndex = true`
        onSubmit(newMaterials, true);
    }

    getOptions = () => {
        return ["initial", "final"].map((value, idx) => {
            return (
                // eslint-disable-next-line react/no-array-index-key
                <MenuItem key={idx} value={idx}>
                    {value}
                </MenuItem>
            );
        });
    };

    render() {
        const { materialIndex, message, validated, numberOfSteps } = this.state;
        const { isOpen, onHide, title, material, material2, modalId } = this.props;
        const xyzContent = [material, material2][materialIndex].getBasisAsXyz();

        return (
            <Dialog
                id={modalId}
                open={isOpen}
                renderHeaderCustom={() => (
                    <Box
                        sx={{
                            m: 3,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="h6">
                            {title}
                            <a
                                className="m-l-10 combinatorial-info"
                                href="https://docs.exabyte.io/materials-designer/header-menu/advanced/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Interpolate Basis"
                            >
                                <IconByName name="shapes.info" />
                            </a>
                        </Typography>
                        <IconButton color="neutral" onClick={onHide}>
                            <IconByName name="actions.close" fontSize="small" />
                        </IconButton>
                    </Box>
                )}
                renderFooterCustom={() => (
                    <DialogActions>
                        <Button
                            id="generate-interpolated-set"
                            onClick={this.handleSubmit}
                            variant="outlined"
                            fullWidth
                            sx={{ m: 2 }}
                        >
                            Generate Interpolated Set
                        </Button>
                    </DialogActions>
                )}
            >
                <Box gap={1} sx={{ display: "flex", mb: 1 }}>
                    <FormControl fullWidth>
                        <TextField
                            id="form-number-immediate-steps"
                            label="# of intermediate steps"
                            variant="outlined"
                            size="small"
                            value={numberOfSteps}
                            type="number"
                            className="numberOfSteps"
                            onChange={(e) => {
                                this.setState({ numberOfSteps: parseInt(e.target.value, 10) });
                            }}
                            InputProps={{
                                inputProps: {
                                    min: 0,
                                    step: 1,
                                },
                                minWidth: 0,
                            }}
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel id="form-initial-final-structures">
                            Initial/Final structures
                        </InputLabel>
                        <Select
                            className="materialIndex"
                            labelId="form-initial-final-structures"
                            id="form-initial-final-structures"
                            value={materialIndex}
                            label="Initial/Final structures"
                            size="small"
                            sx={{ minWidth: 0 }}
                            onChange={(e) => {
                                this.setState({ materialIndex: parseInt(e.target.value, 10) });
                            }}
                        >
                            {this.getOptions()}
                        </Select>
                    </FormControl>
                </Box>
                <Box className="xyz" sx={{ minHeight: "65vmin" }}>
                    <BasisText readOnly content={xyzContent} />
                    {message && (
                        <Typography
                            variant="body1"
                            color={validated ? "success" : "error"}
                            textAlign="center"
                        >
                            {message}
                        </Typography>
                    )}
                </Box>
            </Dialog>
        );
    }
}

InterpolateBasesDialog.propTypes = {
    title: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    material: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    material2: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    modalId: PropTypes.string.isRequired,
};

export default InterpolateBasesDialog;
