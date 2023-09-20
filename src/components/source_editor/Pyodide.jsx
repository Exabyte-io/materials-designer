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
import matplotlib
import matplotlib.pyplot as plt
matplotlib.use("module://matplotlib_pyodide.html5_canvas_backend")

def func() :
    # Extracting data from globals
    material_data = globals()["data"]
    poscar_str = material_data["poscar"]
    # boilerplate for reading POSCAR
    input = io.StringIO()
    input.write(poscar_str)
    input.seek(0)
    atoms = read(input, format="vasp")
    
    h = material_data["h"]
    k = material_data["k"]
    l = material_data["l"]
    layers = material_data["thickness"]
    vacuum = material_data["vacuum"]
    
    slab = surface(atoms, (h, k, l), layers, vacuum)
    
    # boilerplate for retrieving information
    output = io.StringIO()
    write(output, slab, format="vasp")
    global content
    content = output.getvalue()
    input.close()
    output.close()
   
    # plotting for the fun:
    z_coords = [atom.position[2] for atom in slab]
    symbols = [atom.symbol for atom in slab]
    
    plt.scatter(z_coords, range(len(z_coords)), c='blue')
    for i, txt in enumerate(symbols):
        plt.annotate(txt, (z_coords[i], i))
    plt.xlabel('Z coordinate')
    plt.ylabel('Atom Index')
    plt.title('Atomic Positions in Z direction')
    plt.show()

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
        const { className } = this.props;
        // eslint-disable-next-line no-unused-vars
        const { pythonCode } = this.state;
        const { isLoading } = this.state;
        // eslint-disable-next-line no-unused-vars
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
                    <Box>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={isLoading}
                            style={{ marginTop: "10px" }}
                            onClick={this.handleClick}
                        >
                            Run Code
                        </Button>
                    </Box>
                    <Box id="pyodide-plot-target" />
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
