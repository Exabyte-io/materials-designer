import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import React from "react";

import BasisEditor from "./Basis";
import LatticeEditor from "./Lattice";

// eslint-disable-next-line react/prefer-stateless-function
class SourceEditor extends React.Component {
    render() {
        const { material, onUpdate } = this.props;
        return (
            <Grid item xs={12} className="materials-designer-source-editor">
                <Grid item xs={12} mb={1}>
                    <LatticeEditor material={material} onUpdate={onUpdate} />
                </Grid>
                <Grid item xs={12}>
                    <BasisEditor material={material} onUpdate={onUpdate} />
                </Grid>
            </Grid>
        );
    }
}

SourceEditor.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    material: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
};

export default SourceEditor;
