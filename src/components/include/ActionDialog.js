/* eslint-disable react/jsx-props-no-spreading */
import Button from "material-ui-next/Button";
import Dialog, { DialogActions, DialogContent, DialogTitle } from "material-ui-next/Dialog";
import PropTypes from "prop-types";
import React from "react";
import _ from "underscore";

const paperStyle = {
    position: "absolute",
    top: "20%",
};

export class ActionDialog extends React.Component {
    render() {
        const { show, children, onClose, onSubmit, title } = this.props;
        return (
            <Dialog
                open={show}
                transitionDuration={0}
                PaperProps={{ style: paperStyle }}
                {..._.omit(this.props, "title", "show", "onClose", "onSubmit")}
            >
                <DialogTitle>{this.title || title}</DialogTitle>

                <DialogContent>
                    {_.isFunction(this.renderContent) ? this.renderContent() : children}
                </DialogContent>

                <DialogActions>
                    <Button data-name="Cancel" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button data-name="Submit" onClick={this.onSubmit || onSubmit}>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

ActionDialog.propTypes = {
    title: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};
