import React from 'react';
import Switch from 'material-ui-next/Switch';
import TextField from 'material-ui-next/TextField';
import {FormGroup, FormControl, FormControlLabel} from 'material-ui-next/Form';

import ChipsArray from "../include/ChipsArray";
import ActionDialog from "../include/ActionDialog";

class SaveActionDialog extends ActionDialog {

    constructor(props) {
        super(props);
        this.state = {
            tags: this.props.tags || [],
            useMultiple: false,
            isPublic: false,
            // specific to selecting new material(s)
            showSelectStateDialog: false,
        };
        this.title = "Save Items"
    }

    componentWillReceiveProps(newProps) {
        // reset the tags in state without triggering re-render
        this.state.tags = newProps.tags;
        this.state.isPublic = newProps.isPublic;
    }

    handleChangeSwitch = name => event => {
        this.setState({[name]: event.target.checked});
    };

    onSubmit = () => {
        this.props.onSubmit(
            this.state.tags,
            this.state.useMultiple,
            this.state.isPublic,
            this.props.entitySetClsInstance ? this.props.entitySetClsInstance.toJSONForInclusionInEntity() : {}
        );
        this.props.onClose();
    };

    renderContent() {
        return (
            <form>
                <ChipsArray
                    data={this.state.tags}
                    onDataUpdate={(tags) => this.setState({tags})}
                />
                <FormControl>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    color="primary"
                                    data-name="use-multiple"
                                    checked={this.state.useMultiple}
                                    onChange={this.handleChangeSwitch('useMultiple')}
                                />
                            }
                            label={this.state.useMultiple ? "Save all" : "Save current"}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    disabled={!this.props.isSetPublicVisible}
                                    data-name="is-public"
                                    color="primary"
                                    checked={this.state.isPublic}
                                    onChange={this.handleChangeSwitch('isPublic')}
                                />
                            }
                            label={this.state.isPublic ? "Public" : "Private"}
                        />
                    </FormGroup>
                </FormControl>
                <TextField
                    label="Save in Material Set"
                    placeholder="None selected"
                    helperText="Click input field to select"
                    margin="normal"
                    value={this.props.entitySetClsInstance && this.props.entitySetClsInstance.name}
                    onClick={this.props.onShowSelectStateDialog}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </form>
        );
    }
}

SaveActionDialog.propTypes = {
    onShowSelectStateDialog: React.PropTypes.func,
    entitySetClsInstance: React.PropTypes.object,
};

export default SaveActionDialog;
