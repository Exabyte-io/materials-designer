import CodeMirror from "@exabyte-io/cove.js/dist/other/codemirror";
import theme from "@exabyte-io/cove.js/dist/theme";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";

interface PythonCodeExecutionProps {
    pythonCode: string;
    pythonOutput: string;
}

const PythonCodeExecution = (props: PythonCodeExecutionProps) => {
    const { pythonOutput } = props;
    // eslint-disable-next-line react/destructuring-assignment
    const [pythonCode, setPythonCode] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    // Define the border color for the focused and unfocused states
    const borderFocused = `2px solid blue`; // Change as per your active color
    const borderUnfocused = `1px solid ${theme.palette.secondary.light}`;

    useEffect(() => {
        // eslint-disable-next-line react/destructuring-assignment
        setPythonCode(props.pythonCode);
    });

    return (
        <>
            <Box
                id="python-code-input"
                sx={{
                    border: isFocused ? borderFocused : borderUnfocused,
                }}
            >
                {/* @ts-ignore */}
                <CodeMirror
                    value={pythonCode}
                    onChange={(newContent: string) => setPythonCode(newContent)}
                    options={{
                        autoSave: true,
                        lineNumbers: true,
                    }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    theme="light"
                    language="python"
                />
            </Box>
            <Box id="python-output" mt={theme.spacing(1)}>
                {pythonOutput && (
                    // @ts-ignore
                    <CodeMirror
                        content={pythonOutput}
                        readOnly
                        options={{
                            lineNumbers: false,
                        }}
                        theme="light"
                        language="python"
                    />
                )}
            </Box>
        </>
    );
};

export default PythonCodeExecution;
