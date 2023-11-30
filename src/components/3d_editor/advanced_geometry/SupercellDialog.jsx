import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import math from "mathjs";
import PropTypes from "prop-types";
import React from "react";

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
        const { message } = this.state;
        const { isOpen, onHide, modalId } = this.props;
        const matrix = this.getMatrix();

        return (
            <Dialog
                id={modalId}
                open={isOpen}
                title="Generate supercell with matrix `m_ij`"
                onClose={onHide}
                onSubmit={this.handleGenerateSupercell}
            >
                <Grid container spacing={2}>
                    {matrix.toArray().map((rowOfElements, i) => {
                        return rowOfElements.map((element, j) => {
                            const elementName = `m${i + 1}${j + 1}`;
                            return (
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={element}
                                        type="number"
                                        className={elementName}
                                        label={elementName}
                                        onChange={(e) => {
                                            this.setState({
                                                [elementName]: parseFloat(e.target.value),
                                            });
                                        }}
                                        InputProps={{
                                            inputProps: {
                                                step: 1,
                                            },
                                        }}
                                    />
                                </Grid>
                            );
                        });
                    })}
                </Grid>
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
    modalId: PropTypes.string.isRequired,
};

export default SupercellDialog;
