import CodeMirror from "@exabyte-io/cove.js/dist/other/codemirror/CodeMirror";
import { Made } from "@exabyte-io/made.js";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import React from "react";

import { fetchPythonCode, transformationsMap } from "../../../pythonCodeMap";

class PythonTransformation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pythonCode: "print('Hello World!')",
            materials: props.materials,
            // eslint-disable-next-line react/no-unused-state
            transformationParameters: { transformationName: "createInterface" },
        };
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.runPythonCode = this.runPythonCode.bind(this);
        this.handleRun = this.handleRun.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        this.setState({ isLoading: true });
        const { transformationParameters } = this.state;
        const pythonCode = await fetchPythonCode(transformationParameters.transformationName);
        this.setState({
            pythonCode,
        });

        await this.initializePyodide();
        this.setState({ isLoading: false });
    }

    handleCodeChange(newContent) {
        this.setState({ pythonCode: newContent });
    }

    async handleRun() {
        const result = await this.runPythonCode(); // not generic!
        const config = Made.parsers.poscar.fromPoscar(result);
        const newMaterial = new Made.Material(config);
        this.setState({ material: newMaterial });
    }

    handleSubmit() {
        const { onSubmit } = this.props;
        const { material } = this.state;
        console.log("handleSubmit", material);
        const newMaterial = material.getACopyWithConventionalCell();
        const newMaterials = [];
        newMaterials.push(newMaterial);
        onSubmit(newMaterials);
    }

    async runPythonCode() {
        let result = null;
        // eslint-disable-next-line no-unused-vars
        const { pythonCode } = this.state;

        const { surfaceConfig, materials } = this.state;
        const materialsAsPoscar = materials.map((material) =>
            material.getACopyWithConventionalCell().getAsPOSCAR(),
        );
        const data = {
            poscar: materialsAsPoscar,
            ...surfaceConfig,
        };

        const convertedData = this.pyodide.toPy({ data });
        try {
            result = await this.pyodide.runPythonAsync(pythonCode, {
                globals: convertedData,
            });
            result = result.toJs().get("content");
            console.log("RESULT:", result);
        } catch (error) {
            console.error("Error executing Python code:", error);
        }
        return result;
    }

    async initializePyodide() {
        this.pyodide = await window.loadPyodide();
        await this.pyodide.loadPackage("numpy");
        await this.pyodide.loadPackage("micropip");
        const micropip = this.pyodide.pyimport("micropip");
        await micropip.install("ase");
        await this.pyodide.pyimport("ase");
        document.pyodideMplTarget = document.getElementById("pyodide-plot-target");
    }

    render() {
        const { pythonCode, isLoading, transformationParameters, materials } = this.state;
        const { show, onHide } = this.props;
        return (
            <Dialog open={show} onClose={onHide}>
                <Box flexDirection="row">
                    <Box flexDirection="column">
                        {materials
                            ? materials.map((material) => (
                                  <ListItem key={material.name}>{material.name}</ListItem> // Display material name in ListItem
                              ))
                            : null}
                    </Box>
                    <Box flexDirection="column">
                        <Autocomplete
                            label="Transformation name:"
                            value={transformationParameters.transformationName}
                            options={transformationsMap}
                            renderInput={(params) => (
                                // eslint-disable-next-line react/jsx-props-no-spreading
                                <TextField {...params} label="Transformations" />
                            )}
                        />
                    </Box>
                    <Box flexDirection="column">
                        <CodeMirror
                            className="xyz-codemirror"
                            content={pythonCode}
                            updateContent={this.handleCodeChange}
                            readOnly={false}
                            rows={20}
                            options={{
                                lineNumbers: true,
                            }}
                            theme="dark"
                            completions={() => {}}
                            updateOnFirstLoad
                            language="python"
                        />
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                        style={{ marginTop: "10px" }}
                        onClick={this.handleRun}
                    >
                        Run Code
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                        style={{ marginTop: "10px" }}
                        onClick={this.handleSubmit}
                    >
                        Submit
                    </Button>
                    <Box id="pyodide-plot-target" />
                </Box>
            </Dialog>
        );
    }
}

PythonTransformation.propTypes = {
    materials: PropTypes.array.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    transformationParameters: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
};

export default PythonTransformation;
