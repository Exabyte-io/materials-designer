import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
/* eslint-disable react/sort-comp */
import { Made } from "@mat3ra/made";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Grid from "@mui/material/Grid";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import React from "react";
import s from "underscore.string";
import { theme } from "../../settings";
import BasisText from "./BasisText";
class BasisEditor extends React.Component {
    constructor(props) {
        super(props);
        this.getXYZInCoordUnits = (material, coordinateUnits) => {
            switch (coordinateUnits) {
                case Made.ATOMIC_COORD_UNITS.cartesian:
                    material.toCartesian();
                    break;
                case Made.ATOMIC_COORD_UNITS.crystal:
                    material.toCrystal();
                    break;
                default:
                    break;
            }
            return material.getBasisAsXyz();
        };
        this.renderBasisUnitsLabel = (unitsType = "crystal") => {
            return (_jsxs(ToggleButton, { value: unitsType, sx: {
                    fontSize: theme.typography.caption.fontSize,
                }, children: [s.capitalize(unitsType), " Units"] }));
        };
        this.state = {
            xyzContent: props.material.getBasisAsXyz(),
            coordinateUnits: Made.ATOMIC_COORD_UNITS.crystal,
            checks: props.material.getConsistencyChecks(),
        };
        this.handleBasisTextChange = this.handleBasisTextChange.bind(this);
    }
    // eslint-disable-next-line no-unused-vars
    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        const { material } = this.props;
        if (material !== nextProps.material) {
            this.setState({
                xyzContent: nextProps.material.getBasisAsXyz(),
                checks: nextProps.material.getConsistencyChecks(),
            });
        }
    }
    handleBasisTextChange(content) {
        // "clone" original material from props to assert state updates
        const { material, onUpdate } = this.props;
        const { coordinateUnits } = this.state;
        const newMaterial = material.clone();
        newMaterial.setBasis(content, "xyz", coordinateUnits);
        onUpdate(newMaterial);
    }
    render() {
        const { coordinateUnits, checks, xyzContent } = this.state;
        const { material } = this.props;
        return (_jsxs(Accordion, { defaultExpanded: true, className: "crystal-basis", elevation: 2, children: [_jsx(AccordionSummary, { expandIcon: _jsx(ExpandMoreIcon, {}), children: _jsx(Typography, { children: "Crystal Basis" }) }), _jsx(AccordionDetails, { children: _jsxs(Grid, { container: true, spacing: 0.125, id: "crystal-basis", children: [_jsx(Grid, { item: true, xs: 12, children: _jsxs(ToggleButtonGroup, { id: "basis-options", value: coordinateUnits, fullWidth: true, exclusive: true, size: "small", onChange: (e, unitsType) => {
                                        this.setState({
                                            coordinateUnits: unitsType,
                                            xyzContent: this.getXYZInCoordUnits(material, unitsType),
                                        });
                                    }, children: [this.renderBasisUnitsLabel(Made.ATOMIC_COORD_UNITS.crystal), this.renderBasisUnitsLabel(Made.ATOMIC_COORD_UNITS.cartesian)] }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(BasisText, { content: xyzContent, checks: checks, onChange: this.handleBasisTextChange }) })] }) })] }));
    }
}
BasisEditor.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    material: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
};
export default BasisEditor;
