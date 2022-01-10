import PropTypes from "prop-types";
import React from "react";

/**
 * @summary Unary condition which will render children depending on condition is either true or false.
 * This is used mostly for readability purposes.
 *
 * @property {boolean} condition The condition
 * @property {node} children Children element that are required for this component
 */
export class ShowIf extends React.Component {
    render() {
        return this.props.condition ? this.props.children : null;
    }
}

ShowIf.propTypes = {
    condition: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
};
