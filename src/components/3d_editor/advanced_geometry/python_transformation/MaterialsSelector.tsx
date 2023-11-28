import CheckBox from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlank from "@mui/icons-material/CheckBoxOutlineBlank";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import React, { useEffect } from "react";

interface MaterialsSelectorProps {
    // TODO: add type when made.js is moved to Typescript
    // @ts-ignore
    materials: any[];
    // @ts-ignore
    selectedMaterials: any[];
    // @ts-ignore
    setSelectedMaterials: (selectedMaterials: any[]) => void;
}

function MaterialsSelector(props: MaterialsSelectorProps) {
    const { materials, selectedMaterials, setSelectedMaterials } = props;

    useEffect(() => {
        const updatedSelectedMaterials = selectedMaterials.filter((selectedMaterial) =>
            materials.some((material) => material.name === selectedMaterial.name),
        );

        if (updatedSelectedMaterials.length !== selectedMaterials.length) {
            setSelectedMaterials(updatedSelectedMaterials);
        }
    }, [materials, selectedMaterials, setSelectedMaterials]);

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
        />
    );
}

export default MaterialsSelector;
