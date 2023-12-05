import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React from "react";

import CodeExecutionControls, { ExecutionStatus } from "./CodeExecutionControls";
import PythonCodeDisplay from "./PythonCodeDisplay";

export interface SectionState {
    name: string;
    executionStatus: ExecutionStatus;
    content: string;
    output: string;
}

interface ExecutionCellProps extends SectionState {
    handleRun: () => void;
    setPythonCode: (pythonCode: string) => void;
}

function ExecutionCell(props: ExecutionCellProps) {
    const { name, content, output, executionStatus, handleRun, setPythonCode } = props;
    return (
        <Accordion>
            <AccordionSummary>
                <Grid container>
                    <Grid item xs={10}>
                        <Typography>{name}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <CodeExecutionControls
                            executionStatus={executionStatus}
                            handleRun={handleRun}
                        />
                    </Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails>
                <PythonCodeDisplay
                    pythonCode={content}
                    pythonOutput={output}
                    setPythonCode={(newContent) => setPythonCode(newContent)}
                />
            </AccordionDetails>
        </Accordion>
    );
}

export default ExecutionCell;
