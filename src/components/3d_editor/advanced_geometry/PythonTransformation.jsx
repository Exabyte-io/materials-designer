import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import IconByName from "@exabyte-io/cove.js/dist/mui/components/icon/IconByName";
import CodeMirror from "@exabyte-io/cove.js/dist/other/codemirror/CodeMirror";
import PyodideLoader from "@exabyte-io/cove.js/dist/other/pyodide";
import theme from "@exabyte-io/cove.js/dist/theme";
import ThemeProvider from "@exabyte-io/cove.js/dist/theme/provider";
import CheckIcon from "@mui/icons-material/Check";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import React from "react";
import NPMsAlert from "react-s-alert";

import MaterialsSelector from "./MaterialsSelector.tsx";

const transformationsMap = {
    default: {
        name: "Default",
        content: `print("Hello World!")`,
    },
};

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
            transformationParameters: props.transformationParameters,
        };
        this.handleRun = this.handleRun.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.pythonCode === "") {
            this.loadPythonCode();
        }
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

    loadPythonCode = () => {
        const { transformationParameters } = this.state;
        const code = transformationsMap[transformationParameters.transformationKey].content;
        this.setState({ pythonCode: code });
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

    handleTransformationParametersChange = (event, newValue) => {
        if (newValue) {
            const { transformationParameters } = this.state;
            this.setState({
                transformationParameters: {
                    ...transformationParameters,
                    transformation: newValue,
                },
            });
            this.loadPythonCode();
        }
    };

    render() {
        const {
            isLoading,
            isRunning,
            pythonCode,
            pythonOutput,
            transformationParameters,
            materials,
            selectedMaterials,
        } = this.state;
        const { show, onHide } = this.props;

        const getStatusText = () => {
            if (isLoading) return "Loading...";
            if (isRunning) return "Running...";
            return "Ready";
        };

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
                            height: "100%",
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
                            <Grid item xs>
                                <Autocomplete
                                    sx={{ flexGrow: 1, minWidth: 300 }}
                                    size="small"
                                    value={
                                        transformationsMap[
                                            transformationParameters.transformationKey
                                        ]
                                    }
                                    getOptionLabel={(option) => option.name}
                                    options={Object.values(transformationsMap)}
                                    onChange={this.handleTransformationParametersChange}
                                    renderInput={(params) => (
                                        <TextField
                                            // eslint-disable-next-line react/jsx-props-no-spreading
                                            {...params}
                                            label="Transformation"
                                            placeholder="Select transformation"
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid
                                item
                                xs
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                    gap: theme.spacing(1),
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Typography variant="body2">{getStatusText()}</Typography>
                                    {isLoading || isRunning ? (
                                        <CircularProgress
                                            color="primary"
                                            size={theme.typography.button.fontSize}
                                        />
                                    ) : (
                                        <CheckIcon color="secondary" />
                                    )}
                                </Box>
                                <Button
                                    id="python-transformation-dialog-run-button"
                                    variant="contained"
                                    size="small"
                                    color={isLoading ? "secondary" : "success"}
                                    onClick={this.handleRun}
                                    disabled={isLoading || isRunning}
                                >
                                    Run
                                    <IconByName name="actions.execute" />
                                </Button>
                            </Grid>
                        </Stack>
                    </Paper>
                    <Paper sx={{ minHeight: 800, overflow: "scroll", m: theme.spacing(1) }}>
                        <Box
                            id="python-code-input"
                            sx={{
                                border: `1px solid ${theme.palette.secondary.light}`,
                            }}
                        >
                            <CodeMirror
                                content={pythonCode}
                                updateContent={(newContent) =>
                                    this.setState({ pythonCode: newContent })
                                }
                                options={{
                                    autoSave: true,
                                    lineNumbers: true,
                                }}
                                theme="light"
                                language="python"
                            />
                        </Box>

                        <Box id="python-output" mt={theme.spacing(1)}>
                            {pythonOutput && (
                                <CodeMirror
                                    content={pythonOutput}
                                    readOnly
                                    options={{
                                        lineNumbers: false,
                                    }}
                                    theme="light"
                                    language="python"
                                />
                            )}
                        </Box>
                    </Paper>
                </Dialog>
            </ThemeProvider>
        );
    }
}

PythonTransformation.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    materials: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    transformationParameters: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
};

export default PythonTransformation;
