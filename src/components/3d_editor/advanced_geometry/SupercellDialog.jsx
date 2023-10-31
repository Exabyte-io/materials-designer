import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import math from "mathjs";
import PropTypes from "prop-types";
import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";

class SupercellDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            m11: 1,
            m12: 0,
            m13: 0,
            m21: 0,
            m22: 1,
            m23: 0,
            m31: 0,
            m32: 0,
            m33: 1,
            message: "",
        };
        this.handleGenerateSupercell = this.handleGenerateSupercell.bind(this);
    }

    handleGenerateSupercell() {
        const { onSubmit, onHide } = this.props;
        const matrix = this.getMatrix();
        if (math.det(matrix) === 0) {
            this.setState({ message: "Matrix determinant must be non-zero." });
            return;
        }
        this.setState(
            {
                message: "",
            },
            () => {
                onSubmit(matrix.toArray());
                onHide();
            },
        );
    }

    getMatrix() {
        const { m11, m12, m13, m21, m22, m23, m31, m32, m33 } = this.state;

        return math.matrix([
            [m11, m12, m13],
            [m21, m22, m23],
            [m31, m32, m33],
        ]);
    }

    render() {
        const { message, m11, m12, m13, m21, m22, m23, m31, m32, m33 } = this.state;
        const { isOpen, onHide } = this.props;

        return (
            <Dialog
                open={isOpen}
                title="Generate supercell"
                onClose={onHide}
                renderFooterCustom={() => (
                    <DialogActions>
                        <Button
                            id="make-supercell"
                            onClick={this.handleGenerateSupercell}
                            variant="outlined"
                            fullWidth
                            sx={{ m: 2 }}
                        >
                            Submit
                        </Button>
                    </DialogActions>
                )}
            >
                <Box gap={1} sx={{ display: "flex", flexDirection: "column", mb: 1, pt: 1 }}>
                    <Box gap={1} sx={{ display: "flex" }}>
                        <FormControl>
                            <TextField
                                variant="outlined"
                                size="small"
                                value={m11}
                                type="number"
                                className="m11"
                                onChange={(e) => {
                                    this.setState({ m11: parseFloat(e.target.value) });
                                }}
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        step: 1,
                                    },
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                variant="outlined"
                                size="small"
                                value={m12}
                                type="number"
                                className="m12"
                                onChange={(e) => {
                                    this.setState({ m12: parseFloat(e.target.value) });
                                }}
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        step: 1,
                                    },
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                variant="outlined"
                                size="small"
                                value={m13}
                                type="number"
                                className="m13"
                                onChange={(e) => {
                                    this.setState({ m13: parseFloat(e.target.value) });
                                }}
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        step: 1,
                                    },
                                }}
                            />
                        </FormControl>
                    </Box>
                    <Box gap={1} sx={{ display: "flex" }}>
                        <FormControl>
                            <TextField
                                variant="outlined"
                                size="small"
                                value={m21}
                                type="number"
                                className="m21"
                                onChange={(e) => {
                                    this.setState({ m21: parseFloat(e.target.value) });
                                }}
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        step: 1,
                                    },
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                variant="outlined"
                                size="small"
                                value={m22}
                                type="number"
                                className="m22"
                                onChange={(e) => {
                                    this.setState({ m22: parseFloat(e.target.value) });
                                }}
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        step: 1,
                                    },
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                variant="outlined"
                                size="small"
                                value={m23}
                                type="number"
                                className="m23"
                                onChange={(e) => {
                                    this.setState({ m23: parseFloat(e.target.value) });
                                }}
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        step: 1,
                                    },
                                }}
                            />
                        </FormControl>
                    </Box>
                    <Box gap={1} sx={{ display: "flex" }}>
                        <FormControl>
                            <TextField
                                variant="outlined"
                                size="small"
                                value={m31}
                                type="number"
                                className="m31"
                                onChange={(e) => {
                                    this.setState({ m31: parseFloat(e.target.value) });
                                }}
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        step: 1,
                                    },
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                variant="outlined"
                                size="small"
                                value={m32}
                                type="number"
                                className="m32"
                                onChange={(e) => {
                                    this.setState({ m32: parseFloat(e.target.value) });
                                }}
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        step: 1,
                                    },
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                variant="outlined"
                                size="small"
                                value={m33}
                                type="number"
                                className="m33"
                                onChange={(e) => {
                                    this.setState({ m33: parseFloat(e.target.value) });
                                }}
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        step: 1,
                                    },
                                }}
                            />
                        </FormControl>
                    </Box>
                </Box>
                {message && (
                    <Typography variant="body1" color="error" textAlign="center">
                        {message}
                    </Typography>
                )}
            </Dialog>
        );
    }
}

SupercellDialog.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
};

export default SupercellDialog;
