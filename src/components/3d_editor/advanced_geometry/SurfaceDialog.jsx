import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import PropTypes from "prop-types";
import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";

class SurfaceDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            h: 1,
            k: 0,
            l: 0,
            thickness: 3,
            vacuumRatio: 0.8,
            vx: 1,
            vy: 1,
            message: "",
        };
        this.handleGenerateSurface = this.handleGenerateSurface.bind(this);
    }

    handleGenerateSurface() {
        const { onSubmit, onHide } = this.props;

        this.setState(
            {
                message: "",
            },
            () => {
                onSubmit(this.state);
                onHide();
            },
        );
    }

    render() {
        const { message, h, k, l, thickness, vacuumRatio, vx, vy } = this.state;
        const { isOpen, onHide } = this.props;

        return (
            <Dialog
                open={isOpen}
                title="Generate surface/slab"
                onClose={onHide}
                renderFooterCustom={() => (
                    <DialogActions>
                        <Button
                            id="make-surface"
                            onClick={this.handleGenerateSurface}
                            variant="outlined"
                            fullWidth
                            sx={{ m: 2 }}
                        >
                            Submit
                        </Button>
                    </DialogActions>
                )}
            >
                <Box
                    id="surface"
                    className="surface"
                    gap={1}
                    sx={{ display: "flex", flexDirection: "column", mb: 1, pt: 1 }}
                >
                    <Box gap={1} sx={{ display: "flex", mb: 1 }}>
                        <FormControl data-tid="miller-h">
                            <TextField
                                label="Miller h"
                                variant="outlined"
                                size="small"
                                value={h}
                                type="number"
                                onChange={(e) => {
                                    this.setState({ h: parseFloat(e.target.value) });
                                }}
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        step: 1,
                                    },
                                }}
                            />
                        </FormControl>
                        <FormControl data-tid="miller-k">
                            <TextField
                                label="Miller k"
                                variant="outlined"
                                size="small"
                                value={k}
                                type="number"
                                onChange={(e) => {
                                    this.setState({ k: parseFloat(e.target.value) });
                                }}
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        step: 1,
                                    },
                                }}
                            />
                        </FormControl>
                        <FormControl data-tid="miller-l">
                            <TextField
                                label="Miller l"
                                variant="outlined"
                                size="small"
                                value={l}
                                type="number"
                                onChange={(e) => {
                                    this.setState({ l: parseFloat(e.target.value) });
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
                    <Box gap={1} sx={{ display: "flex", mb: 1 }}>
                        <FormControl data-tid="thickness" fullWidth>
                            <TextField
                                label="Thickness in layers"
                                variant="outlined"
                                size="small"
                                value={thickness}
                                type="number"
                                onChange={(e) => {
                                    this.setState({ thickness: parseFloat(e.target.value) });
                                }}
                                InputProps={{
                                    inputProps: {
                                        min: 1,
                                        step: 1,
                                    },
                                }}
                            />
                        </FormControl>
                        <FormControl data-tid="vacuum-ratio" fullWidth>
                            <TextField
                                label="Vacuum ratio"
                                variant="outlined"
                                size="small"
                                value={vacuumRatio}
                                type="number"
                                onChange={(e) => {
                                    this.setState({ vacuumRatio: parseFloat(e.target.value) });
                                }}
                                InputProps={{
                                    inputProps: {
                                        step: 0.01,
                                        min: 0,
                                        max: 0.99,
                                    },
                                }}
                            />
                        </FormControl>
                    </Box>
                    <Box gap={1} sx={{ display: "flex", mb: 1 }}>
                        <FormControl data-tid="vx" fullWidth>
                            <TextField
                                label="Supercell dimension x"
                                variant="outlined"
                                size="small"
                                value={vx}
                                type="number"
                                onChange={(e) => {
                                    this.setState({ vx: parseFloat(e.target.value) });
                                }}
                                InputProps={{
                                    inputProps: {
                                        min: 1,
                                        step: 1,
                                    },
                                }}
                            />
                        </FormControl>
                        <FormControl data-tid="vy" fullWidth>
                            <TextField
                                label="Supercell dimension y"
                                variant="outlined"
                                size="small"
                                value={vy}
                                type="number"
                                onChange={(e) => {
                                    this.setState({ vy: parseFloat(e.target.value) });
                                }}
                                InputProps={{
                                    inputProps: {
                                        min: 1,
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

SurfaceDialog.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
};

export default SurfaceDialog;
