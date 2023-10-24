import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import List from "@mui/material/List";
import PropTypes from "prop-types";
import React from "react";

import { ShowIf } from "../../../utils/react/showif";
import { randomAlphanumeric } from "../../../utils/str";

export class ButtonActivatedMenuMaterialUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: props.isOpen,
        };
    }

    handleClick = () => {
        const { isOpen } = this.state;
        this.setState({ isOpen: !isOpen });
    };

    handleClose = () => {
        const { isOpen } = this.state;
        if (!isOpen) return;
        this.setState({ isOpen: false });
    };

    render() {
        const { isOpen, anchorEl } = this.state;
        const { title, id, children } = this.props;
        return (
            <ClickAwayListener onClickAway={this.handleClose}>
                <div>
                    <Button
                        className={isOpen ? "active" : ""}
                        disableRipple
                        onClick={this.handleClick}
                        aria-owns={anchorEl ? id : null}
                        aria-haspopup="true"
                        data-name={title}
                    >
                        {title}
                    </Button>
                    <ShowIf condition={Boolean(isOpen)}>
                        <List
                            id={id}
                            className="button-activated-menu"
                            data-name={title + "-menu"}
                            onClick={this.handleClose}
                        >
                            {children}
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
    isOpen: PropTypes.bool,
    children: PropTypes.node,
};

ButtonActivatedMenuMaterialUI.defaultProps = {
    id: randomAlphanumeric(10),
    isOpen: false,
    children: undefined,
    title: "",
};
