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
            pythonCode: 'value = sharedData["key"]\nvalue',
            result: "",
            sharedData: { key: "value" },
        };
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.runPythonCode = this.runPythonCode.bind(this);
    }

    async componentDidMount() {
        this.pyodide = await window.loadPyodide();
        await this.pyodide.loadPackage("numpy");
        await this.pyodide.loadPackage("micropip");
        const micropip = this.pyodide.pyimport("micropip");
        await micropip.install("ase");
    }

    handleCodeChange(newContent) {
        this.setState({ pythonCode: newContent });
    }

    async runPythonCode() {
        const { pythonCode, sharedData } = this.state;
        this.pyodide.globals.sharedData = this.pyodide.toPy(sharedData);
        try {
            const result = await this.pyodide.runPythonAsync(pythonCode);
            const modifiedSharedData = this.pyodide.globals.sharedData;

            // Update React's state with the modified data from Python
            this.setState({
                result,
                sharedData: modifiedSharedData,
            });
        } catch (error) {
            console.error("Error executing Python code:", error);
            // Handle the error, e.g., by setting an error state or displaying a message
        }
    }

    render() {
        const { className } = this.props;
        const { result, pythonCode } = this.state;
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
                        style={{ marginTop: "10px" }}
                        onClick={this.runPythonCode}
                    >
                        Run Code
                    </Button>
                    <Box style={{ marginTop: "10px" }}>
                        <CodeMirror
                            className="result-codemirror"
                            content={result}
                            updateContent={() => {}}
                            readOnly
                            rows={5}
                            options={{
                                lineNumbers: false,
                            }}
                            theme="dark"
                            language="text"
                        />
                    </Box>
                </AccordionDetails>
            </Accordion>
        );
    }
}

Pyodide.propTypes = {
    className: PropTypes.string.isRequired,
};

export default Pyodide;
