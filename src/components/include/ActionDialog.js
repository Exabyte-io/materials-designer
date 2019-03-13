import _ from "underscore";
import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui-next/Button';
import Dialog, {DialogActions, DialogContent, DialogTitle} from 'material-ui-next/Dialog';

const paperStyle = {
    position: "absolute",
    top: "20%"
};

export class ActionDialog extends React.Component {

    render() {
        return (
            <Dialog
                open={this.props.show}
                transitionDuration={0}
                PaperProps={{style: paperStyle}}
                {..._.omit(this.props, 'title', 'show', 'onClose', 'onSubmit')}
            >

                <DialogTitle>{this.title || this.props.title}</DialogTitle>

                <DialogContent>
                    {_.isFunction(this.renderContent) ? this.renderContent() : this.props.children}
                </DialogContent>

                <DialogActions>
                    <Button data-name="Cancel" onClick={this.props.onClose}>
                        Cancel
                    </Button>
                    <Button data-name="Submit" onClick={this.onSubmit || this.props.onSubmit}>
                        Ok
                    </Button>
                </DialogActions>

            </Dialog>
        );
    }
}

ActionDialog.propTypes = {
    title: PropTypes.string,
    show: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
};
