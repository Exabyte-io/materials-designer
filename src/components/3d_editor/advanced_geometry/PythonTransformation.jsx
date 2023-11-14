import CodeMirror from "@exabyte-io/cove.js/dist/other/codemirror/CodeMirror";
import PyodideLoader from "@exabyte-io/cove.js/dist/other/pyodide-loader";
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

const installPkg = `import micropip
await micropip.install("https://files.mat3ra.com:44318/web/pyodide/pymatgen-2023.9.10-py3-none-any.whl", deps=False)
await micropip.install("https://files.mat3ra.com:44318/web/pyodide/spglib-2.0.2-py3-none-any.whl", deps=False)
await micropip.install("https://files.pythonhosted.org/packages/d9/0e/2a05efa11ea33513fbdf4a2e2576fe94fd8fa5ad226dbb9c660886390974/ruamel.yaml-0.17.32-py3-none-any.whl", deps=False)
for pkg in ["networkx", "monty", "scipy", "lzma", "tabulate", "sqlite3"]:
  await micropip.install(pkg)`;

class PythonTransformation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pythonCode: "",
            materials: props.materials,
            newMaterials: [],
            isLoading: false,
            transformationParameters: {
                transformationName: "default",
            },
            pyodide: null,
        };
    }

    componentDidUpdate(prevProps) {
        const { show } = this.props;
        if (show && !prevProps.show) {
            this.loadPythonCode();
        }
    }

    getPyodide = (pyodideInstance) => {
        this.setState({ pyodide: pyodideInstance }, () => {
            this.loadPackages();
        });
    };

    loadPackages = async () => {
        const { pyodide } = this.state;

        if (pyodide) {
            await pyodide.runPythonAsync(installPkg);
        }
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
            console.error("Error executing Python code:", error);
        }
        return dataOut;
    };

    handleRun = async () => {
        this.setState({ isLoading: true });
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
            console.error(error);
        } finally {
            this.setState({ isLoading: false });
        }
    };

    handleSubmit = () => {
        const { onSubmit } = this.props;
        const { newMaterials } = this.state;
        onSubmit(newMaterials);
    };

    handleTransformationParametersChange = async (event, newValue) => {
        if (newValue) {
            const code = await fetchPythonCode(newValue);
            this.setState({
                transformationParameters: { transformationName: newValue },
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

    render() {
        const { isLoading, transformationParameters, materials } = this.state;
        const { show, onHide } = this.props;
        const transformationNames = Object.keys(transformationsMap);

        const { pythonCode } = this.state;
        return (
            <>
                <PyodideLoader getPyodide={this.getPyodide} triggerLoad={show} />
                <Dialog
                    open={show}
                    onClose={onHide}
                    fullWidth
                    maxWidth="lg"
                    PaperProps={{ sx: { width: "60vw", height: "60vh", padding: "20px" } }}
                >
                    <Box flexDirection="row">
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
                            onChange={this.handleTransformationParametersChange}
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

                    <Box
                        flexDirection="row"
                        sx={{ justifyContent: "flex-end", gap: 2, mt: 2, width: "100%" }}
                    >
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
                    </Box>
                    <Box id="pyodide-plot-target" />
                </Dialog>
            </>
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
