import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import NPMsAlert from "react-s-alert";

interface Transformation {
    id: string;
    title: string;
    content: string;
}

interface TransformationSelectorProps {
    pythonCode: string;
    setPythonCode: (pythonCode: string) => void;
    url: string;
}

function TransformationSelector(props: TransformationSelectorProps) {
    const { pythonCode, setPythonCode, url } = props;

    const defaultTransformation = {
        id: "default",
        title: "Empty",
        content: '"""BLOCK: Main"""\n\n',
    };

    const [transformations, setTransformations] = useState<Transformation[]>([
        defaultTransformation,
    ]);
    const [selectedTransformation, setSelectedTransformation] = useState<Transformation | null>(
        pythonCode ? { ...defaultTransformation, content: pythonCode } : defaultTransformation,
    );
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
            setIsDataFetched(true);
        } catch (error) {
            NPMsAlert.error("Error fetching transformations");
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
