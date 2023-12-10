import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import IconByName from "@exabyte-io/cove.js/dist/mui/components/icon/IconByName";
import PyodideLoader from "@exabyte-io/cove.js/dist/other/pyodide";
import theme from "@exabyte-io/cove.js/dist/theme";
import { Made } from "@exabyte-io/made.js";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react";
import NPMsAlert from "react-s-alert";

import CodeExecutionControls, { ExecutionStatus } from "./CodeExecutionControls";
import ExecutionCell, { ExecutionCellState } from "./ExecutionCell";
import MaterialsSelector from "./MaterialsSelector";
import TransformationSelector, { Transformation } from "./TransformationSelector";

interface PythonTransformationProps {
    materials: Made.Material[];
    show: boolean;
    onSubmit: (newMaterials: Made.Material[]) => void;
    onHide: () => void;
}

interface PythonTransformationState {
    materials: Made.Material[];
    selectedMaterials: Made.Material[];
    newMaterials: Made.Material[];
    executionStatus: ExecutionStatus;
    // TODO: import type for Pyodide when they are available in Cove.js
    // @ts-ignore
    pyodide: any;
    transformation: Transformation | null;
    pythonCode: string;
    pythonOutput: string;
    executionCells: ExecutionCellState[];
}

interface PyodideDataMap {
    [key: string]: string | PyodideDataMap;
}

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
            transformation: null,
            pythonCode: "",
            pythonOutput: "",
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
        // redirecting stdout for print per https://pyodide.org/en/stable/usage/streams.html
        pyodideInstance.setStdout({
            batched: (text: string) => {
                this.setState((state) => ({
                    pythonOutput: state.pythonOutput + text + "\n",
                }));
            },
        });
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
        this.setState({ pythonOutput: "" });
        const { pyodide, executionCells, selectedMaterials } = this.state;
        this.updateStateAtIndex(executionCells, sectionIndex, {
            executionStatus: ExecutionStatus.Running,
        });

        const section = executionCells[sectionIndex];
        const { name, content } = section;

        // Designate a DOM element as the target for matplotlib plots supported by pyodide
        // as per https://github.com/pyodide/matplotlib-pyodide
        // @ts-ignore
        document.pyodideMplTarget = document.getElementById(`pyodide-plot-target-${name}`);

        const convertedData = pyodide.toPy({ materials_in: selectedMaterials });

        let result;
        try {
            result = await pyodide.runPythonAsync(content, {
                globals: convertedData,
            });
            const { pythonOutput } = this.state;
            this.updateStateAtIndex(executionCells, sectionIndex, {
                executionStatus: ExecutionStatus.Ready,
                output: pythonOutput,
            });
        } catch (error: any) {
            this.setState({ executionStatus: ExecutionStatus.Error });
            this.updateStateAtIndex(executionCells, sectionIndex, {
                executionStatus: ExecutionStatus.Error,
                output: error.message + "\n",
            });
        }

        if (!result) return;
        try {
            const materials = result.get("materials_out").toJs();
            if (Array.isArray(materials)) {
                const newMaterials = materials.map((m: any) => {
                    const material = this.mapToObject(m);
                    // material structure is returned in POSCAR format in python code
                    const config = Made.parsers.poscar.fromPoscar(material.poscar);
                    const newMaterial: Made.Material = new Made.Material(config);

                    return newMaterial;
                });
                this.setState({ newMaterials, executionStatus: ExecutionStatus.Ready });
            } else {
                throw new Error("Expected materials output, but none was found.");
            }
        } catch (error: any) {
            NPMsAlert.error(error.message);
        }
    };

    executeAllExecutionCells = async () => {
        const { executionCells } = this.state;
        // eslint-disable-next-line no-restricted-syntax
        for (const [index] of executionCells.entries()) {
            // eslint-disable-next-line no-await-in-loop
            await this.executeSection(index);
        }
    };

    handleTransformationChange = (newPythonCode: string) => {
        this.setState({ pythonCode: newPythonCode });
        this.parseAndSetExecutionCells(newPythonCode);
    };

    handleDownload = () => {
        const { transformation, executionCells } = this.state;

        // Create new python code from execution cells contents
        let newPythonCode = "";
        executionCells.forEach((section) => {
            const sectionHeader = `"""BLOCK: ${section.name}"""\n`;
            newPythonCode += sectionHeader + section.content;
        });

        const filename = `${transformation?.title}.py` || "python_transformation.py";
        const blob = new Blob([newPythonCode], { type: "text/plain;charset=utf-8" });
        const href = URL.createObjectURL(blob);

        // Create a link element, use it to download the file, then remove it
        const link = document.createElement("a");
        link.href = href;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Release the URL object
        URL.revokeObjectURL(href);
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
        let idx = 0;
        const executionCellStates: ExecutionCellState[] = [];

        // eslint-disable-next-line no-cond-assign
        while ((match = sectionRegex.exec(pythonCode)) !== null) {
            executionCellStates.push({
                // eslint-disable-next-line no-plusplus
                id: idx++,
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
                isSubmitButtonDisabled={executionStatus !== ExecutionStatus.Ready}
            >
                <PyodideLoader onLoad={this.onPyodideLoad} triggerLoad={show} />
                {/* TODO: move the full-height dialog with padding to cove */}
                {/* Note: the 220px below is the sum of dialog margin top/bottom + header/footer */}
                <DialogContent sx={{ height: "calc(100vh - 220px)" }}>
                    <Grid
                        container
                        spacing={2}
                        id="python-transformation-dialog-content"
                        sx={{ height: "100%" }}
                    >
                        <Grid item container xs={12} md={4} alignItems="center">
                            <Typography variant="subtitle1">Select Source Code</Typography>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <TransformationSelector
                                // eslint-disable-next-line react/destructuring-assignment
                                transformation={this.state.transformation}
                                setTransformation={(newTransformation) =>
                                    this.setState({ transformation: newTransformation })
                                }
                                pythonCode={pythonCode}
                                setPythonCode={(newPythonCode) =>
                                    this.handleTransformationChange(newPythonCode)
                                }
                            />
                        </Grid>
                        <Grid item container xs={12} md={4} alignItems="center">
                            <Typography variant="subtitle1">
                                Input Materials (<code>materials_in</code>)
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <MaterialsSelector
                                materials={materials}
                                selectedMaterials={selectedMaterials}
                                setSelectedMaterials={(newMaterials) =>
                                    this.setState({ selectedMaterials: newMaterials })
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" display="flex" justifyContent="flex-end">
                                <Button
                                    id="download-code-button"
                                    color="secondary"
                                    onClick={this.handleDownload}
                                >
                                    Download Code
                                    <IconByName name="actions.download" />
                                </Button>
                                <CodeExecutionControls
                                    buttonProps={{
                                        title: "Run All",
                                        variant: "contained",
                                        color: "primary",
                                    }}
                                    handleRun={this.executeAllExecutionCells}
                                    executionStatus={executionStatus}
                                />
                            </Stack>
                        </Grid>
                        {/*
                            in the height calculation below we use:
                            - DialogHeader: 64px
                            - DialogContent Header with two fields
                        */}
                        <Grid
                            pt={0}
                            item
                            xs={12}
                            id="execution-cells"
                            sx={{
                                height: "calc(100% - 165px)",
                                overflowY: "hidden",
                            }}
                        >
                            <Paper
                                sx={{
                                    background: `1px solid ${theme.palette.grey[600]}`,
                                    height: "100%",
                                    overflowY: "auto",
                                }}
                            >
                                <Grid container spacing={1} pt={0}>
                                    {executionCells.map((section, index) => (
                                        <Grid item xs={12}>
                                            <ExecutionCell
                                                id={section.id}
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
                                                clearPythonOutput={() =>
                                                    this.updateStateAtIndex(executionCells, index, {
                                                        output: "",
                                                    })
                                                }
                                                // The last cell will have the parameters that people will change most of the time
                                                // so it's expanded by default
                                                defaultExpanded={
                                                    index === executionCells.length - 1
                                                }
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item container xs={12} md={4} alignItems="center">
                            <Typography variant="subtitle1">
                                Output Materials (<code>materials_out</code>)
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <MaterialsSelector
                                materials={newMaterials}
                                selectedMaterials={newMaterials}
                                setSelectedMaterials={(newMaterials) =>
                                    this.setState({ newMaterials })
                                }
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        );
    }
}

export default PythonTransformation;
