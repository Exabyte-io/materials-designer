import React from "react";
import _ from "underscore";
import setClass from "classnames";
import TextField from 'material-ui-next/TextField';
import CheckIcon from 'material-ui-icons-next/Check';
import DeleteIcon from 'material-ui-icons-next/Delete';
import WidgetsIcon from 'material-ui-icons-next/Widgets';
import List, {ListItem, ListItemIcon, ListItemText} from "material-ui-next/List";

import {ShowIf} from "../../utils/react/showif";

class ItemsList extends React.Component {

    getStateConfig = (text, index) => {
        return {
            editedName: text,
            editedIndex: index,
        }
    };

    constructor(props) {
        super(props);
        this.state = this.getStateConfig(this.props.materials[this.props.index].name, -1);
        this.handleTextFieldUpdate = this.handleTextFieldUpdate.bind(this);
        this.onNameUpdate = _.debounce(this.props.onNameUpdate, 500);
        this.initControlsSwitchFromKeyboard = this.initControlsSwitchFromKeyboard.bind(this);
        this.addEventListeners = this.addEventListeners.bind(this);
        this.removeEventListeners = this.removeEventListeners.bind(this);
        this.addEventListeners();
    }

    initControlsSwitchFromKeyboard(event) {

        if (!event.shiftKey) return;  // Shift key must be down

        const nextIndex = (this.props.materials.length === 1 + this.props.index) ? 0 : this.props.index + 1;
        const previousIndex = (this.props.index === 0) ? this.props.materials.length - 1 : this.props.index - 1;

        switch (event.keyCode) {
            case 85: // U
                this.props.onItemClick(previousIndex); // Up => decreasing index, b/c of descending order
                break;
            case 68: // D
                this.props.onItemClick(nextIndex);
                break;
            default:

        }
    }

    addEventListeners() {
        window.addEventListener('keydown', this.initControlsSwitchFromKeyboard, false);
    }

    removeEventListeners() {
        window.removeEventListener('keydown', this.initControlsSwitchFromKeyboard, false);
    }

    componentWillReceiveProps(newProps) {
        // needed to propagate updates to unit render from parent(s)
        if (this.state.index !== newProps.index) {
            this.setState({index: newProps.index});
        }
    }

    componentWillUnmount() {
        this.removeEventListeners();
    }

    handleTextFieldUpdate(value, index) {
        const oldEditedText = this.state.editedName;
        this.setState({
                editedName: value,
                editedIndex: index
            },
            () => (oldEditedText.trim() !== value.trim()) && this.onNameUpdate(value, index)
        );

    }

    renderListItem(entity, index) {
        const selectHandler = () => this.props.onItemClick(index);
        const isBeingEdited = (this.state.editedIndex === index);
        return (
            <ListItem key={index} button dense className={setClass(
                {"active": this.props.index === index},
                {"updated": entity.isUpdated || isBeingEdited}
            )}>

                <ShowIf condition={Boolean(entity.id)}>
                    <ListItemIcon className="superscript-icon">
                        <CheckIcon/>
                    </ListItemIcon>
                </ShowIf>

                <ListItemIcon onClick={selectHandler}>
                    <WidgetsIcon/>                
                </ListItemIcon>

                <ListItemText onClick={selectHandler}
                    primary={
                        <TextField
                            className="m-0"
                            InputProps={{disableUnderline: true}}
                            value={isBeingEdited ? this.state.editedName : entity.name}
                            onChange={(event) => this.handleTextFieldUpdate(event.target.value, index)}
                            onBlur={(event) => this.handleTextFieldUpdate(event.target.value, null)}
                        />
                    }
                    secondary={
                        <span>
                            Formula: <b>{entity.formula}</b>
                        </span>
                    }

                />

                <ListItemIcon className="icon-button-delete" onClick={() => this.props.onRemove(index)}>
                    <DeleteIcon/>
                </ListItemIcon>

            </ListItem>
        )
    }

    render() {
        return (
            <div className={setClass(this.props.className, "materials-designer-items-list")}>
                <List component="nav" dense={true}>
                    {this.props.materials.map((m, i) => this.renderListItem(m, i))}
                </List>
            </div>
        )
    }
}

ItemsList.propTypes = {
    materials: React.PropTypes.array,
    index: React.PropTypes.number,
    onItemClick: React.PropTypes.func,
    onRemove: React.PropTypes.func,
    onNameUpdate: React.PropTypes.func,
};

ItemsList.defaultProps = {
    materials: [],
    index: 0,
    onNameUpdate: () => {},
};

export default ItemsList;
