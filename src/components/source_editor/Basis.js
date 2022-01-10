import { Made } from "@exabyte-io/made.js";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import setClass from "classnames";
import ExpansionPanel, {
    ExpansionPanelDetails,
    ExpansionPanelSummary,
} from "material-ui/ExpansionPanel";
import PropTypes from "prop-types";
import React from "react";
import s from "underscore.string";

import BasisText from "./BasisText";

class Basis extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            xyz: this.props.material.getBasisAsXyz(),
            manualEditStarted: false,
            showBasisOptions: false,
            coordUnits: Made.ATOMIC_COORD_UNITS.crystal,
        };

        this.handleBasisTextChange = this.handleBasisTextChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.material !== nextProps.material) {
            this.setState({ xyz: nextProps.material.getBasisAsXyz() });
        }
    }

    getXYZInCoordUnits(material, coordUnits) {
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
    }

    handleBasisTextChange(content) {
        // "clone" original material from props to assert state updates
        const material = this.props.material.clone();
        material.setBasis(content, "xyz", this.state.coordUnits);
        this.props.onUpdate(material);
    }

    renderBasisUnitsLabel(unitsType = "crystal") {
        return (
            <label
                className={setClass("btn btn-custom", {
                    active: this.state.coordUnits === unitsType,
                })}
                id="basis-units-crystal"
                onClick={() => {
                    this.setState({
                        coordUnits: unitsType,
                        xyz: this.getXYZInCoordUnits(this.props.material, unitsType),
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
        return <BasisText content={this.state.xyz} onChange={this.handleBasisTextChange} />;
    }

    render() {
        return (
            <ExpansionPanel
                defaultExpanded
                className={setClass(this.props.className, "crystal-basis")}
            >
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

Basis.propTypes = {
    material: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
};

export default Basis;
