/* eslint-disable react/sort-comp */
import { Made } from "@exabyte-io/made.js";
import ExpandMoreIcon from "material-ui-icons-next/ExpandMore";
import setClass from "classnames";
import ExpansionPanel, {
    ExpansionPanelDetails,
    ExpansionPanelSummary,
} from "material-ui-next/ExpansionPanel";
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
        };

        this.handleBasisTextChange = this.handleBasisTextChange.bind(this);
    }

    // eslint-disable-next-line no-unused-vars
    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        const { material } = this.props;
        if (material !== nextProps.material) {
            this.setState({ xyz: nextProps.material.getBasisAsXyz() });
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

    renderBasisUnitsLabel(unitsType = "crystal") {
        const { coordUnits } = this.state;
        const { material } = this.props;
        return (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
            <label
                className={setClass("btn btn-custom", {
                    active: coordUnits === unitsType,
                })}
                id="basis-units-crystal"
                onClick={() => {
                    this.setState({
                        coordUnits: unitsType,
                        xyz: this.getXYZInCoordUnits(material, unitsType),
                    });
                }}
            >
                {s.capitalize(unitsType)} Units
            </label>
        );
    }

    renderBasisUnitOptions() {
        return (
            <div
                className="bgm-dark basis-options btn-group btn-group-justified"
                data-toggle="buttons"
                id="basis-options"
            >
                {this.renderBasisUnitsLabel(Made.ATOMIC_COORD_UNITS.crystal)}
                {this.renderBasisUnitsLabel(Made.ATOMIC_COORD_UNITS.cartesian)}
            </div>
        );
    }

    renderBasisText() {
        const { xyz } = this.state;
        return <BasisText content={xyz} onChange={this.handleBasisTextChange} />;
    }

    render() {
        const { className } = this.props;
        return (
            <ExpansionPanel defaultExpanded className={setClass(className, "crystal-basis")}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    Crystal Basis
                </ExpansionPanelSummary>
                <ExpansionPanelDetails
                    style={{
                        display: "block",
                        height: "100%",
                    }}
                >
                    <div className="col-xs-12 p-0">{this.renderBasisUnitOptions()}</div>
                    <div className="col-xs-12 p-0">{this.renderBasisText()}</div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

BasisEditor.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    material: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
};

export default BasisEditor;
