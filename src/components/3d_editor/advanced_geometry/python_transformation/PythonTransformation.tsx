import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import PyodideLoader from "@exabyte-io/cove.js/dist/other/pyodide";
import theme from "@exabyte-io/cove.js/dist/theme";
// TODO: add types when made.js is moved to Typescript
// @ts-ignore
import { Made } from "@exabyte-io/made.js";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import React from "react";
import NPMsAlert from "react-s-alert";

import MaterialsSelector from "./MaterialsSelector";
import PythonCodeDisplay from "./PythonCodeDisplay";
import PythonCodeExecution from "./PythonCodeExecution";
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
    isLoading: boolean;
    isRunning: boolean;
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
            isLoading: true,
            isRunning: false,
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
        this.setState({ pyodide: pyodideInstance, isLoading: false }, async () => {
            // redirecting stdout for print and errors per https://pyodide.org/en/stable/usage/streams.html
            pyodideInstance.setStdout({
                batched: (text: string) => this.redirectPyodideStdout(text),
            });
        });
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

    runPythonCode = async () => {
        this.setState({ pythonOutput: "" });
        let result;

        try {
            const { pyodide, pythonCode } = this.state;
            result = await pyodide.runPythonAsync(pythonCode);
            if (result) return result;
        } catch (error: any) {
            this.setState({ pythonOutput: error.message });
        }
    };

    handleRun = async () => {
        this.setState({ isRunning: true });
        try {
            await this.runPythonCode();
        } catch (error: any) {
            NPMsAlert.error(error.message);
        } finally {
            this.setState({ isRunning: false });
        }
    };

    handleSubmit = async () => {
        const { onSubmit } = this.props;
        const { pyodide, pythonCode, newMaterials, pythonOutput } = this.state;

        if (!pythonOutput) {
            await this.runPythonCode();
        }

        try {
            const materialsData = this.prepareMaterialData();
            const dataIn = { materials: materialsData };
            const convertedData = pyodide.toPy({ data_in: dataIn, data_out: {} });

            const result = await pyodide.runPythonAsync(pythonCode, {
                globals: convertedData,
            });

            const dataOut = result.toJs().get("data_out");
            if (dataOut) {
                const materials = dataOut.get("materials");
                const newMaterials = materials.map((m: any) => {
                    const material = this.mapToObject(m);
                    const config = Made.parsers.poscar.fromPoscar(material.poscar);
                    const newMaterial = new Made.Material(config);
                    newMaterial.metadata = material.metadata;

                    return newMaterial;
                });
                this.setState({ newMaterials });
            } else {
                NPMsAlert.error("Expected materials output, but none was found.");
            }
        } catch (error: any) {
            NPMsAlert.error(error.message);
        }

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
        const { isLoading, isRunning, pythonCode, pythonOutput, materials, selectedMaterials } =
            this.state;
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
                isSubmitButtonDisabled={isLoading || isRunning}
            >
                <PyodideLoader onLoad={this.onPyodideLoad} triggerLoad={show} />
                <Box mt={theme.spacing(1)} p={`0 ${theme.spacing(3)}`}>
                    <Grid container spacing={theme.spacing(2)}>
                        <Grid item xs={12} sm={12} md={5}>
                            <MaterialsSelector
                                materials={materials}
                                selectedMaterials={selectedMaterials}
                                setSelectedMaterials={(newMaterials) =>
                                    this.setState({ selectedMaterials: newMaterials })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={5}>
                            <TransformationSelector
                                url={GITHUB_API_URL}
                                setPythonCode={(newPythonCode) =>
                                    this.setState({ pythonCode: newPythonCode })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={3} lg={2}>
                            <PythonCodeExecution
                                isLoading={isLoading}
                                isRunning={isRunning}
                                handleRun={this.handleRun}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <DialogContent>
                    <Paper
                        sx={{
                            height: CODE_DISPLAY_HEIGHT,
                        }}
                    >
                        <PythonCodeDisplay
                            pythonCode={pythonCode}
                            pythonOutput={pythonOutput}
                            setPythonCode={(newContent) =>
                                this.setState({ pythonCode: newContent })
                            }
                        />
                    </Paper>
                </DialogContent>
            </Dialog>
        );
    }
}

export default PythonTransformation;
