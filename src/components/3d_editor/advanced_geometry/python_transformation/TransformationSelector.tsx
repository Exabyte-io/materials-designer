import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";

interface Transformation {
    id: string;
    title: string;
    content: string;
}

interface TransformationSelectorProps {
    setPythonCode: (pythonCode: string) => void;
    url: string;
}

function TransformationSelector(props: TransformationSelectorProps) {
    const { setPythonCode, url } = props;

    const defaultTransformation = {
        id: "default",
        title: "Empty",
        content: "",
    };

    const [transformations, setTransformations] = useState<Transformation[]>([
        defaultTransformation,
    ]);
    const [selectedTransformation, setSelectedTransformation] = useState<Transformation | null>(
        defaultTransformation,
    );

    const fetchTransformations = async () => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            const pythonFiles = data.filter((file: { name: string }) => file.name.match(/.*\.py/));
            const transformationsData = await Promise.all(
                pythonFiles.map(async (file: any) => {
                    const rawResponse = await fetch(file.download_url);
                    const content = await rawResponse.text();
                    // Python code snippets will have a title in the first line
                    const titleMatch = content.match(/^"""(.*?)"""/);
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
            ]);
        } catch (error) {
            console.error("Error fetching transformations:", error);
        }
    };

    useEffect(() => {
        fetchTransformations();
    }, []);

    useEffect(() => {
        if (selectedTransformation) setPythonCode(selectedTransformation.content);
    }, [selectedTransformation]);

    return (
        <Autocomplete
            size="small"
            value={selectedTransformation}
            getOptionLabel={(option) => option.title}
            options={transformations}
            onChange={(event, newValue) => {
                setSelectedTransformation(newValue);
            }}
            renderInput={(params) => (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <TextField {...params} label="Transformation" placeholder="Select transformation" />
            )}
        />
    );
}

export default TransformationSelector;
