/* eslint-disable react/sort-comp */
import CheckIcon from "material-ui-icons-next/Check";
import DeleteIcon from "material-ui-icons-next/Delete";
import DeviceHubIcon from "material-ui-icons-next/DeviceHub";
import WidgetsIcon from "material-ui-icons-next/Widgets";
import setClass from "classnames";
import { TextField } from "material-ui-next";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui-next/List";
import PropTypes from "prop-types";
import React from "react";
import _ from "underscore";

import { ShowIf } from "../../utils/react/showif";

class ItemsList extends React.Component {
    getStateConfig = (text, index) => {
        return {
            editedName: text,
            editedIndex: index,
        };
    };

    constructor(props) {
        super(props);
        this.state = this.getStateConfig(props.materials[props.index].name, -1);
        this.handleTextFieldUpdate = this.handleTextFieldUpdate.bind(this);
        this.onNameUpdate = _.debounce(props.onNameUpdate, 500);
        this.initControlsSwitchFromKeyboard = this.initControlsSwitchFromKeyboard.bind(this);
        this.addEventListeners = this.addEventListeners.bind(this);
        this.removeEventListeners = this.removeEventListeners.bind(this);
        this.addEventListeners();
    }

    initControlsSwitchFromKeyboard(event) {
        const { materials, index, onItemClick } = this.props;
        if (!event.shiftKey) return; // Shift key must be down

        const nextIndex = materials.length === 1 + index ? 0 : index + 1;
        const previousIndex = index === 0 ? materials.length - 1 : index - 1;

        switch (event.keyCode) {
            case 85: // U
                onItemClick(previousIndex); // Up => decreasing index, b/c of descending order
                break;
            case 68: // D
                onItemClick(nextIndex);
                break;
            default:
        }
    }

    addEventListeners() {
        window.addEventListener("keydown", this.initControlsSwitchFromKeyboard, false);
    }

    removeEventListeners() {
        window.removeEventListener("keydown", this.initControlsSwitchFromKeyboard, false);
    }

    // eslint-disable-next-line no-unused-vars
    componentWillReceiveProps(newProps, newContext) {
        const { index } = this.state;
        // needed to propagate updates to unit render from parent(s)
        if (index !== newProps.index) {
            this.setState({ index: newProps.index });
        }
    }

    componentWillUnmount() {
        this.removeEventListeners();
    }

    handleTextFieldUpdate(value, index) {
        const { editedName } = this.state;
        this.setState(
            {
                editedName: value,
                editedIndex: index,
            },
            () => editedName.trim() !== value.trim() && this.onNameUpdate(value, index),
        );
    }

    renderListItem(entity, index) {
        const { onItemClick, onRemove } = this.props;
        const { editedIndex, editedName } = this.state;
        const selectHandler = () => onItemClick(index);
        const isBeingEdited = editedIndex === index;
        return (
            <ListItem
                key={index}
                button
                dense
                className={setClass(
                    // eslint-disable-next-line react/destructuring-assignment
                    { active: this.props.index === index },
                    { updated: entity.isUpdated || isBeingEdited },
                )}
            >
                <ShowIf condition={Boolean(entity.id)}>
                    <ListItemIcon className="superscript-icon">
                        <CheckIcon />
                    </ListItemIcon>
                </ShowIf>

                <ListItemIcon onClick={selectHandler}>
                    {entity.isNonPeriodic ? <DeviceHubIcon /> : <WidgetsIcon />}
                </ListItemIcon>

                <ListItemText
                    onClick={selectHandler}
                    primary={
                        <TextField
                            className="m-0"
                            InputProps={{ disableUnderline: true }}
                            value={isBeingEdited ? editedName : entity.name}
                            onChange={(event) =>
                                this.handleTextFieldUpdate(event.target.value, index)
                            }
                            onBlur={(event) => this.handleTextFieldUpdate(event.target.value, null)}
                        />
                    }
                    secondary={
                        <span>
                            Formula: <b>{entity.formula}</b>
                        </span>
                    }
                />

                <ListItemIcon className="icon-button-delete" onClick={() => onRemove(index)}>
                    <DeleteIcon />
                </ListItemIcon>
            </ListItem>
        );
    }

    render() {
        const { className, materials } = this.props;
        return (
            <div className={setClass(className, "materials-designer-items-list")}>
                <List component="nav" dense>
                    {materials.map((m, i) => this.renderListItem(m, i))}
                </List>
            </div>
        );
    }
}

ItemsList.propTypes = {
    className: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    materials: PropTypes.array,
    index: PropTypes.number,
    onItemClick: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onNameUpdate: PropTypes.func,
};

ItemsList.defaultProps = {
    materials: [],
    index: 0,
    onNameUpdate: () => {},
};

export default ItemsList;
