import PropTypes from "prop-types";
import React from "react";
import { Provider } from "react-redux";
import _ from "underscore";

class ReduxProvider extends React.Component {
    get parentProps() {
        // pass properties to container
        return _.omit(this.props, ["store", "container"]);
    }

    render() {
        return (
            <Provider store={this.props.store}>
                <this.props.container parentProps={this.parentProps} />
            </Provider>
        );
    }
}

ReduxProvider.propTypes = {
    container: PropTypes.func.isRequired,
    store: PropTypes.object,
};

ReduxProvider.defaultProps = {
    // to prevent errors on using view-only MaterialContainer
    store: {},
};

export default ReduxProvider;
