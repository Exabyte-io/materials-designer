import IconByName from "@exabyte-io/cove.js/dist/mui/components/icon/IconByName";
import theme from "@exabyte-io/cove.js/dist/theme";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import React from "react";

export enum ExecutionStatus {
    Loading = "loading",
    Running = "running",
    Ready = "ready",
    Error = "error",
}

interface CodeExecutionControlsProps {
    executionStatus: ExecutionStatus;
    handleRun: () => void;
}

function CodeExecutionControls(props: CodeExecutionControlsProps) {
    const { handleRun, executionStatus } = props;

    const statusTextMap = {
        [ExecutionStatus.Loading]: "Loading...",
        [ExecutionStatus.Running]: "Running...",
        [ExecutionStatus.Ready]: "Ready",
        [ExecutionStatus.Error]: "Error",
    };

    const statusStyles = {
        [ExecutionStatus.Loading]: { color: "secondary", disabled: true },
        [ExecutionStatus.Running]: { color: "secondary", disabled: true },
        [ExecutionStatus.Ready]: { color: "success", disabled: false },
        [ExecutionStatus.Error]: { color: "error", disabled: false },
    };

    const statusIcons = {
        [ExecutionStatus.Loading]: (
            <CircularProgress color="primary" size={theme.typography.button.fontSize} />
        ),
        [ExecutionStatus.Running]: (
            <CircularProgress color="primary" size={theme.typography.button.fontSize} />
        ),
        [ExecutionStatus.Ready]: <IconByName name="shapes.check" color="success" />,
        [ExecutionStatus.Error]: <IconByName name="actions.cancel" color="error" />,
    };

    const { color, disabled } = statusStyles[executionStatus];

    return (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }} gap={1}>
            <Box sx={{ display: "flex", alignItems: "center" }} gap={1}>
                <Typography variant="body2">{statusTextMap[executionStatus]}</Typography>
                {statusIcons[executionStatus]}
            </Box>
            <Button
                className="run-button"
                variant="contained"
                size="small"
                // @ts-ignore
                color={color}
                onClick={handleRun}
                disabled={disabled}
            >
                <Typography variant="button">Run</Typography>
                <IconByName name="actions.execute" />
            </Button>
        </Box>
    );
}

export default CodeExecutionControls;
