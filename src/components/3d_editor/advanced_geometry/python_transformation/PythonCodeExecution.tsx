import IconByName from "@exabyte-io/cove.js/dist/mui/components/icon/IconByName";
import theme from "@exabyte-io/cove.js/dist/theme";
import CheckIcon from "@mui/icons-material/Check";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import React from "react";

interface PythonExecutionControlsProps {
    isLoading: boolean;
    isRunning: boolean;
    handleRun: () => void;
}

function PythonCodeExecution(props: PythonExecutionControlsProps) {
    const { isLoading, isRunning, handleRun } = props;

    const getStatusText = () => {
        if (isLoading) return "Loading...";
        if (isRunning) return "Running...";
        return "Ready";
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }} gap={1}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2">{getStatusText()}</Typography>
                {isLoading || isRunning ? (
                    <CircularProgress color="primary" size={theme.typography.button.fontSize} />
                ) : (
                    <CheckIcon color="success" />
                )}
            </Box>
            <Button
                className="run-button"
                variant="contained"
                size="small"
                color={isLoading ? "secondary" : "success"}
                onClick={handleRun}
                disabled={isLoading || isRunning}
            >
                <Typography variant="button">Run</Typography>
                <IconByName name="actions.execute" />
            </Button>
        </Box>
    );
}

export default PythonCodeExecution;
