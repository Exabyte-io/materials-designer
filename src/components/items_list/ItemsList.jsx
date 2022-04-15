/* eslint-disable react/sort-comp */
import { List, ListItem, ListItemIcon, ListItemText, TextField } from "@material-ui/core";
import {
    Check as CheckIcon,
    Delete as DeleteIcon,
    DeviceHub as DeviceHubIcon,
    Widgets as WidgetsIcon,
} from "@material-ui/icons";
import setClass from "classnames";
import PropTypes from "prop-types";
import React from "react";

import { ShowIf } from "../../utils/react/showif";

class ItemsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.defaultState;
        this.focusListItem = this.focusListItem.bind(this);
        this.blurListItem = this.blurListItem.bind(this);
        this.initControlsSwitchFromKeyboard = this.initControlsSwitchFromKeyboard.bind(this);
        window.addEventListener("keydown", this.initControlsSwitchFromKeyboard, false);
    }

    get defaultState() {
        const { materials, index } = this.props;
        return {
            editedName: materials[index].name,
            editedIndex: index,
        };
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

    componentWillUnmount() {
        window.removeEventListener("keydown", this.initControlsSwitchFromKeyboard, false);
    }

    focusListItem(event, index) {
        this.setState({ editedIndex: index, editedName: event.target.value });
    }

    blurListItem() {
        const { onItemClick, onNameUpdate, index } = this.props;
        const { editedName, editedIndex } = this.state;
        onNameUpdate(editedName, editedIndex);
        onItemClick(index);
        this.setState({ editedName: null, editedIndex: null });
    }

    renderListItem(entity, index) {
        const { name, isUpdated, isNonPeriodic } = entity;
        const { onItemClick, onRemove } = this.props;
        const { editedIndex, editedName } = this.state;
        const isBeingEdited = editedIndex === index;
        return (
            <ListItem
                key={name + "-" + index}
                button
                dense
                onClick={() => onItemClick(index)}
                className={setClass(
                    { active: isBeingEdited },
                    { updated: isUpdated || isBeingEdited },
                )}
            >
                <ShowIf condition={Boolean(entity.id)}>
                    <ListItemIcon className="superscript-icon">
                        <CheckIcon />
                    </ListItemIcon>
                </ShowIf>

                <ListItemIcon>{isNonPeriodic ? <DeviceHubIcon /> : <WidgetsIcon />}</ListItemIcon>

                <ListItemText
                    primary={
                        <TextField
                            className="m-0"
                            InputProps={{ disableUnderline: true }}
                            onFocus={(e) => this.focusListItem(e, index)}
                            value={isBeingEdited ? editedName : entity.name}
                            onChange={(event) => this.setState({ editedName: event.target.value })}
                            onBlur={this.blurListItem}
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
    materials: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    onItemClick: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onNameUpdate: PropTypes.func.isRequired,
};

export default ItemsList;
