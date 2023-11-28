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

    // Define the empty transformation
    const emptyTransformation = {
        id: "empty",
        title: "Empty",
        content: "",
    };

    // Initialize transformations with the empty transformation
    const [transformations, setTransformations] = useState<Transformation[]>([emptyTransformation]);
    const [selectedTransformation, setSelectedTransformation] = useState<Transformation | null>(
        emptyTransformation,
    );

    const fetchTransformations = async () => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            const pythonFiles = data.filter((file: { name: string }) => file.name.endsWith(".py"));
            const transformationsData = await Promise.all(
                pythonFiles.map(async (file: any) => {
                    const rawResponse = await fetch(file.download_url);
                    const content = await rawResponse.text();
                    const titleMatch = content.match(/^"""(.*?)"""/);
                    const title = titleMatch ? titleMatch[1] : "No title";
                    return {
                        id: file.name,
                        title,
                        content,
                    };
                }),
            );
            // Append fetched transformations to the existing list
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
