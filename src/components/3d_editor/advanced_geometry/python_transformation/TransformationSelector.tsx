import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useEffect } from "react";

interface Transformation {
    key: string;
    name: string;
    content: string;
}

interface TransformationSelectorProps {
    setPythonCode: (pythonCode: string) => void;
}

const transformations: Transformation[] = [
    {
        key: "default",
        name: "Default",
        content: `print("Hello World!")\n`,
    },
];

function TransformationSelector(props: TransformationSelectorProps) {
    const { setPythonCode } = props;
    const [selectedTransformation, setSelectedTransformation] = React.useState<Transformation>(
        transformations[0],
    );

    useEffect(() => {
        setPythonCode(selectedTransformation.content);
    }, [selectedTransformation, setPythonCode]);

    return (
        <Autocomplete
            sx={{ flexGrow: 1, minWidth: 300 }}
            size="medium"
            value={selectedTransformation}
            getOptionLabel={(option) => option.name}
            options={transformations}
            onChange={(event, newValue) => {
                if (newValue) {
                    setSelectedTransformation(newValue);
                }
            }}
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
