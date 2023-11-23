import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import PyodideLoader from "@exabyte-io/cove.js/dist/other/pyodide";
import theme from "@exabyte-io/cove.js/dist/theme";
import ThemeProvider from "@exabyte-io/cove.js/dist/theme/provider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import React from "react";
import NPMsAlert from "react-s-alert";

import MaterialsSelector from "./MaterialsSelector";
import PythonCodeDisplay from "./PythonCodeDisplay";
import PythonCodeExecution from "./PythonCodeExecution";
import TransformationSelector from "./TransformationSelector";

class PythonTransformation extends React.Component {
    constructor(props) {
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

    // eslint-disable-next-line no-unused-vars
    componentDidUpdate(prevProps, prevState) {
        const { materials } = this.props;
        if (prevProps.materials !== materials) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ materials });
        }
    }

    onPyodideLoad = (pyodideInstance) => {
        this.setState({ pyodide: pyodideInstance, isLoading: false }, async () => {
            // redirecting stdout for print and errors per https://pyodide.org/en/stable/usage/streams.html
            pyodideInstance.setStdout({ batched: (text) => this.redirectPyodideStdout(text) });
        });
    };

    redirectPyodideStdout = (text) => {
        this.setState((prevState) => ({
            pythonOutput: prevState.pythonOutput + text + "\n",
        }));
    };

    runPythonCode = async () => {
        const { pyodide, pythonCode } = this.state;
        this.setState({ pythonOutput: "" });

        try {
            await pyodide.runPythonAsync(pythonCode);
        } catch (error) {
            this.setState({ pythonOutput: error.message });
        }
    };

    handleRun = async () => {
        this.setState({ isRunning: true });
        try {
            await this.runPythonCode();
        } catch (error) {
            NPMsAlert.error(error.message);
        } finally {
            this.setState({ isRunning: false });
        }
    };

    handleSubmit = () => {
        const { onSubmit } = this.props;
        const { newMaterials } = this.state;
        onSubmit(newMaterials);
    };

    render() {
        const { isLoading, isRunning, pythonCode, pythonOutput, materials, selectedMaterials } =
            this.state;
        const { show, onHide } = this.props;

        return (
            // TODO: fix DarkMaterialUITheme in cove.js and remove ThemeProvider
            <ThemeProvider theme={theme}>
                <PyodideLoader onLoad={this.onPyodideLoad} triggerLoad={show} />
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
                    <Paper
                        elevation={0}
                        sx={{
                            m: theme.spacing(1),
                        }}
                    >
                        <Stack spacing={2} alignItems="center" direction="row">
                            <MaterialsSelector
                                materials={materials}
                                selectedMaterials={selectedMaterials}
                                setSelectedMaterials={(newMaterials) =>
                                    this.setState({ selectedMaterials: newMaterials })
                                }
                            />
                            <TransformationSelector
                                setPythonCode={(newPythonCode) =>
                                    this.setState({ pythonCode: newPythonCode })
                                }
                            />
                            <PythonCodeExecution
                                isLoading={isLoading}
                                isRunning={isRunning}
                                handleRun={this.handleRun}
                            />
                        </Stack>
                    </Paper>
                    <Paper sx={{ minHeight: 800, overflow: "scroll", m: theme.spacing(1) }}>
                        <PythonCodeDisplay
                            pythonCode={pythonCode}
                            pythonOutput={pythonOutput}
                            setPythonCode={(newContent) =>
                                this.setState({ pythonCode: newContent })
                            }
                        />
                    </Paper>
                </Dialog>
            </ThemeProvider>
        );
    }
}

PythonTransformation.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    materials: PropTypes.array.isRequired,
    show: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
};

export default PythonTransformation;
