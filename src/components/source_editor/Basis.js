import $ from "jquery";
import React from 'react';
import {Made} from "made.js";
import setClass from 'classnames';
import ExpandMoreIcon from 'material-ui-icons-next/ExpandMore';
import ExpansionPanel, {ExpansionPanelSummary, ExpansionPanelDetails,} from 'material-ui-next/ExpansionPanel';

import {displayMessage} from "../../utils/messages";

class Basis extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            validated: true,
            message: '',
            manualEditStarted: false,
            showBasisOptions: false,
            coordUnits: Made.ATOMIC_COORD_UNITS.crystal
        };

        this.handleToggleCrystalBasis = this.handleToggleCrystalBasis.bind(this);
        this.handleBasisUnits = this.handleBasisUnits.bind(this);
        this.handleMaterialTextareaChange = this.handleMaterialTextareaChange.bind(this);
    }

    componentDidUpdate() {
        let material = this.props.material;

        switch (this.state.coordUnits) {
            case Made.ATOMIC_COORD_UNITS.cartesian:
                material.toCartesian();
                break;
            case Made.ATOMIC_COORD_UNITS.crystal:
                material.toCrystal();
                break;
        }
        this.reformatXYZText();
    }

    reformatXYZText = () => {
        const materialXYZ = this.props.material.getBasisAsXyz();
        // Change state only if user is not editing basis
        if (!this.state.manualEditStarted && this.state.xyz !== materialXYZ) {
            this.setState({
                xyz: materialXYZ
            })
        }
    }

    handleMaterialTextareaChange(e) {
        const value = $(e.target).val();

        this.setState({
            xyz: value
        }, () => {
            if (this._validateXYZ(value)) {
                // "clone" original material from props to assert state updates
                const material = this.props.material.clone();
                material.setBasis(value, 'xyz', this.state.coordUnits);
                this.props.onUpdate(material);
            }
        });
    }

    handleToggleCrystalBasis(e) {
        $(e.target).toggleClass("active");
        $(this.basisOptions).toggle();
        $(this.basisOptionCloseBtn).toggleClass("active");
        this.setState({
            showBasisOptions: !this.state.showBasisOptions
        });
    }

    handleBasisUnits(e) {
        let unitType = $(e.target).find('input').val();
        this.setState({coordUnits: unitType});
    }

    componentDidMount() {
        this.setState({
            xyz: this.props.material.getBasisAsXyz()
        });
    }

    _validateXYZ(value) {
        try {
            Made.parsers.xyz.validate(value);
            // only show the success message first time after last failure
            if (!this.state.validated) {
                this.setState({
                    validated: true,
                    message: displayMessage('materialsDesigner.basisValidationSuccess')
                });
            } else {
                // already validated before -> remove message
                this.setState({message: ''});
            }
        } catch (err) {
            this.setState({
                validated: false,
                message: displayMessage('materialsDesigner.basisValidationError')
            });
            return false;
        }
        return true;
    }

    // recalculate padding for the .xyz class to keep room for "advanced-geometry" button
    recalculatePaddingBottom() {
        let padding;
//        padding = this.state.showBasisOptions ? 200 : 150;
        padding = this.state.showBasisOptions ? 150 : 100;
        if (this.state.message) {
            padding += 25;
        }
        return `${padding}px`
    }

    renderBasisUnitOptions() {
        return (
            <div className="bgm-dark basis-options btn-group btn-group-justified"
                data-toggle="buttons"
                id="basis-options"
                ref={(e) => {
                    this.basisOptions = e;
                }}>
                <label className={setClass("btn btn-custom rotate active")}
                    id="basis-units-crystal"
                    onClick={this.handleBasisUnits}>
                    <input type="radio"
                        name="basis.units"
                        autoComplete="off"
                        defaultValue="crystal"
                        defaultChecked="checked"/> Crystal Units
                </label>
                <label
                    className={setClass("btn btn-custom")}
                    id="basis-units-cartesian"
                    onClick={this.handleBasisUnits}>
                    <input type="radio"
                        name="basis.units"
                        autoComplete="off"
                        defaultValue="cartesian"/> Cartesian Units
                </label>
            </div>
        )
    }

    renderBasisTextare() {
        return (
            <div className="xyz"
                style={{
                    height: '100%',
                }}>
                <div style={{height: '100%'}}>
                            <textarea name="basis-xyz"
                                className={setClass("material-textarea form-control fg-input")}
                                required=""
                                onFocus={() => {
                                    this.setState({manualEditStarted: true});
                                }}
                                onBlur={(e) => {
                                    this.setState({manualEditStarted: false});
                                    this.reformatXYZText();
                                }}
                                value={this.state.xyz}
                                onChange={this.handleMaterialTextareaChange}
                            />
                    <pre id="basis-xyz-hidden" className="hidden">{this.props.material.getBasisAsXyz()}</pre>
                    <div className="col-xs-12 p-5 text-center">
                        <span className={this.state.validated ? "text-success" : "text-danger"}>
                            {this.state.message}&nbsp;
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <ExpansionPanel defaultExpanded
                className={setClass(this.props.className, "crystal-basis")}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                    Crystal Basis
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{
                    display: 'block',
                    height: '100%'
                }}>
                    <div className="col-xs-12 p-0">{this.renderBasisUnitOptions()}</div>
                    <div className="col-xs-12 p-0">{this.renderBasisTextare()}</div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}

Basis.propTypes = {
    material: React.PropTypes.object.isRequired,
    onUpdate: React.PropTypes.func.isRequired
};

export default Basis;
