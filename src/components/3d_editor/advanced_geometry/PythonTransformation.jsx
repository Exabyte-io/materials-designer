import CodeMirror from "@exabyte-io/cove.js/dist/other/codemirror/CodeMirror";
import { PyodideContext } from "@exabyte-io/cove.js/dist/other/pyodide-loader";
import { Made } from "@exabyte-io/made.js";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";

import { fetchPythonCode, transformationsMap } from "../../../pythonCodeMap";

const PythonTransformation = ({
    materials: initialMaterials,
    // eslint-disable-next-line no-unused-vars
    transformationParameters: initialTransformationParameters,
    show,
    onHide,
    onSubmit,
}) => {
    const [pythonCode, setPythonCode] = useState("");
    // eslint-disable-next-line no-unused-vars
    const [materials, setMaterials] = useState(initialMaterials);
    const [newMaterials, setNewMaterials] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [transformationParameters, setTransformationParameters] = useState({
        transformationName: "default",
    });

    const pyodide = useContext(PyodideContext);

    const loadPythonCode = async () => {
        const code = await fetchPythonCode(transformationParameters.transformationName);
        setPythonCode(code);
        setIsLoading(false);
    };

    useEffect(async () => {
        if (show) {
            setIsLoading(true);
            await loadPythonCode();
        }
    }, [show, materials]);

    // eslint-disable-next-line no-unused-vars
    const handleCodeChange = (newContent) => {
        setPythonCode(newContent);
    };

    const mapToObject = (map) => {
        const obj = {};
        map.forEach((value, key) => {
            obj[key] = value instanceof Map ? mapToObject(value) : value;
        });
        return obj;
    };

    const runPythonCode = async () => {
        let dataOut = null;

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
        console.log("Running Python code... PYODIDE:", pyodide);
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

    const handleRun = async () => {
        try {
            const dataOut = await runPythonCode();
            const materialsData = dataOut.get("materials");
            const newMaterialsData = materialsData.map((m) => {
                const material = mapToObject(m);
                const config = Made.parsers.poscar.fromPoscar(material.poscar);
                const newMaterial = new Made.Material(config);
                newMaterial.metadata = material.metadata;

                return newMaterial;
            });

            setNewMaterials(newMaterialsData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = () => {
        onSubmit(newMaterials);
    };

    const handleTransformationParametersChange = async (event, newValue) => {
        if (newValue) {
            const code = await fetchPythonCode(newValue);
            setTransformationParameters({ transformationName: newValue });
            setPythonCode(code);
        }
    };

    const transformationNames = Object.keys(transformationsMap);
    return (
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
                    onChange={handleTransformationParametersChange}
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
                    updateContent={handleCodeChange}
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
                    onClick={handleRun}
                >
                    Run Code
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    style={{ marginTop: "10px" }}
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </Box>
            <Box id="pyodide-plot-target" />
        </Dialog>
    );
};

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
