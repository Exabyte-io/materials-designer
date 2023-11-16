import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import CodeMirror from "@exabyte-io/cove.js/dist/other/codemirror/CodeMirror";
import PyodideLoader from "@exabyte-io/cove.js/dist/other/pyodide";
// eslint-disable-next-line no-unused-vars
import LightMaterialUITheme, { DarkMaterialUITheme } from "@exabyte-io/cove.js/dist/theme";
import ThemeProvider from "@exabyte-io/cove.js/dist/theme/provider";
import { Made } from "@exabyte-io/made.js";
import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { Checkbox, Chip, Paper } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import React from "react";
import NPMsAlert from "react-s-alert";

import { fetchPythonCode, transformationsMap } from "../../../pythonCodeMap";

const installPkg = `import micropip
await micropip.install("https://files.mat3ra.com:44318/web/pyodide/pymatgen-2023.9.10-py3-none-any.whl", deps=False)
await micropip.install("https://files.mat3ra.com:44318/web/pyodide/spglib-2.0.2-py3-none-any.whl", deps=False)
await micropip.install("https://files.pythonhosted.org/packages/d9/0e/2a05efa11ea33513fbdf4a2e2576fe94fd8fa5ad226dbb9c660886390974/ruamel.yaml-0.17.32-py3-none-any.whl", deps=False)
for pkg in ["ase", "networkx", "monty", "scipy", "lzma", "tabulate", "sqlite3"]:
 await micropip.install(pkg)`;

class PythonTransformation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: LightMaterialUITheme,
            pythonCode: "",
            materials: props.materials,
            selectedMaterials: [],
            newMaterials: [],
            isLoading: true,
            isRunning: false,
            transformationParameters: {
                transformationName: "default",
            },
            pyodide: null,
            pythonOutput: "",
        };
    }

    componentDidUpdate(prevProps) {
        const { show } = this.props;
        if (show && !prevProps.show) {
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

    getPyodide = (pyodideInstance) => {
        this.setState({ pyodide: pyodideInstance }, () => {
            this.loadPackages();
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

    loadPythonCode = async () => {
        const { transformationParameters } = this.state;
        const code = await fetchPythonCode(transformationParameters.transformationName);
        this.setState({ pythonCode: code });
    };

    handleCodeChange = (newContent) => {
        this.setState({ pythonCode: newContent });
    };

    runPythonCode = async () => {
        let dataOut = null;
        const { pyodide, pythonCode, materials } = this.state;
        this.setState({ pythonOutput: "" });
        document.pyodideMplTarget.innerHTML = "";

        const materialsData = materials.map((material, id) => {
            const materialConfig = material.toJSON();
            const materialPoscar = material.getAsPOSCAR();
            return {
                id,
                material: materialConfig,
                poscar: materialPoscar,
                metadata: material.metadata,
            };
        });

        const dataIn = { materials: materialsData };
        const convertedData = pyodide.toPy({ data_in: dataIn, data_out: {} });

        try {
            const result = await pyodide.runPythonAsync(pythonCode, {
                globals: convertedData,
            });
            dataOut = (await result)
                ? result.toJs().get("data_out")
                : { content: "Nothing was returned from the Pyodide" };
            console.log("RESULT:", dataOut);
        } catch (error) {
            this.setState({ pythonOutput: error.message });
        }
        return dataOut;
    };

    handleRun = async () => {
        this.setState({ isRunning: true });
        try {
            const dataOut = await this.runPythonCode();
            const materialsData = dataOut.get("materials");
            const newMaterialsData = materialsData.map((m) => {
                const material = this.mapToObject(m);
                const config = Made.parsers.poscar.fromPoscar(material.poscar);
                const newMaterial = new Made.Material(config);
                newMaterial.metadata = material.metadata;

                return newMaterial;
            });
            this.setState({ newMaterials: newMaterialsData });
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

    handleTransformationParametersChange = async (event, newValue) => {
        if (newValue) {
            const code = await fetchPythonCode(newValue.content);
            const { transformationParameters } = this.state;
            this.setState({
                transformationParameters: {
                    ...transformationParameters,
                    transformation: newValue,
                },
                pythonCode: code,
            });
        }
    };

    mapToObject = (map) => {
        const obj = {};
        map.forEach((value, key) => {
            obj[key] = value instanceof Map ? this.mapToObject(value) : value;
        });
        return obj;
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
                <Box id="controls">
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 2,
                            mt: 2,
                        }}
                    >
                        <Autocomplete
                            multiple
                            id="materials-autocomplete"
                            size="medium"
                            sx={{ minWidth: 300 }}
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
                                        label={`${index}: ${option.name}`}
                                        // eslint-disable-next-line react/jsx-props-no-spreading
                                        {...getTagProps({ index })}
                                    />
                                ))
                            }
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 2,
                            mt: 2,
                        }}
                    >
                        <Autocomplete
                            value={transformationParameters.transformationName}
                            getOptionLabel={(option) => option.name}
                            options={Object.values(transformationsMap)}
                            onChange={this.handleTransformationParametersChange}
                            size="medium"
                            sx={{ width: 600 }}
                            renderInput={(params) => (
                                <TextField
                                    // eslint-disable-next-line react/jsx-props-no-spreading
                                    {...params}
                                    label="Transformation"
                                    placeholder="Loading options..."
                                />
                            )}
                        />
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: 2,
                            mt: 2,
                            width: "100%",
                        }}
                    >
                        <Typography variant="body1">{getStatusText()}</Typography>
                        <Button
                            variant="contained"
                            color={isLoading ? "inherit" : "success"}
                            onClick={this.handleRun}
                        >
                            Run
                        </Button>
                    </Box>
                </Box>
            );
        };

        return (
            <ThemeProvider theme={theme}>
                <PyodideLoader onLoad={this.getPyodide} triggerLoad={show} />
                <Dialog
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
                            sx={{ minHeight: 800, overflow: "scroll", mt: theme.spacing(1), p: 0 }}
                        >
                            <Box
                                id="python-code"
                                minHeight={30}
                                maxHeight={800}
                                overflow="scroll"
                                sx={{
                                    backgroundColor: theme.palette.background.paper,
                                }}
                            >
                                <CodeMirror
                                    className="codemirror-python-code"
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
                                        className="codemirror-python-output"
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
