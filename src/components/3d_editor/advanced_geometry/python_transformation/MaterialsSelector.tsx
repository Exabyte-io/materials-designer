import CheckBox from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlank from "@mui/icons-material/CheckBoxOutlineBlank";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import React from "react";

interface MaterialsSelectorProps {
    materials: any[];
    selectedMaterials: any[];
    setSelectedMaterials: (selectedMaterials: any[]) => void;
}

function MaterialsSelector(props: MaterialsSelectorProps) {
    const { materials, selectedMaterials, setSelectedMaterials } = props;

    return (
        <Autocomplete
            multiple
            id="materials-autocomplete"
            size="small"
            options={materials}
            getOptionLabel={(option) => option.name}
            value={selectedMaterials}
            onChange={(event, newValue) => setSelectedMaterials(newValue)}
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
                    size="small"
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
            sx={{ "& .MuiAutocomplete-tag": { margin: "0 !important" } }}
        />
    );
}

export default MaterialsSelector;
