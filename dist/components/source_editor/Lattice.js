import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Made } from "@mat3ra/made";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import React from "react";
import _ from "underscore";
import LatticeConfigurationDialog from "./LatticeConfigurationDialog";
class Lattice extends React.Component {
    constructor(props) {
        super(props);
        this.latticeTypeOptions = () => {
            return _.map(Made.LATTICE_TYPE_CONFIGS, (item) => {
                return {
                    label: item.label,
                    value: item.code,
                };
            });
        };
        this.latticeUnitOptions = () => {
            return _.map(Made.DEFAULT_LATTICE_UNITS.length, (value) => {
                return {
                    label: value,
                    value,
                };
            });
        };
        this.state = {
            showLatticeConfigurationDialog: false,
        };
    }
    componentDidUpdate() { }
    render() {
        const { material, onUpdate } = this.props;
        const { showLatticeConfigurationDialog } = this.state;
        return (_jsxs(Accordion, { className: "crystal-lattice", elevation: 2, children: [_jsx(AccordionSummary, { expandIcon: _jsx(ExpandMoreIcon, {}), children: _jsx(Typography, { children: "Crystal Lattice" }) }), _jsx(AccordionDetails, { children: _jsx(LatticeConfigurationDialog, { modalId: "update-lattice", unitOptions: this.latticeUnitOptions(), typeOptions: this.latticeTypeOptions(), show: showLatticeConfigurationDialog, backdropColor: "dark", material: material, onUpdate: onUpdate, onHide: () => {
                            this.setState({ showLatticeConfigurationDialog: false });
                        }, onSubmit: () => {
                            this.setState({ showLatticeConfigurationDialog: false });
                        } }) })] }));
    }
}
Lattice.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    material: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
};
export default Lattice;
