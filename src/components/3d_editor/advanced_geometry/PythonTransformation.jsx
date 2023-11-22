import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import CodeMirror from "@exabyte-io/cove.js/dist/other/codemirror/CodeMirror";
import PyodideLoader from "@exabyte-io/cove.js/dist/other/pyodide";
import theme from "@exabyte-io/cove.js/dist/theme";
import ThemeProvider from "@exabyte-io/cove.js/dist/theme/provider";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { Checkbox, Chip, Paper } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import React from "react";
import NPMsAlert from "react-s-alert";

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
        this.setState({ pyodide: pyodideInstance }, async () => {
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
                    <DialogContent sx={{ overflow: "none", p: 0, minHeight: 400 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                m: theme.spacing(1),
                            }}
                        >
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs>
                                    <Autocomplete
                                        sx={{ flexGrow: 1, minWidth: 300 }}
                                        multiple
                                        id="materials-autocomplete"
                                        size="medium"
                                        options={materials}
                                        getOptionLabel={(option) => option.name}
                                        value={selectedMaterials}
                                        onChange={(newValue) =>
                                            this.setState({ selectedMaterials: newValue })
                                        }
                                        renderOption={(props, option, { selected }) => (
                                            // eslint-disable-next-line react/jsx-props-no-spreading
                                            <li {...props}>
                                                <Checkbox
                                                    icon={<CheckBoxOutlineBlank fontSize="small" />}
                                                    checkedIcon={<CheckBox fontSize="small" />}
                                                    checked={selected}
                                                />
                                                {option.name}
                                            </li>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                // eslint-disable-next-line react/jsx-props-no-spreading
                                                {...params}
                                                label="Selected Materials"
                                                placeholder="Select materials"
                                            />
                                        )}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => (
                                                <Chip
                                                    label={`${index}: ${option.name}`}
                                                    // eslint-disable-next-line react/jsx-props-no-spreading
                                                    {...getTagProps({ index })}
                                                />
                                            ))
                                        }
                                    />
                                </Grid>
                                <Grid item xs>
                                    <Autocomplete
                                        sx={{ flexGrow: 1, minWidth: 300 }}
                                        value={
                                            transformationsMap[
                                                transformationParameters.transformationKey
                                            ]
                                        }
                                        getOptionLabel={(option) => option.name}
                                        options={Object.values(transformationsMap)}
                                        onChange={this.handleTransformationParametersChange}
                                        size="medium"
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
                                    <Typography variant="body1">{getStatusText()}</Typography>
                                    <Button
                                        id="python-transformation-dialog-run-button"
                                        variant="contained"
                                        color={isLoading ? "inherit" : "success"}
                                        onClick={this.handleRun}
                                        disabled={isLoading || isRunning}
                                    >
                                        Run
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                        <Paper sx={{ minHeight: 800, overflow: "scroll", m: theme.spacing(1) }}>
                            <Box
                                id="python-code-input"
                                sx={{
                                    backgroundColor: theme.palette.background.paper,
                                }}
                            >
                                <CodeMirror
                                    content={pythonCode}
                                    updateContent={(newContent) =>
                                        this.setState({ pythonCode: newContent })
                                    }
                                    options={{
                                        lineNumbers: true,
                                    }}
                                    theme="light"
                                    language="python"
                                />
                            </Box>
                            <Divider variant="fullWidth" />
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
                    </DialogContent>
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
