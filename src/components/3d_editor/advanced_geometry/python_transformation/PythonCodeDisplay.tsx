import IconByName from "@exabyte-io/cove.js/dist/mui/components/icon/IconByName";
import CodeMirror from "@exabyte-io/cove.js/dist/other/codemirror";
import theme from "@exabyte-io/cove.js/dist/theme";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React from "react";

interface PythonCodeDisplayProps {
    name?: string;
    pythonCode: string;
    pythonOutput: string;
    setPythonCode: (pythonCode: string) => void;
    clearPythonOutput: () => void;
}

// Functionality to clear the output with a button
const clearOutput = (name: string) => {
    const output = document.getElementById(`python-output-${name}`);
    if (output) {
        output.innerHTML = "";
    }
    const plotTarget = document.getElementById(`pyodide-plot-target-${name}`);
    if (plotTarget) {
        plotTarget.innerHTML = "";
    }
};

const PythonCodeDisplay = (props: PythonCodeDisplayProps) => {
    const { name = "", pythonCode, pythonOutput, setPythonCode } = props;
    const { clearPythonOutput } = props;
    const handleClearOutput = () => {
        clearOutput(name);
        clearPythonOutput();
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Box
                    id={`python-code-input-${name}`}
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
                        theme="dark"
                        language="python"
                    />
                </Box>
            </Grid>
            {pythonOutput && (
                <Grid item xs={12}>
                    <Grid container justifyContent="flex-end">
                        <Button
                            color="error"
                            variant="outlined"
                            size="small"
                            onClick={handleClearOutput}
                        >
                            <Typography variant="button">Clear</Typography>
                            <IconByName name="actions.delete" />
                        </Button>
                    </Grid>
                    <Box id={`python-output-${name}`} mt={theme.spacing(1)}>
                        <CodeMirror
                            content={pythonOutput}
                            readOnly
                            options={{
                                lineNumbers: false,
                            }}
                            theme="dark"
                            language="python"
                        />
                    </Box>
                </Grid>
            )}
            <Grid item xs={12}>
                <Box id={`pyodide-plot-target-${name}`} />
            </Grid>
        </Grid>
    );
};

export default PythonCodeDisplay;
