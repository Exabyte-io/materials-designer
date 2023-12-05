import Dialog from "@exabyte-io/cove.js/dist/mui/components/dialog/Dialog";
import PyodideLoader from "@exabyte-io/cove.js/dist/other/pyodide";
// TODO: add types when made.js is moved to Typescript
// @ts-ignore
import { Made } from "@exabyte-io/made.js";
import Check from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React from "react";
import NPMsAlert from "react-s-alert";

import CodeExecutionControls from "./CodeExecutionControls";
import MaterialsSelector from "./MaterialsSelector";
import PythonCodeDisplay from "./PythonCodeDisplay";
import TransformationSelector from "./TransformationSelector";

interface PythonTransformationProps {
    // TODO: add type when made.js is moved to Typescript
    // @ts-ignore
    materials: any[];
    show: boolean;
    // @ts-ignore
    onSubmit: (newMaterials: any[]) => void;
    onHide: () => void;
}

interface PythonTransformationState {
    // @ts-ignore
    materials: any[];
    // @ts-ignore
    selectedMaterials: any[];
    // @ts-ignore
    newMaterials: any[];
    executionState: "loading" | "running" | "ready" | "error";
    // TODO: import type for Pyodide when they are available in Cove.js
    // @ts-ignore
    pyodide: any;
    pythonCodeFull: string;
    pythonCode: Record<string, string>;
    pythonOutput: Record<string, string>;
}

interface PyodideDataMap {
    [key: string]: string | PyodideDataMap;
}

const CODE_DISPLAY_HEIGHT = "50vh";
const GITHUB_API_URL =
    "https://api.github.com/repos/Exabyte-io/api-examples/contents/other/python_transformations?ref=feature/SOF-7058";

const PYTHON_CODE_DEFAULT = {
    settings: `parameters = {
    "SUBSTRATE_INDEX": 0,
    "LAYER_INDEX": 1,
    "SLAB_MILLER_H": 1,
    "SLAB_MILLER_K": 1,
    "SLAB_MILLER_L": 1,
    "SLAB_VACUUM": 5,
    "SLAB_NUMBER_OF_LAYERS": 3,
    "INTERFACE_SLAB_V_MATRIX": [[1, 0], [0, 1]],
    "INTERFACE_LAYER_V_MATRIX": [[1, 0], [0, 1]],
    "INTERFACE_DISTANCE": 2.0
}
materials_out = transformation(materials_in, parameters)`,

    imports: `# Imports
import micropip

await micropip.install("ase")
print("Installed ase")
from ase.build import surface, supercells
from ase.io import read, write
import io
import numpy as np
`,
    body: `materials_in = globals()["data_in"]["materials"]
# Transformation
def transformation(materials_in, parameters): 
    settings = {
        "slab": {
            "miller:h": parameters["SLAB_MILLER_H"],
            "miller:k": parameters["SLAB_MILLER_K"],
            "miller:l": parameters["SLAB_MILLER_L"],
            "vacuum": parameters["SLAB_VACUUM"],
            "number_of_layers": parameters["SLAB_NUMBER_OF_LAYERS"],
        },
        "interface": {
            "slab_v:matrix": parameters["INTERFACE_SLAB_V_MATRIX"],
            "layer_v:matrix": parameters["INTERFACE_LAYER_V_MATRIX"],
            "distance": parameters["INTERFACE_DISTANCE"],
        },
    }
    try:
        substrate_data = materials_in[parameters["SUBSTRATE_INDEX"]]
        layer_data = materials_in[parameters["LAYER_INDEX"]]
    
        substrate = ase_poscar_to_atoms(substrate_data["poscar"])
        layer = ase_poscar_to_atoms(layer_data["poscar"])
    
        interface = MaterialInterface(substrate, layer, settings)
    
        print("Interface: ", interface.structure)
        print("strain (a, b):", interface.calculate_strain())
    
        materials_out = [{"poscar" : ase_atoms_to_poscar(interface.structure)}]
    except Exception as e:
        print(e)
        return None
    return materials_out
        
# Classes and Definitions
def ase_poscar_to_atoms(poscar):
    input = io.StringIO(poscar)
    atoms = read(input, format="vasp")
    return atoms


def ase_atoms_to_poscar(atoms):
    output = io.StringIO()
    write(output, atoms, format="vasp")
    content = output.getvalue()
    output.close()
    return content


def expand_matrix_2x2_to_3x3(matrix_2x2):
    matrix_3x3 = np.identity(3)
    matrix_3x3[0:2, 0:2] = matrix_2x2
    return matrix_3x3


class MaterialInterface:
    def __init__(self, substrate, material, settings=None):
        self.substrate = substrate
        self.material = material
        self.settings = settings
        if settings:
            for key in self.settings.keys():
                if key in settings:
                    self.settings[key].update(settings[key])
        self.structure = self.create_structure()

    def create_structure(self):
        slab = self.settings["slab"]
        interface = self.settings["interface"]

        self.substrate = surface(
            self.substrate,
            (slab["miller:h"], slab["miller:k"], slab["miller:l"]),
            vacuum=slab["vacuum"],
            layers=slab["number_of_layers"],
        )

        slab_v_matrix = expand_matrix_2x2_to_3x3(interface["slab_v:matrix"])
        layer_v_matrix = expand_matrix_2x2_to_3x3(interface["layer_v:matrix"])

        self.substrate = supercells.make_supercell(self.substrate, slab_v_matrix)
        self.substrate.wrap()
        self.material = supercells.make_supercell(self.material, layer_v_matrix)
        self.original_material = self.material.copy()
        # self.material.set_cell(self.substrate.get_cell(), scale_atoms=True)
        self.material.wrap()

        z_offset = self.calculate_distance()
        self.material.positions[:, 2] += z_offset
        interface = self.substrate + self.material
        interface.wrap()
        return interface

    def calculate_strain(self, substrate=None, material=None):
        """Calculates strain for the material layer on the substrate"""

        if substrate is None:
            substrate = self.substrate
        if material is None:
            material = self.original_material

        substrate_cell = substrate.get_cell()
        material_cell = material.get_cell()

        a0 = np.linalg.norm(substrate_cell[0])
        b0 = np.linalg.norm(substrate_cell[1])

        a1 = np.linalg.norm(material_cell[0])
        b1 = np.linalg.norm(material_cell[1])

        strain_a = (a1 - a0) / a0
        strain_b = (b1 - b0) / b0

        return (strain_a, strain_b)

    def calculate_distance(self):
        """Calculates distance between the substrate and the material"""
        interface = self.settings["interface"]
        z_max_substrate = max(self.substrate.positions[:, 2])
        z_min_material = min(self.material.positions[:, 2])
        z_offset = z_max_substrate - z_min_material + interface["distance"]

        return z_offset

`,
};

class PythonTransformation extends React.Component<
    PythonTransformationProps,
    PythonTransformationState
> {
    constructor(props: PythonTransformationProps) {
        super(props);
        this.state = {
            materials: props.materials,
            selectedMaterials: [props.materials[0]],
            newMaterials: [],
            executionState: "loading",
            pyodide: null,
            pythonCodeFull: "",
            pythonCode: PYTHON_CODE_DEFAULT,
            pythonOutput: {
                settings: "",
                imports: "",
                body: "",
            },
        };
    }

    componentDidUpdate(prevProps: PythonTransformationProps) {
        const { materials } = this.props;
        if (prevProps.materials !== materials) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({ materials });
        }
    }

    onPyodideLoad = (pyodideInstance: any) => {
        this.setState({ pyodide: pyodideInstance, executionState: "ready" }, async () => {
            // redirecting stdout for print and errors per https://pyodide.org/en/stable/usage/streams.html
            pyodideInstance.setStdout({
                batched: (text: string) => this.redirectPyodideStdout(text),
            });
            // Designate a DOM element as the target for matplotlib, plotly or other plots supported by pyodide
            // as per https://github.com/pyodide/matplotlib-pyodide
            // @ts-ignore
            document.pyodideMplTarget = document.getElementById("pyodide-plot-target");
        });
    };

    redirectPyodideStdout = (text: string) => {
        const currentExecutingSection = "settings";
        if (currentExecutingSection) {
            this.setState((prevState) => ({
                pythonOutput: {
                    ...prevState.pythonOutput,
                    [currentExecutingSection]:
                        prevState.pythonOutput[currentExecutingSection] + text + "\n",
                },
            }));
        }
    };

    prepareMaterialData = () => {
        const { selectedMaterials } = this.state;
        return selectedMaterials.map((material, id) => {
            const materialConfig = material.toJSON();
            const materialPoscar = material.getAsPOSCAR();
            return {
                id,
                material: materialConfig,
                poscar: materialPoscar,
                metadata: material.metadata,
            };
        });
    };

    runPythonCode = async (pythonCode: string, options: any) => {
        this.setState({ pythonOutput: { settings: "" }, executionState: "running" });
        let result;

        try {
            const { pyodide } = this.state;
            result = await pyodide.runPythonAsync(pythonCode, options);
            this.setState({ executionState: "ready" });
            return result;
        } catch (error: any) {
            this.setState({
                pythonOutput: { settings: error.message + "\n" },
                executionState: "error",
            });
        }
    };

    updatePythonSection = (section: string, newContent: string) => {
        this.setState((prevState) => ({
            pythonCode: {
                ...prevState.pythonCode,
                [section]: newContent,
            },
        }));
    };

    handleRun = async () => {
        try {
            const { pyodide, pythonCode } = this.state;
            const materialsData = this.prepareMaterialData();
            const dataIn = { materials: materialsData };
            const convertedData = pyodide.toPy({ data_in: dataIn, data_out: {} });

            // Add indentation to the main body of the code
            // eslint-disable-next-line react/destructuring-assignment
            const { settings } = this.state.pythonCode;
            const indentedCode = settings
                .split("\n")
                .map((line) => `\t${line}`)
                .join("\n");

            // await this.runPythonCode(pythonCode.imports, {});
            const fullCode =
                pythonCode.imports +
                pythonCode.body +
                `async def main():\n${indentedCode}\n\tglobals()["data_out"]["materials"] = materials_out\n\treturn globals()\nawait main()
            `;
            console.log("FULL CODE:", fullCode);

            const result = await this.runPythonCode(fullCode, { globals: convertedData });
            if (!result) return;

            console.log("RESULT:", result.toJs());
            const dataOut = result.toJs().get("data_out");
            console.log("DATA OUT:", dataOut);
            const dataOutMap = this.mapToObject(dataOut);
            console.log("DATA OUT MAP:", dataOutMap);

            if (Array.isArray(dataOutMap.materials)) {
                const newMaterials = dataOutMap.materials.map((m: any) => {
                    console.log("M:", m);
                    const material = this.mapToObject(m);
                    const config = Made.parsers.poscar.fromPoscar(material.poscar);
                    const newMaterial = new Made.Material(config);
                    newMaterial.metadata = material.metadata;

                    return newMaterial;
                });
                this.setState({ newMaterials });
            } else {
                throw new Error("Expected materials output, but none was found.");
            }
        } catch (error: any) {
            NPMsAlert.error(error.message);
        }
    };

    handleSubmit = async () => {
        const { onSubmit } = this.props;
        const { newMaterials } = this.state;

        onSubmit(newMaterials);
    };

    mapToObject(map: Map<string, any>): PyodideDataMap {
        const obj: PyodideDataMap = {};
        map.forEach((value, key) => {
            if (value instanceof Map) {
                obj[key] = this.mapToObject(value);
            } else {
                obj[key] = value;
            }
        });
        return obj;
    }

    render() {
        const { pythonCodeFull, pythonCode, pythonOutput, materials, selectedMaterials } =
            this.state;
        const { show, onHide } = this.props;

        const { executionState } = this.state;
        const { newMaterials } = this.state;
        return (
            <Dialog
                id="python-transformation-dialog"
                open={show}
                onClose={onHide}
                fullWidth
                maxWidth="xl"
                onSubmit={this.handleSubmit}
                title="Python Transformation"
                isSubmitButtonDisabled={executionState !== "ready"}
            >
                <PyodideLoader onLoad={this.onPyodideLoad} triggerLoad={show} />
                <DialogContent sx={{ overflow: "hidden" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <Typography sx={{ fontFamily: "Monospace" }}>materials_in=</Typography>
                        </Grid>
                        <Grid item xs={10}>
                            <MaterialsSelector
                                materials={materials}
                                selectedMaterials={selectedMaterials}
                                setSelectedMaterials={(newMaterials) =>
                                    this.setState({ selectedMaterials: newMaterials })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={10}>
                            <TransformationSelector
                                pythonCode={pythonCodeFull}
                                url={GITHUB_API_URL}
                                setPythonCode={(newPythonCode) =>
                                    this.setState({ pythonCodeFull: newPythonCode })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <CodeExecutionControls
                                handleRun={this.handleRun}
                                executionState={executionState}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Paper
                                sx={{
                                    height: CODE_DISPLAY_HEIGHT,
                                    overflow: "scroll",
                                }}
                            >
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Grid container alignItems="center">
                                            <Grid item xs={9}>
                                                <Typography>Packages Import</Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <CodeExecutionControls
                                                    executionState="ready"
                                                    handleRun={() => {
                                                        console.log("running");
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <PythonCodeDisplay
                                            pythonCode={pythonCode.imports}
                                            pythonOutput={pythonOutput.imports}
                                            setPythonCode={(newContent) =>
                                                this.updatePythonSection("imports", newContent)
                                            }
                                        />
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                    <AccordionSummary>
                                        <Typography>Transformation Algorithm</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <PythonCodeDisplay
                                            pythonCode={pythonCode.body}
                                            pythonOutput={pythonOutput.body}
                                            setPythonCode={(newContent) =>
                                                this.updatePythonSection("body", newContent)
                                            }
                                        />
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion defaultExpanded>
                                    <AccordionSummary>
                                        <Typography>Settings and Execution</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <PythonCodeDisplay
                                            pythonCode={pythonCode.settings}
                                            pythonOutput={pythonOutput.settings}
                                            setPythonCode={(newContent) =>
                                                this.updatePythonSection("settings", newContent)
                                            }
                                        />
                                    </AccordionDetails>
                                </Accordion>
                            </Paper>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography sx={{ fontFamily: "Monospace" }}>materials_out=</Typography>
                        </Grid>
                        <Grid item xs={10}>
                            <MaterialsSelector
                                materials={newMaterials}
                                selectedMaterials={newMaterials}
                                setSelectedMaterials={(newMaterials) =>
                                    this.setState({ newMaterials })
                                }
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        );
    }
}

export default PythonTransformation;
