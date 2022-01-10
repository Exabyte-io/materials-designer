import Button from "material-ui/Button";
import List from "material-ui/List";
import ClickAwayListener from "material-ui/utils/ClickAwayListener";
import PropTypes from "prop-types";
import React from "react";

import { ShowIf } from "../../../utils/react/showif";
import { randomAlphanumeric } from "../../../utils/str";

export class ButtonActivatedMenuMaterialUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: this.props.isOpen || false,
        };
    }

    handleClick = (event) => {
        this.setState({ isOpen: !this.state.isOpen });
    };

    handleClose = () => this.setState({ isOpen: false });

    render() {
        return (
            <ClickAwayListener onClickAway={this.handleClose}>
                <div>
                    <Button
                        className={this.state.isOpen ? "active" : ""}
                        disableRipple
                        onClick={this.handleClick}
                        aria-owns={this.state.anchorEl ? this.props.id : null}
                        aria-haspopup="true"
                        data-name={this.props.title}
                    >
                        {this.props.title}
                    </Button>
                    <ShowIf condition={Boolean(this.state.isOpen)}>
                        <List
                            id={this.props.id}
                            className="button-activated-menu"
                            data-name={this.props.title + "-menu"}
                            onClick={this.handleClose}
                        >
                            {this.props.children}
                        </List>
                    </ShowIf>
                </div>
            </ClickAwayListener>
        );
    }
}

ButtonActivatedMenuMaterialUI.propTypes = {
    title: PropTypes.string,
    id: PropTypes.string,
};

ButtonActivatedMenuMaterialUI.defaultProps = {
    id: randomAlphanumeric(10),
};
