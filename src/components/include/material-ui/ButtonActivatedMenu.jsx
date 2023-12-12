import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import PropTypes from "prop-types";
import React from "react";

import { randomAlphanumeric } from "../../../utils/str";

export class ButtonActivatedMenuMaterialUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: props.isOpen,
            anchorEl: null,
        };
    }

    handleClick = (event) => {
        const { isOpen } = this.state;
        this.setState({ isOpen: !isOpen, anchorEl: event.currentTarget });
    };

    handleClose = () => this.setState({ isOpen: false });

    render() {
        const { isOpen, anchorEl } = this.state;
        const { title, id, children } = this.props;
        return (
            <>
                <Button
                    className={isOpen ? "active" : ""}
                    disableRipple
                    onClick={this.handleClick}
                    data-name={title}
                >
                    {title}
                </Button>
                <Menu
                    id={id}
                    open={isOpen}
                    anchorEl={anchorEl}
                    className="button-activated-menu"
                    data-name={title + "-menu"}
                    onClick={this.handleClose}
                >
                    {children}
                </Menu>
            </>
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
