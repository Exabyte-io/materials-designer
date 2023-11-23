import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React from "react";

interface TransformationSelectorProps {
    transformationParameters: any;
    setTransformationParameters: (transformationParameters: any) => void;
}

function TransformationSelector(props: TransformationSelectorProps) {
    return (
        <Autocomplete
            sx={{ flexGrow: 1, minWidth: 300 }}
            size="medium"
            value={transformationsMap[transformationParameters.transformationKey]}
            getOptionLabel={(option) => option.name}
            options={Object.values(transformationsMap)}
            onChange={this.handleTransformationParametersChange}
            renderInput={(params) => (
                <TextField
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...params}
                    label="Transformation"
                    placeholder="Select transformation"
                />
            )}
        />
    );
}

export default TransformationSelector;
