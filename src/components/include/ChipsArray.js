import React from "react";
import PropTypes from "prop-types";
import {withStyles} from "material-ui-next/styles";
import Chip from "material-ui-next/Chip";
import Input, {InputLabel} from "material-ui-next/Input";
import {FormControl} from 'material-ui-next/Form';

const styles = theme => ({});

class ChipsArray extends React.Component {

    initState = (props = this.props) => this.state = {
        data: props.data,
        value: '',
    };

    constructor(props) {
        super(props);
        this.initState();
    }

    componentWillReceiveProps(newProps) {
        // reset the data in state without triggering re-render
        if (newProps.data !== this.props.data || newProps.data.length !== this.props.data.length) {
            this.initState(newProps);
        }
    }

    handleDelete = data => () => {
        const newData = [...this.state.data];
        const chipToDelete = newData.indexOf(newData);
        newData.splice(chipToDelete, 1);
        this.setState({data: newData});
        this.props.onDataUpdate(newData);
    };

    render() {
        const {classes} = this.props;

        return (
            <FormControl className={classes.root}>
                <InputLabel shrink disableAnimation>Tags</InputLabel>
                <Input
                    placeholder="Type and press enter..."
                    value={this.state.value}
                    data-name="chips-array"
                    onChange={event => this.setState({value: event.target.value})}
                    onKeyPress={event => {
                        if (event.key === "Enter") {
                            const newData = this.state.data.concat([event.target.value]);
                            this.setState({
                                value: '',
                                data: newData,
                            });
                            this.props.onDataUpdate(newData);
                            event.preventDefault();
                        }
                    }}
                />
                <div className="p-t-10 p-b-10">
                    {this.state.data.map((data, index) => {
                        return (
                            <Chip
                                key={index}
                                label={data}
                                onDelete={this.handleDelete(data)}
                                className="m-r-5 m-b-5"
                            />
                        );
                    })}
                </div>
            </FormControl>
        );
    }
}

ChipsArray.propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.array,
    onDataUpdate: PropTypes.func,
};

ChipsArray.defaultProps = {
    data: [],
    onDataUpdate: () => {},
};

export default withStyles(styles)(ChipsArray);
