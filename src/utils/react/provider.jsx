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
        const { store } = this.props;
        return (
            <Provider store={store}>
                <this.props.container parentProps={this.parentProps} />
            </Provider>
        );
    }
}

ReduxProvider.propTypes = {
    // eslint-disable-next-line react/no-unused-prop-types
    container: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    store: PropTypes.object,
};

ReduxProvider.defaultProps = {
    // to prevent errors on using view-only MaterialContainer
    store: {},
};

export default ReduxProvider;
