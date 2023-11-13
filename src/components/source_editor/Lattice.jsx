import { Made } from "@exabyte-io/made.js";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import PropTypes from "prop-types";
import React from "react";
import _ from "underscore";

import LatticeConfigurationDialog from "./LatticeConfigurationDialog";

class Lattice extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showLatticeConfigurationDialog: false,
        };
    }

    componentDidUpdate() {}

    latticeTypeOptions = () => {
        return _.map(Made.LATTICE_TYPE_CONFIGS, (item) => {
            return {
                label: item.label,
                value: item.code,
            };
        });
    };

    latticeUnitOptions = () => {
        return _.map(Made.DEFAULT_LATTICE_UNITS.length, (value) => {
            return {
                label: value,
                value,
            };
        });
    };

    render() {
        const { material, onUpdate } = this.props;
        const { showLatticeConfigurationDialog } = this.state;
        return (
            <Accordion sx={{ flexBasis: "100%", p: 0 }} className="crystal-lattice">
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>Crystal Lattice</AccordionSummary>
                <AccordionDetails
                    style={{
                        display: "block",
                        height: "100%",
                    }}
                >
                    <LatticeConfigurationDialog
                        modalId="update-lattice"
                        unitOptions={this.latticeUnitOptions()}
                        typeOptions={this.latticeTypeOptions()}
                        show={showLatticeConfigurationDialog}
                        backdropColor="dark"
                        material={material}
                        onUpdate={onUpdate}
                        onHide={() => {
                            this.setState({ showLatticeConfigurationDialog: false });
                        }}
                        onSubmit={() => {
                            this.setState({ showLatticeConfigurationDialog: false });
                        }}
                    />
                </AccordionDetails>
            </Accordion>
        );
    }
}

Lattice.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    material: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
};

export default Lattice;
