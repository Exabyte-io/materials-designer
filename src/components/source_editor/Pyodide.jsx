// eslint-ignore-file
import CodeMirror from "@exabyte-io/cove.js/dist/other/codemirror/CodeMirror";
import { Made } from "@exabyte-io/made.js";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import setClass from "classnames";
import PropTypes from "prop-types";
// eslint-disable-next-line no-unused-vars
// import { loadPyodide } from "pyodide";
import React from "react";

class Pyodide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pythonCode: `
from ase import Atoms
from ase.build import surface
from ase.io import read, write
import io

def func() :
    # Extracting data from globals
    material_data = globals()["data"]
    print("Py input: material_data:", material_data)
    poscar_str = material_data["poscar"]
    h = material_data["h"]
    k = material_data["k"]
    l = material_data["l"]
    layers = material_data["thickness"]
    vacuum = material_data["vacuum"]
    
    # Using io.StringIO to treat the string as a file-like object
    poscar_file = io.StringIO(poscar_str)
    
    atoms = read(poscar_file, format="vasp")
    
    slab = surface(atoms, (h, k, l), layers, vacuum)
    
    output_file = io.StringIO()  # Placeholder
    write(output_file, slab, format="vasp")
    global poscar_output
    poscar_output = output_file.getvalue()
    print('Py output:', poscar_output)
    
    return globals()

func()`,
            result: "",
            surfaceConfig: {
                h: 1,
                k: 0,
                l: 0,
                thickness: 3,
                vacuum: 0.1,
                vx: 1,
                vy: 1,
            },
        };
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.runPythonCode = this.runPythonCode.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    async componentDidMount() {
        this.setState({ isLoading: true });
        await this.initializePyodide();
        this.setState({ isLoading: false });
    }

    handleCodeChange(newContent) {
        this.setState({ pythonCode: newContent });
    }

    async handleClick() {
        const result = await this.runPythonCode(); // not generic!
        this.setState({ result });

        const { onSubmit } = this.props;
        const config = Made.parsers.poscar.fromPoscar(result);
        let newMaterial = new Made.Material(config);
        console.log(newMaterial);
        newMaterial = newMaterial.getACopyWithConventionalCell();
        onSubmit(newMaterial);
    }

    async runPythonCode() {
        let result = null;
        // eslint-disable-next-line no-unused-vars
        const { pythonCode } = this.state;

        const { material } = this.props;
        console.log(material);
        const { surfaceConfig } = this.state;
        const data = {
            poscar: material.getACopyWithConventionalCell().getAsPOSCAR(),
            ...surfaceConfig,
        };

        const convertedData = this.pyodide.toPy({ data });
        try {
            result = await this.pyodide.runPythonAsync(pythonCode, {
                globals: convertedData,
            });
            result = result.toJs().get("poscar_output");
            console.log("RESULT:", result);
            // console.log("RESULT:", result.toJs().get("poscar_output"));
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
    }

    render() {
        const { className } = this.props;
        // eslint-disable-next-line no-unused-vars
        const { pythonCode } = this.state;
        const { isLoading } = this.state;
        const { result } = this.state;
        return (
            <Accordion defaultExpanded className={setClass(className, "crystal-basis")}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Interface Transformation
                </AccordionSummary>
                <AccordionDetails
                    style={{
                        display: "block",
                        height: "100%",
                    }}
                >
                    <Box>
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
                        onClick={this.handleClick}
                    >
                        Run Code
                    </Button>
                </AccordionDetails>
            </Accordion>
        );
    }
}

Pyodide.propTypes = {
    className: PropTypes.string.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    material: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default Pyodide;
