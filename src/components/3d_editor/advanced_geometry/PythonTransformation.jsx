import CodeMirror from "@exabyte-io/cove.js/dist/other/codemirror/CodeMirror";
import { Made } from "@exabyte-io/made.js";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import React from "react";

import { fetchPythonCode, transformationsMap } from "../../../pythonCodeMap";

class PythonTransformation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pythonCode: "",
            materials: props.materials,
            material: {},
            isLoading: false,
            // eslint-disable-next-line react/no-unused-state
            transformationParameters: { transformationName: "default" },
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

    componentDidUpdate(prevProps) {
        const { materials } = this.props;
        if (prevProps.materials !== materials) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ materials });
        }
    }

    handleCodeChange(newContent) {
        this.setState({ pythonCode: newContent });
    }

    async handleRun() {
        try {
            const result = await this.runPythonCode(); // not generic!
            const config = Made.parsers.poscar.fromPoscar(result);
            const newMaterial = new Made.Material(config);
            this.setState({ material: newMaterial });
        } catch (error) {
            console.error(error);
        }
    }

    handleSubmit() {
        const { onSubmit } = this.props;
        const { material } = this.state;
        const newMaterial = material.getACopyWithConventionalCell();
        const newMaterials = [];
        newMaterials.push(newMaterial);
        onSubmit(newMaterials);
    }

    handleTransformationChange = async (event, newValue) => {
        if (newValue) {
            const pythonCode = await fetchPythonCode(newValue);
            this.setState({
                pythonCode,
                transformationParameters: { transformationName: newValue },
            });
        }
    };

    async initializePyodide() {
        this.pyodide = await window.loadPyodide();
        await this.pyodide.loadPackage("numpy");
        await this.pyodide.loadPackage("micropip");
        const micropip = this.pyodide.pyimport("micropip");
        await micropip.install("ase");
        await this.pyodide.pyimport("ase");
        document.pyodideMplTarget = document.getElementById("pyodide-plot-target");
    }

    async runPythonCode() {
        let result = null;
        // eslint-disable-next-line no-unused-vars
        const { pythonCode } = this.state;

        const { materials } = this.state;
        const materialsAsPoscar = materials.map((material) =>
            material.getACopyWithConventionalCell().getAsPOSCAR(),
        );
        const data = {
            poscar_data: materialsAsPoscar,
        };

        const convertedData = this.pyodide.toPy({ data });
        try {
            result = await this.pyodide.runPythonAsync(pythonCode, {
                globals: convertedData,
            });
            result = result
                ? result.toJs().get("content")
                : { content: "Nothing was returned from the Pyodide" };
            console.log("RESULT:", result);
        } catch (error) {
            console.error("Error executing Python code:", error);
        }
        return result;
    }

    render() {
        const { pythonCode, isLoading, transformationParameters, materials } = this.state;
        const { show, onHide } = this.props;
        const transformationNames = Object.keys(transformationsMap);

        return (
            <Dialog
                open={show}
                onClose={onHide}
                PaperProps={{ sx: { width: "800px", height: "600px" } }}
            >
                <Box flexDirection="row" sx={{ alignItems: "center", gap: 2, mt: 2 }}>
                    <InputLabel sx={{ flexShrink: 0, marginRight: "16px" }}>
                        Available Materials:
                    </InputLabel>
                    <Box
                        id="available-materials"
                        display="flex"
                        flexDirection="row"
                        overflowX="auto"
                        gap={1}
                        sx={{
                            flex: "1",
                            alignItems: "center",
                            border: "1px solid grey",
                            borderRadius: "4px",
                        }}
                    >
                        {materials
                            ? materials.map((material) => (
                                  <Chip key={material.name} label={material.name} />
                              ))
                            : null}
                    </Box>
                </Box>
                <Box flexDirection="row" sx={{ alignItems: "center", gap: 2, mt: 2 }}>
                    <InputLabel sx={{ flexShrink: 0, marginRight: "16px" }}>
                        Transformations:
                    </InputLabel>
                    <Autocomplete
                        label="Transformation name:"
                        value={transformationParameters.transformationName}
                        getOptionLabel={(option) => option}
                        options={transformationNames}
                        onChange={this.handleTransformationChange}
                        sx={{ flex: "1" }}
                        renderInput={(params) => (
                            // eslint-disable-next-line react/jsx-props-no-spreading
                            <TextField {...params} label=" " />
                        )}
                    />
                </Box>

                <Box flexDirection="column" maxHeight={600} overflow="auto">
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
