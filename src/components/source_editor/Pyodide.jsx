// eslint-ignore-file
import CodeMirror from "@exabyte-io/cove.js/dist/other/codemirror/CodeMirror";
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
import micropip
print(globals())

global my_dict
my_dict = {"name": "pyodide"}

def func():
    return my_dict


func()
            #micropip.install("https://files.mat3ra.com:44318/web/pyodide/pymatgen-2023.9.10-py3-none-any.whl")
            `,
            result: "",
        };
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.runPythonCode = this.runPythonCode.bind(this);
    }

    async componentDidMount() {
        this.setState({ isLoading: true });
        this.pyodide = await window.loadPyodide();
        await this.pyodide.loadPackage("numpy");
        await this.pyodide.loadPackage("micropip");
        const micropip = this.pyodide.pyimport("micropip");
        await micropip.install("ase");
        this.setState({ isLoading: false });
    }

    handleCodeChange(newContent) {
        this.setState({ pythonCode: newContent });
    }

    async runPythonCode() {
        // eslint-disable-next-line no-unused-vars
        const { pythonCode } = this.state;
        // eslint-disable-next-line no-undef,react/destructuring-assignment
        const convertedData = this.pyodide.toPy({ material: this.props.material.toJSON() });
        try {
            const result = await this.pyodide.runPythonAsync(pythonCode, {
                globals: convertedData,
            });
            const dict = await this.pyodide.globals.toJs();
            console.log("dict:", dict);
            console.log("RESULT:", result);
        } catch (error) {
            console.error("Error executing Python code:", error);
        }
    }

    render() {
        const { className } = this.props;
        // eslint-disable-next-line no-unused-vars
        const { result, pythonCode } = this.state;
        const { isLoading } = this.state;
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
                        onClick={this.runPythonCode}
                    >
                        Run Code
                    </Button>
                    <Box style={{ marginTop: "10px" }}>
                        {/* <CodeMirror */}
                        {/*    className="result-codemirror" */}
                        {/*    content={result} */}
                        {/*    updateContent={() => {}} */}
                        {/*    readOnly */}
                        {/*    rows={5} */}
                        {/*    options={{ */}
                        {/*        lineNumbers: false, */}
                        {/*    }} */}
                        {/*    theme="dark" */}
                        {/* /> */}
                    </Box>
                </AccordionDetails>
            </Accordion>
        );
    }
}

Pyodide.propTypes = {
    className: PropTypes.string.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    material: PropTypes.object.isRequired,
};

export default Pyodide;
