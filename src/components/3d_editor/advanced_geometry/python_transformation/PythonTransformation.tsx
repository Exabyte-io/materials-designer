import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import PyodideLoader from "@exabyte-io/cove.js/dist/other/pyodide";
import theme from "@exabyte-io/cove.js/dist/theme";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import React from "react";
import NPMsAlert from "react-s-alert";

import CodeExecutionControls from "./CodeExecutionControls";
import MaterialsSelector from "./MaterialsSelector";
import PythonCodeDisplay from "./PythonCodeDisplay";
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
    isLoading: boolean;
    isRunning: boolean;
    // TODO: import type for Pyodide when they are available in Cove.js
    // @ts-ignore
    pyodide: any;
    pythonCode: string;
    pythonOutput: string;
}

const CODE_DISPLAY_HEIGHT = "60vh";

class PythonTransformation extends React.Component<
    PythonTransformationProps,
    PythonTransformationState
> {
    constructor(props: PythonTransformationProps) {
        super(props);
        this.state = {
            materials: props.materials,
            selectedMaterials: [props.materials[0]],
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

    runPythonCode = async () => {
        const { pyodide, pythonCode } = this.state;
        this.setState({ pythonOutput: "" });

        try {
            await pyodide.runPythonAsync(pythonCode);
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

    handleSubmit = () => {
        // TODO: return newly created materials in the next task
        // eslint-disable-next-line react/destructuring-assignment
        this.props.onSubmit(this.state.selectedMaterials);
    };

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
                scroll="body"
            >
                <PyodideLoader onLoad={this.onPyodideLoad} triggerLoad={show} />
                <DialogContent sx={{ overflow: "hidden" }}>
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
                                setPythonCode={(newPythonCode) =>
                                    this.setState({ pythonCode: newPythonCode })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={3} lg={2}>
                            <CodeExecutionControls
                                isLoading={isLoading}
                                isRunning={isRunning}
                                handleRun={this.handleRun}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <Paper
                                sx={{
                                    height: CODE_DISPLAY_HEIGHT,
                                    overflow: "scroll",
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
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        );
    }
}

export default PythonTransformation;
