import { Made } from "@exabyte-io/made.js";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import setClass from "classnames";
import ExpansionPanel, {
    ExpansionPanelDetails,
    ExpansionPanelSummary,
} from "material-ui/ExpansionPanel";
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

    latticeTypeOptions() {
        return _.map(Made.LATTICE_TYPE_CONFIGS, (item) => {
            return {
                label: item.label,
                value: item.code,
            };
        });
    }

    latticeUnitOptions() {
        return _.map(Made.DEFAULT_LATTICE_UNITS.length, (value) => {
            return {
                label: value,
                value,
            };
        });
    }

    render() {
        return (
            <ExpansionPanel
                style={{ flexBasis: "100%" }}
                className={setClass(this.props.className, "crystal-lattice")}
            >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    Crystal Lattice
                </ExpansionPanelSummary>
                <ExpansionPanelDetails
                    style={{
                        display: "block",
                        height: "100%",
                    }}
                >
                    <LatticeConfigurationDialog
                        className="col-xs-12 p-0"
                        modalId="update-lattice"
                        unitOptions={this.latticeUnitOptions()}
                        typeOptions={this.latticeTypeOptions()}
                        show={this.state.showLatticeConfigurationDialog}
                        backdropColor="dark"
                        material={this.props.material}
                        onUpdate={this.props.onUpdate}
                        onHide={() => {
                            this.setState({ showLatticeConfigurationDialog: false });
                        }}
                        onSubmit={() => {
                            this.setState({ showLatticeConfigurationDialog: false });
                        }}
                    />
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }
}

Lattice.propTypes = {
    material: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
};

export default Lattice;
