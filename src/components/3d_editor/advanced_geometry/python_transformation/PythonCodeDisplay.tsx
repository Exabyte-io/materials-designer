import CodeMirror from "@exabyte-io/cove.js/dist/other/codemirror";
import theme from "@exabyte-io/cove.js/dist/theme";
import Box from "@mui/material/Box";
import React from "react";

interface PythonCodeDisplayProps {
    pythonCode: string;
    pythonOutput: string;
    setPythonCode: (pythonCode: string) => void;
}

const PythonCodeDisplay = (props: PythonCodeDisplayProps) => {
    const { pythonCode, pythonOutput, setPythonCode } = props;

    return (
        <>
            <Box
                id="python-code-input"
                sx={{
                    border: `1px solid ${theme.palette.secondary.light}`,
                }}
            >
                <CodeMirror
                    content={pythonCode}
                    updateContent={(newContent: string) => setPythonCode(newContent)}
                    options={{
                        lineNumbers: true,
                    }}
                    theme="light"
                    language="python"
                />
            </Box>
            <Box id="python-output" mt={theme.spacing(1)}>
                {pythonOutput && (
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

export default PythonCodeDisplay;
