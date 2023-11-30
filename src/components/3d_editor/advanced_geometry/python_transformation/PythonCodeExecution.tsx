import IconByName from "@exabyte-io/cove.js/dist/mui/components/icon/IconByName";
import theme from "@exabyte-io/cove.js/dist/theme";
import CheckIcon from "@mui/icons-material/Check";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import React from "react";

interface PythonExecutionControlsProps {
    executionState: "loading" | "running" | "ready" | "error";
    handleRun: () => void;
}

function PythonCodeExecution(props: PythonExecutionControlsProps) {
    const { handleRun, executionState } = props;

    const statusTextMap = {
        loading: "Loading...",
        running: "Running...",
        ready: "Ready",
        error: "Error",
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }} gap={1}>
            <Box sx={{ display: "flex", alignItems: "center" }} gap={1}>
                <Typography variant="body2">{statusTextMap[executionState]}</Typography>
                {executionState === "loading" || executionState === "running" ? (
                    <CircularProgress color="primary" size={theme.typography.button.fontSize} />
                ) : null}
                {executionState === "ready" && <IconByName name="shapes.check" color="success" />}
                {executionState === "error" && (
                    <IconByName name="actions.cancel" color="error" />
                )}{" "}
            </Box>
            <Button
                className="run-button"
                variant="contained"
                size="small"
                color={
                    executionState === "loading" || executionState === "running"
                        ? "secondary"
                        : "success"
                }
                onClick={handleRun}
                disabled={executionState === "loading" || executionState === "running"}
            >
                <Typography variant="button">Run</Typography>
                <IconByName name="actions.execute" />
            </Button>
        </Box>
    );
}

export default PythonCodeExecution;
