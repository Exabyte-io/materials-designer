import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { Checkbox, Chip } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React from "react";

function MaterialsSelector(props) {
    const { materials, selectedMaterials } = props;

    return (
        <Autocomplete
            sx={{
                flexGrow: 1,
                minWidth: 300,
                p: 0,
            }}
            multiple
            id="materials-autocomplete"
            size="small"
            options={materials}
            getOptionLabel={(option) => option.name}
            value={selectedMaterials}
            onChange={(event, newValue) => this.setState({ selectedMaterials: newValue })}
            renderOption={(props, option, { selected }) => (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <li {...props}>
                    <Checkbox
                        icon={<CheckBoxOutlineBlank fontSize="small" />}
                        checkedIcon={<CheckBox fontSize="small" />}
                        checked={selected}
                    />
                    {option.name}
                </li>
            )}
            renderInput={(params) => (
                <TextField
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...params}
                    label="Selected Materials"
                    placeholder="Select materials"
                />
            )}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip
                        size="small"
                        label={`${index}: ${option.name}`}
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        {...getTagProps({ index })}
                    />
                ))
            }
        />
    );
}

export default MaterialsSelector;
