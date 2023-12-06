import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import PyodideLoader from "@exabyte-io/cove.js/dist/other/pyodide";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React from "react";

import CodeExecutionControls, { ExecutionStatus } from "./CodeExecutionControls";
import ExecutionCell, { ExecutionCellState } from "./ExecutionCell";
import MaterialsSelector from "./MaterialsSelector";
import TransformationSelector from "./TransformationSelector";

interface PythonTransformationProps {
    // TODO: add type when made.js is moved to Typescript
    // @ts-ignore
    materials: any[];
    show: boolean;
    // @ts-ignore
    onSubmit: (newMaterials: any[]) => void;
    onHide: () => void;
}

interface PythonTransformationState {
    // @ts-ignore
    materials: any[];
    // @ts-ignore
    selectedMaterials: any[];
    // @ts-ignore
    newMaterials: any[];
    executionStatus: ExecutionStatus;
    // TODO: import type for Pyodide when they are available in Cove.js
    // @ts-ignore
    pyodide: any;
    pythonCode: string;
    executionCells: ExecutionCellState[];
}

interface PyodideDataMap {
    [key: string]: string | PyodideDataMap;
}

const CODE_DISPLAY_HEIGHT = "50vh";
const GITHUB_API_URL =
    "https://api.github.com/repos/Exabyte-io/api-examples/contents/other/python_transformations?ref=feature/SOF-7146";

class PythonTransformation extends React.Component<
    PythonTransformationProps,
    PythonTransformationState
> {
    constructor(props: PythonTransformationProps) {
        super(props);
        this.state = {
            materials: props.materials,
            selectedMaterials: [props.materials[0]],
            newMaterials: [],
            executionStatus: ExecutionStatus.Loading,
            pyodide: null,
            pythonCode: "",
            executionCells: [],
        };
    }

    componentDidUpdate(prevProps: PythonTransformationProps) {
        const { materials } = this.props;
        if (prevProps.materials !== materials) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ materials });
        }
    }

    onPyodideLoad = (pyodideInstance: any) => {
        this.setState({ pyodide: pyodideInstance, executionStatus: ExecutionStatus.Idle });
    };

    handleSubmit = async () => {
        const { onSubmit } = this.props;
        const { newMaterials } = this.state;

        onSubmit(newMaterials);
    };

    updateStateAtIndex = (stateArray: any[], index: number, newState: any) => {
        const newArray = [...stateArray];
        newArray[index] = { ...newArray[index], ...newState };
        this.setState({ executionCells: newArray });
    };

    executeSection = async (sectionIndex: number) => {
        const { pyodide, executionCells, materials } = this.state;
        this.updateStateAtIndex(executionCells, sectionIndex, {
            executionStatus: ExecutionStatus.Running,
            output: "",
        });

        const section = executionCells[sectionIndex];
        const { name, content } = section;

        // redirecting stdout for print and errors per https://pyodide.org/en/stable/usage/streams.html
        pyodide.setStdout({
            batched: (text: string) => {
                this.updateStateAtIndex(executionCells, sectionIndex, {
                    output: section.output + text,
                });
            },
        });

        // Designate a DOM element as the target for matplotlib plots supported by pyodide
        // as per https://github.com/pyodide/matplotlib-pyodide
        // @ts-ignore
        document.pyodideMplTarget = document.getElementById(`pyodide-plot-target-${name}`);

        const convertedData = pyodide.toPy({ data_in: { materials }, data_out: {} });

        let result;
        try {
            result = await pyodide.runPythonAsync(content, {
                globals: convertedData,
            });
            this.updateStateAtIndex(executionCells, sectionIndex, {
                executionStatus: ExecutionStatus.Ready,
            });
            // eslint-disable-next-line react/destructuring-assignment
            console.log(this.state.executionCells[sectionIndex].output);
        } catch (error: any) {
            this.setState({ executionStatus: ExecutionStatus.Error });
            this.updateStateAtIndex(executionCells, sectionIndex, {
                executionStatus: ExecutionStatus.Error,
                output: error.message + "\n",
            });
        }

        if (!result) return;

        console.log("RESULT:", result.toJs());
    };

    executeAllExecutionCells = async () => {
        // eslint-disable-next-line react/destructuring-assignment
        this.state.executionCells.forEach(async (section, index) => {
            await this.executeSection(index);
        });
    };

    handleTransformationChange = (newPythonCode: string) => {
        this.setState({ pythonCode: newPythonCode });
        this.parseAndSetExecutionCells(newPythonCode);
    };

    mapToObject(map: Map<string, any>): PyodideDataMap {
        const obj: PyodideDataMap = {};
        map.forEach((value, key) => {
            if (value instanceof Map) {
                obj[key] = this.mapToObject(value);
            } else {
                obj[key] = value;
            }
        });
        return obj;
    }

    parseAndSetExecutionCells(pythonCode: string) {
        const sectionRegex = /"""BLOCK: (.+?)"""\s([\s\S]+?)(?=("""BLOCK|$))/g;
        let match;
        const executionCellStates: ExecutionCellState[] = [];

        // eslint-disable-next-line no-cond-assign
        while ((match = sectionRegex.exec(pythonCode)) !== null) {
            executionCellStates.push({
                name: match[1],
                executionStatus: ExecutionStatus.Idle,
                content: match[2],
                output: "",
            });
        }

        this.setState({ executionCells: executionCellStates });
    }

    render() {
        const {
            pythonCode,
            materials,
            selectedMaterials,
            newMaterials,
            executionCells,
            executionStatus,
        } = this.state;
        const { show, onHide } = this.props;

        return (
            <Dialog
                id="python-transformation-dialog"
                open={show}
                onClose={onHide}
                fullWidth
                maxWidth="xl"
                onSubmit={this.handleSubmit}
                title="Python Transformation"
                isSubmitButtonDisabled={executionStatus !== "ready"}
            >
                <PyodideLoader onLoad={this.onPyodideLoad} triggerLoad={show} />
                <DialogContent sx={{ overflow: "hidden" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <TransformationSelector
                                pythonCode={pythonCode}
                                url={GITHUB_API_URL}
                                setPythonCode={(newPythonCode) =>
                                    this.handleTransformationChange(newPythonCode)
                                }
                            />
                        </Grid>
                        <Grid item xs={0} md={4} />
                        <Grid container item xs={12} md={8} alignItems="center" gap={1}>
                            <Grid item>
                                <Typography variant="body1" style={{ fontFamily: "monospace" }}>
                                    materials_in =
                                </Typography>
                            </Grid>
                            <Grid item xs>
                                <MaterialsSelector
                                    materials={materials}
                                    selectedMaterials={selectedMaterials}
                                    setSelectedMaterials={(newMaterials) =>
                                        this.setState({ selectedMaterials: newMaterials })
                                    }
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <CodeExecutionControls
                                buttonProps={{ title: "Run All", variant: "contained" }}
                                handleRun={this.executeAllExecutionCells}
                                executionStatus={executionStatus}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Paper
                                sx={{
                                    height: CODE_DISPLAY_HEIGHT,
                                    overflow: "scroll",
                                }}
                            >
                                {executionCells.map((section, index) => (
                                    <ExecutionCell
                                        key={section.name}
                                        name={section.name}
                                        content={section.content}
                                        output={section.output}
                                        executionStatus={section.executionStatus}
                                        handleRun={() => this.executeSection(index)}
                                        setPythonCode={(newContent) =>
                                            this.updateStateAtIndex(executionCells, index, {
                                                content: newContent,
                                            })
                                        }
                                        // The last cell will have the parameters that people will change most of the time
                                        // so it's expanded by default
                                        defaultExpanded={index === executionCells.length - 1}
                                    />
                                ))}
                            </Paper>
                        </Grid>
                        <Grid container item xs={12} alignItems="center" gap={1}>
                            <Grid item>
                                <Typography variant="body1" style={{ fontFamily: "monospace" }}>
                                    materials_out =
                                </Typography>
                            </Grid>
                            <Grid item xs>
                                <MaterialsSelector
                                    materials={newMaterials}
                                    selectedMaterials={newMaterials}
                                    setSelectedMaterials={(newMaterials) =>
                                        this.setState({ newMaterials })
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        );
    }
}

export default PythonTransformation;
