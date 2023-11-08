import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import { BOUNDARY_CONDITIONS } from "@exabyte-io/wave.js/dist/enums";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import React from "react";

export class BoundaryConditionsDialog extends React.Component {
    constructor(props) {
        super(props);
        this.initializeState();
        this.handleSetBoundaryConditions = this.handleSetBoundaryConditions.bind(this);
    }

    // eslint-disable-next-line no-unused-vars
    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        this.initializeState();
    }

    handleSetBoundaryConditions() {
        const { onSubmit, onHide } = this.props;

        onSubmit(this.state);
        onHide();
    }

    getBoundaryTypeOptions = () => {
        return BOUNDARY_CONDITIONS.map((e) => (
            <MenuItem key={e.type} value={e.type}>
                {e.name}
            </MenuItem>
        ));
    };

    initializeState() {
        const { material } = this.props;

        this.state = {
            boundaryType: material.boundaryConditions.type || "pbc",
            boundaryOffset: material.boundaryConditions.offset || 0,
        };
    }

    render() {
        const { isOpen, title, onHide, modalId } = this.props;
        const { boundaryType, boundaryOffset } = this.state;

        return (
            <Dialog
                id={modalId}
                title={title || "Set Boundary Conditions"}
                open={isOpen}
                onClose={onHide}
                renderFooterCustom={() => (
                    <DialogActions>
                        <Button
                            id="boundary-conditions-submit"
                            onClick={this.handleSetBoundaryConditions}
                            variant="outlined"
                            fullWidth
                            sx={{ m: 2 }}
                        >
                            Submit
                        </Button>
                    </DialogActions>
                )}
            >
                <Box id="boundary-conditions" pt={3} gap={1} sx={{ display: "flex" }}>
                    <FormControl fullWidth data-tid="type">
                        <InputLabel id="form-boundary-conditions-type">Type</InputLabel>
                        <Select
                            labelId="form-boundary-conditions-type"
                            id="form-boundary-conditions-type"
                            data-tid="type"
                            value={boundaryType}
                            label="Type"
                            size="small"
                            onChange={(e) => this.setState({ boundaryType: e.target.value })}
                        >
                            {this.getBoundaryTypeOptions()}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth data-tid="offset">
                        <TextField
                            id="form-boundary-conditions-offset-a"
                            label="Offset (A)"
                            variant="outlined"
                            size="small"
                            value={boundaryOffset}
                            type="number"
                            onChange={(e) =>
                                this.setState({
                                    boundaryOffset: parseFloat(e.target.value),
                                })
                            }
                            InputProps={{
                                inputProps: {
                                    min: 0,
                                },
                            }}
                        />
                    </FormControl>
                </Box>
            </Dialog>
        );
    }
}

BoundaryConditionsDialog.propTypes = {
    title: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    material: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    modalId: PropTypes.string.isRequired,
};
