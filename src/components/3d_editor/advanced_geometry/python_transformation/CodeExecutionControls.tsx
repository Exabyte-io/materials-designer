import IconByName from "@exabyte-io/cove.js/dist/mui/components/icon/IconByName";
import theme from "@exabyte-io/cove.js/dist/theme";
import Box from "@mui/material/Box";
import Button, { ButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import React from "react";

export enum ExecutionStatus {
    Idle = "idle",
    Loading = "loading",
    Running = "running",
    Ready = "ready",
    Error = "error",
}

interface CodeExecutionControlsProps {
    buttonProps?: ButtonProps;
    executionStatus: ExecutionStatus;
    handleRun: () => void;
}

function CodeExecutionControls(props: CodeExecutionControlsProps) {
    const {
        buttonProps = { title: "Run", variant: "outlined" },
        handleRun,
        executionStatus,
    } = props;

    const statusIndicator = {
        [ExecutionStatus.Idle]: null,
        [ExecutionStatus.Loading]: null,
        [ExecutionStatus.Running]: null,
        [ExecutionStatus.Ready]: (
            <>
                <Typography>Ready</Typography> <IconByName name="shapes.check" color="success" />
            </>
        ),
        [ExecutionStatus.Error]: (
            <>
                <Typography>Error</Typography>
                <IconByName name="actions.cancel" color="error" />
            </>
        ),
    };

    const buttonStatusStyles = {
        [ExecutionStatus.Idle]: {
            color: "success",
            disabled: false,
            indicator: <IconByName name="actions.execute" />,
        },
        [ExecutionStatus.Loading]: {
            color: "secondary",
            disabled: true,
            indicator: (
                <CircularProgress color="secondary" size={theme.typography.button.fontSize} />
            ),
        },
        [ExecutionStatus.Running]: {
            color: "success",
            disabled: true,
            indicator: <CircularProgress color="success" size={theme.typography.button.fontSize} />,
        },
        [ExecutionStatus.Ready]: {
            color: "success",
            disabled: false,
            indicator: <IconByName name="actions.execute" />,
        },
        [ExecutionStatus.Error]: {
            color: "success",
            disabled: false,
            indicator: <IconByName name="actions.execute" />,
        },
    };

    const { color, disabled, indicator } = buttonStatusStyles[executionStatus];

    return (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }} gap={1}>
            <Box sx={{ display: "flex", alignItems: "center" }} gap={1}>
                {statusIndicator[executionStatus]}
            </Box>
            <Button
                className="run-button"
                variant={buttonProps.variant}
                size="small"
                // @ts-ignore
                color={color}
                onClick={(event) => {
                    event.stopPropagation();
                    handleRun();
                }}
                disabled={disabled}
            >
                <Typography variant="button">{buttonProps.title}</Typography>
                {indicator}
            </Button>
        </Box>
    );
}

export default CodeExecutionControls;
