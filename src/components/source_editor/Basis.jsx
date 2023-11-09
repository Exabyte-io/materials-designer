/* eslint-disable react/sort-comp */
import theme from "@exabyte-io/cove.js/dist/theme";
import { Made } from "@exabyte-io/made.js";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ToggleButton from "@mui/material/ToggleButton/";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import PropTypes from "prop-types";
import React from "react";
import s from "underscore.string";

import BasisText from "./BasisText";

class BasisEditor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            xyz: props.material.getBasisAsXyz(),
            coordUnits: Made.ATOMIC_COORD_UNITS.crystal,
            checks: props.material.getConsistencyChecks(),
        };

        this.handleBasisTextChange = this.handleBasisTextChange.bind(this);
    }

    // eslint-disable-next-line no-unused-vars
    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        const { material } = this.props;
        if (material !== nextProps.material) {
            this.setState({
                xyz: nextProps.material.getBasisAsXyz(),
                checks: nextProps.material.getConsistencyChecks(),
            });
        }
    }

    getXYZInCoordUnits = (material, coordUnits) => {
        switch (coordUnits) {
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

    handleBasisTextChange(content) {
        // "clone" original material from props to assert state updates
        const { material, onUpdate } = this.props;
        const { coordUnits } = this.state;
        const newMaterial = material.clone();
        newMaterial.setBasis(content, "xyz", coordUnits);
        onUpdate(newMaterial);
    }

    renderBasisUnitsLabel = (unitsType = "crystal") => {
        return (
            <ToggleButton
                value={unitsType}
                sx={{
                    fontSize: theme.typography.caption.fontSize,
                }}
            >
                {s.capitalize(unitsType)} Units
            </ToggleButton>
        );
    };

    renderBasisUnitOptions() {
        const { coordUnits } = this.state;
        const { material } = this.props;

        return (
            <ToggleButtonGroup
                id="basis-options"
                value={coordUnits}
                fullWidth
                exclusive
                onChange={(e, unitsType) => {
                    this.setState({
                        coordUnits: unitsType,
                        xyz: this.getXYZInCoordUnits(material, unitsType),
                    });
                }}
            >
                {this.renderBasisUnitsLabel(Made.ATOMIC_COORD_UNITS.crystal)}
                {this.renderBasisUnitsLabel(Made.ATOMIC_COORD_UNITS.cartesian)}
            </ToggleButtonGroup>
        );
    }

    renderBasisText() {
        const { xyz, checks } = this.state;
        return <BasisText content={xyz} checks={checks} onChange={this.handleBasisTextChange} />;
    }

    render() {
        return (
            <Accordion defaultExpanded className="crystal-basis">
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>Crystal Basis</AccordionSummary>
                <AccordionDetails
                    style={{
                        display: "block",
                        height: "100%",
                    }}
                >
                    <div>{this.renderBasisUnitOptions()}</div>
                    <div>{this.renderBasisText()}</div>
                </AccordionDetails>
            </Accordion>
        );
    }
}

BasisEditor.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    material: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
};

export default BasisEditor;
