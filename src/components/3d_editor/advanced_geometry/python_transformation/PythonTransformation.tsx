import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import PyodideLoader from "@exabyte-io/cove.js/dist/other/pyodide";
// TODO: add types when made.js is moved to Typescript
// @ts-ignore
import { Made } from "@exabyte-io/made.js";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React from "react";
import NPMsAlert from "react-s-alert";

import CodeExecutionControls, { ExecutionStatus } from "./CodeExecutionControls";
import ExecutionCell from "./ExecutionCell";
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
    pythonOutput: string;
}

interface PyodideDataMap {
    [key: string]: string | PyodideDataMap;
}

const CODE_DISPLAY_HEIGHT = "60vh";
const GITHUB_API_URL =
    "https://api.github.com/repos/Exabyte-io/api-examples/contents/other/python_transformations?ref=feature/SOF-7058";

const PYTHON_CODE_EXAMPLE = `
"""BLOCK: Package Imports"""
import micropip
await micropip.install("ase")
import ase

"""BLOCK: Function Definitions"""
materials_in = globals()["data_in"]["materials"]

def transformation(material):
    """Transformation"""
    return material
    
"""BLOCK: Main"""
def main():
    materials_out = []
    for material in materials_in:
        materials_out.append(transformation(material))
    return {"materials": materials_out} 
`;

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
            pythonOutput: "",
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
        this.setState(
            { pyodide: pyodideInstance, executionStatus: ExecutionStatus.Ready },
            async () => {
                // redirecting stdout for print and errors per https://pyodide.org/en/stable/usage/streams.html
                pyodideInstance.setStdout({
                    batched: (text: string) => this.redirectPyodideStdout(text),
                });
                // Designate a DOM element as the target for matplotlib, plotly or other plots supported by pyodide
                // as per https://github.com/pyodide/matplotlib-pyodide
                // @ts-ignore
                document.pyodideMplTarget = document.getElementById("pyodide-plot-target");
            },
        );
    };

    redirectPyodideStdout = (text: string) => {
        this.setState((prevState) => ({
            pythonOutput: prevState.pythonOutput + text + "\n",
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

    runPythonCode = async (options: any) => {
        this.setState({ pythonOutput: "", executionStatus: ExecutionStatus.Running });
        let result;

        try {
            const { pyodide, pythonCode } = this.state;
            result = await pyodide.runPythonAsync(pythonCode, options);
            this.setState({ executionStatus: ExecutionStatus.Ready });
            return result;
        } catch (error: any) {
            this.setState({
                pythonOutput: error.message + "\n",
                executionStatus: ExecutionStatus.Error,
            });
        }
    };

    handleRun = async () => {
        try {
            const { pyodide } = this.state;
            const materialsData = this.prepareMaterialData();
            const dataIn = { materials: materialsData };
            const convertedData = pyodide.toPy({ data_in: dataIn, data_out: {} });

            const result = await this.runPythonCode({ globals: convertedData });
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

    render() {
        const { pythonCode, pythonOutput, materials, selectedMaterials } = this.state;
        const { show, onHide } = this.props;

        const { executionStatus } = this.state;
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
                        <Grid container item xs={12} alignItems="center" gap={1}>
                            <Grid item>
                                <Typography variant="body2" style={{ fontFamily: "monospace" }}>
                                    materials_in=
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
                        <Grid item xs={12} sm={8}>
                            <TransformationSelector
                                pythonCode={pythonCode}
                                url={GITHUB_API_URL}
                                setPythonCode={(newPythonCode) =>
                                    this.setState({ pythonCode: newPythonCode })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <CodeExecutionControls
                                handleRun={this.handleRun}
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
                                <ExecutionCell
                                    name="Main"
                                    content={pythonCode}
                                    output={pythonOutput}
                                    executionStatus={executionStatus}
                                    handleRun={this.handleRun}
                                    setPythonCode={(newContent) =>
                                        this.setState({ pythonCode: newContent })
                                    }
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        );
    }
}

export default PythonTransformation;
