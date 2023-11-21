import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import CodeMirror from "@exabyte-io/cove.js/dist/other/codemirror/CodeMirror";
import PyodideLoader from "@exabyte-io/cove.js/dist/other/pyodide";
// eslint-disable-next-line no-unused-vars
import LightMaterialUITheme, { DarkMaterialUITheme } from "@exabyte-io/cove.js/dist/theme";
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

// TODO: remove in the next task to fetch all code fully from remote
const installPkg = `import micropip
await micropip.install("https://files.mat3ra.com:44318/web/pyodide/pymatgen-2023.9.10-py3-none-any.whl", deps=False)
await micropip.install("https://files.mat3ra.com:44318/web/pyodide/spglib-2.0.2-py3-none-any.whl", deps=False)
await micropip.install("https://files.pythonhosted.org/packages/d9/0e/2a05efa11ea33513fbdf4a2e2576fe94fd8fa5ad226dbb9c660886390974/ruamel.yaml-0.17.32-py3-none-any.whl", deps=False)
for pkg in ["ase", "networkx", "monty", "scipy", "lzma", "tabulate", "sqlite3"]:
 await micropip.install(pkg)`;

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
            theme: LightMaterialUITheme,
            materials: props.materials,
            selectedMaterials: [props.materials[0]],
            newMaterials: [],
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

    handleStdout = (text) => {
        this.setState((prevState) => ({
            pythonOutput: prevState.pythonOutput + text + "\n",
        }));
    };

    onPyodideLoad = (pyodideInstance) => {
        this.setState({ pyodide: pyodideInstance }, async () => {
            await this.loadPackages();
            pyodideInstance.setStdout({ batched: (text) => this.handleStdout(text) });
            document.pyodideMplTarget = document.getElementById("pyodide-plot-target");
        });
    };

    loadPackages = async () => {
        const { pyodide } = this.state;

        if (pyodide) {
            await pyodide.runPythonAsync(installPkg);
        }
        this.setState({ isLoading: false });
    };

    loadPythonCode = () => {
        const { transformationParameters } = this.state;
        const code = transformationsMap[transformationParameters.transformationKey].content;
        this.setState({ pythonCode: code });
    };

    handleCodeChange = (newContent) => {
        this.setState({ pythonCode: newContent });
    };

    runPythonCode = async () => {
        const dataOut = null;
        const { pyodide, pythonCode } = this.state;
        this.setState({ pythonOutput: "" });
        document.pyodideMplTarget.innerHTML = "";

        try {
            const result = await pyodide.runPythonAsync(pythonCode);
            console.log(result);
        } catch (error) {
            this.setState({ pythonOutput: error.message });
        }
        return dataOut;
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

    handleMaterialSelectionChange = (event, newValue) => {
        this.setState({ selectedMaterials: newValue });
    };

    render() {
        const {
            theme,
            isLoading,
            isRunning,
            pythonCode,
            pythonOutput,
            transformationParameters,
            materials,
            selectedMaterials,
        } = this.state;
        const codemirrorTheme = theme === LightMaterialUITheme ? "light" : "dark";
        const { show, onHide } = this.props;

        const getStatusText = () => {
            if (isLoading) return "Loading...";
            if (isRunning) return "Running...";
            return "Ready";
        };

        const icon = <CheckBoxOutlineBlank fontSize="small" />;
        const checkedIcon = <CheckBox fontSize="small" />;

        const controls = () => {
            return (
                <Paper
                    id="controls"
                    elevation={0}
                    sx={{
                        top: 0,
                        m: theme.spacing(1),
                        p: 0,
                    }}
                >
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={5}>
                            <Autocomplete
                                sx={{ flexGrow: 1, minWidth: 300 }}
                                multiple
                                id="materials-autocomplete"
                                size="medium"
                                options={materials}
                                getOptionLabel={(option) => option.name}
                                value={selectedMaterials}
                                onChange={this.handleMaterialSelectionChange}
                                renderOption={(props, option, { selected }) => (
                                    // eslint-disable-next-line react/jsx-props-no-spreading
                                    <li {...props}>
                                        <Checkbox
                                            icon={icon}
                                            checkedIcon={checkedIcon}
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
                                            key={option.id}
                                            label={`${index}: ${option.name}`}
                                            // eslint-disable-next-line react/jsx-props-no-spreading
                                            {...getTagProps({ index })}
                                        />
                                    ))
                                }
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <Autocomplete
                                sx={{ flexGrow: 1, minWidth: 300 }}
                                value={
                                    transformationsMap[transformationParameters.transformationKey]
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
                            xs={2}
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
            );
        };

        return (
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
                    <DialogContent sx={{ overflow: "hidden", p: 0, minHeight: 600 }}>
                        {controls()}
                        <Paper
                            sx={{ minHeight: 800, overflow: "scroll", m: theme.spacing(1), p: 0 }}
                        >
                            <Box
                                id="python-code-input"
                                minHeight={30}
                                maxHeight={800}
                                overflow="scroll"
                                sx={{
                                    backgroundColor: theme.palette.background.paper,
                                }}
                            >
                                <CodeMirror
                                    content={pythonCode}
                                    updateContent={this.handleCodeChange}
                                    readOnly={false}
                                    rows={20}
                                    options={{
                                        lineNumbers: true,
                                    }}
                                    theme={codemirrorTheme}
                                    completions={() => {}}
                                    updateOnFirstLoad
                                    language="python"
                                />
                            </Box>
                            <Divider variant="fullWidth" />
                            <Box
                                id="python-output"
                                maxHeight={800}
                                overflow="scroll"
                                mt={theme.spacing(1)}
                            >
                                {pythonOutput && (
                                    <CodeMirror
                                        content={pythonOutput}
                                        readOnly
                                        rows={20}
                                        options={{
                                            lineNumbers: false,
                                        }}
                                        theme={codemirrorTheme}
                                        completions={() => {}}
                                        updateOnFirstLoad
                                        language="python"
                                    />
                                )}
                            </Box>
                            <Box id="pyodide-plot-target" />
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
