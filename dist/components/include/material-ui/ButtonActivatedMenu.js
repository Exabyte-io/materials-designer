import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import PropTypes from "prop-types";
import React from "react";
import { randomAlphanumeric } from "../../../utils/str";
export class ButtonActivatedMenuMaterialUI extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = (event) => {
            const { isOpen } = this.state;
            this.setState({ isOpen: !isOpen, anchorEl: event.currentTarget });
        };
        this.handleClose = () => this.setState({ isOpen: false });
        this.state = {
            isOpen: props.isOpen,
            anchorEl: null,
        };
    }
    render() {
        const { isOpen, anchorEl } = this.state;
        const { title, id, children } = this.props;
        return (_jsxs(_Fragment, { children: [_jsx(Button, { className: isOpen ? "active" : "", disableRipple: true, size: "small", color: "inherit", onClick: this.handleClick, "data-name": title, children: title }), _jsx(Menu, { MenuListProps: { dense: true }, id: id, open: isOpen, anchorEl: anchorEl, className: "button-activated-menu", "data-name": title + "-menu", onClick: this.handleClose, children: children })] }));
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
