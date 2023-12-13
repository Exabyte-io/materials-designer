import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import NPMsAlert from "react-s-alert";

export interface Transformation {
    id: string;
    title: string;
    content: string;
}

interface TransformationSelectorProps {
    transformation: Transformation | null;
    pythonCode: string;
    setPythonCode: (pythonCode: string) => void;
    setTransformation: (transformation: Transformation | null) => void;
    url: string;
}

const emptyTransformation: Transformation = {
    id: "custom-transformation",
    title: "Custom Transformation",
    content: `"""Custom Transformation"""\n"""BLOCK: Main"""\nprint("Hello world!")\n`,
};

function TransformationSelector(props: TransformationSelectorProps) {
    const { transformation, setTransformation, setPythonCode, url } = props;
    const [transformations, setTransformations] = useState<Transformation[]>([]);
    const [isDataFetched, setIsDataFetched] = useState(false);

    const fetchTransformations = async () => {
        if (isDataFetched) return;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const pythonFiles = data.filter((file: { name: string }) => file.name.match(/.*\.py/));
            const transformationsData = await Promise.all(
                pythonFiles.map(async (file: any) => {
                    const rawResponse = await fetch(file.download_url);
                    const content = await rawResponse.text();
                    // Python code snippets will have a title in the first line
                    const titleMatch = content.match(/^"""\nTITLE: (.*?)\n/);
                    const title = titleMatch ? titleMatch[1] : "No title";
                    return {
                        id: file.name,
                        title,
                        content,
                    };
                }),
            );
            setTransformations((prevTransformations) => [
                ...prevTransformations,
                ...transformationsData,
                emptyTransformation,
            ]);
            if (!transformation) {
                setTransformation(transformationsData[0]);
                setPythonCode(transformationsData[0].content);
            }

            setIsDataFetched(true);
        } catch (error) {
            NPMsAlert.error("Error fetching transformations");
        }
    };

    useEffect(() => {
        fetchTransformations();
    }, []);

    return (
        <Autocomplete
            data-tid="transformation-selector"
            size="small"
            value={transformation}
            getOptionLabel={(option) => option.title}
            options={transformations}
            onChange={(event, newValue) => {
                if (newValue) {
                    setPythonCode(newValue.content); // Update Python code only when user selects a transformation
                    setTransformation(newValue); // Update transformation in parent component
                }
            }}
            renderInput={(params) => (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <TextField {...params} label="Transformation" placeholder="Select transformation" />
            )}
        />
    );
}

export default TransformationSelector;
