import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import PyodideLoader from "@exabyte-io/cove.js/dist/other/pyodide";
// TODO: add types when made.js is moved to Typescript
// @ts-ignore
import { Made } from "@exabyte-io/made.js";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React from "react";
import NPMsAlert from "react-s-alert";

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

const CODE_DISPLAY_HEIGHT = "60vh";
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

    redirectPyodideStdout = (text: string, sectionIndex: number) => {
        const { executionCells } = this.state;
        const section = executionCells[sectionIndex];
        const { output } = section;
        section.output = output + text + "\n";
        this.setState((prevState) => ({
            executionCells: prevState.executionCells.map((s, i) => (i === sectionIndex ? s : s)),
        }));
    };

    prepareMaterialData = () => {
        const { selectedMaterials } = this.state;
        return selectedMaterials.map((material, id) => {
            const materialConfig = material.toJSON();
            const materialPoscar = material.getAsPOSCAR();
            return {
                id,
                material: materialConfig,
                poscar: materialPoscar,
                metadata: material.metadata,
            };
        });
    };

    runPythonCode = async (pythonCode: string, options: any) => {
        let result;

        try {
            const { pyodide } = this.state;
            result = await pyodide.runPythonAsync(pythonCode, options);
            this.setState({ executionStatus: ExecutionStatus.Idle });
            return result;
        } catch (error: any) {
            return {
                output: error.message + "\n",
                executionStatus: ExecutionStatus.Error,
            };
        }
    };

    // eslint-disable-next-line react/no-unused-class-component-methods
    handleRun = async () => {
        try {
            const { pyodide, pythonCode } = this.state;
            const materialsData = this.prepareMaterialData();
            const dataIn = { materials: materialsData };
            const convertedData = pyodide.toPy({ data_in: dataIn, data_out: {} });

            const result = await this.runPythonCode(pythonCode, { globals: convertedData });
            if (!result) return;

            const dataOut = result.toJs().get("data_out");
            const dataOutMap = this.mapToObject(dataOut);

            if (Array.isArray(dataOutMap.materials)) {
                const newMaterials = dataOutMap.materials.map((m: any) => {
                    const material = this.mapToObject(m);
                    const config = Made.parsers.poscar.fromPoscar(material.poscar);
                    const newMaterial = new Made.Material(config);
                    newMaterial.metadata = material.metadata;

                    return newMaterial;
                });
                this.setState({ newMaterials });
            } else {
                throw new Error("Expected materials output, but none was found.");
            }
        } catch (error: any) {
            NPMsAlert.error(error.message);
        }
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
        const { executionCells } = this.state;
        this.updateStateAtIndex(executionCells, sectionIndex, {
            executionStatus: ExecutionStatus.Running,
        });

        const { pyodide } = this.state;
        // redirecting stdout for print and errors per https://pyodide.org/en/stable/usage/streams.html
        pyodide.setStdout({
            batched: (text: string) => this.redirectPyodideStdout(text, sectionIndex),
        });
        // Designate a DOM element as the target for matplotlib, plotly or other plots supported by pyodide
        // as per https://github.com/pyodide/matplotlib-pyodide
        // @ts-ignore
        document.pyodideMplTarget = document.getElementById(
            `pyodide-plot-target-${executionCells[sectionIndex].name}`,
        );
        const section = executionCells[sectionIndex];
        const { name, content } = section;
        const dataIn = { materials: this.prepareMaterialData() };
        const convertedData = pyodide.toPy({ data_in: dataIn, data_out: {} });

        let result;
        try {
            const { pyodide } = this.state;
            result = await pyodide.runPythonAsync(content, {
                globals: convertedData,
            });
            this.updateStateAtIndex(executionCells, sectionIndex, {
                executionStatus: ExecutionStatus.Ready,
            });
        } catch (error: any) {
            this.setState({ executionStatus: ExecutionStatus.Error });
            this.updateStateAtIndex(executionCells, sectionIndex, {
                executionStatus: ExecutionStatus.Error,
                output: error.message + "\n",
            });
            return {
                output: error.message + "\n",
                executionStatus: ExecutionStatus.Error,
            };
        }

        if (!result) return;

        console.log(result.toJs());
    };

    executeAllExecutionCells = async () => {
        // Logic to sequentially execute all executionCells
        // eslint-disable-next-line react/destructuring-assignment
        this.state.executionCells.forEach(async (section, index) => {
            await this.executeSection(index);
        });
    };

    handleTransformationChange = (newPythonCode: string) => {
        this.setState({ pythonCode: newPythonCode });
        this.parseAndSetexecutionCells(newPythonCode);
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

    parseAndSetexecutionCells(pythonCode: string) {
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
                                            this.setState((prevState) => ({
                                                executionCells: prevState.executionCells.map(
                                                    (s, i) =>
                                                        i === index
                                                            ? { ...s, content: newContent }
                                                            : s,
                                                ),
                                            }))
                                        }
                                        // The last cell will have the parameters that people will change most of the time
                                        // so it's expanded by default
                                        defaultExpanded={index === executionCells.length - 1}
                                    />
                                ))}
                            </Paper>
                        </Grid>
                        <Grid container item xs={12} md={8} alignItems="center" gap={1}>
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
