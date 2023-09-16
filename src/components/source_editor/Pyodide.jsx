import CodeMirror from "@exabyte-io/cove.js/dist/other/codemirror/CodeMirror";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import setClass from "classnames";
import PropTypes from "prop-types";
// eslint-disable-next-line no-unused-vars
// import { loadPyodide } from "pyodide";
import React from "react";

class Pyodide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pythonCode: "",
            result: "",
        };
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.runPythonCode = this.runPythonCode.bind(this);
    }

    async componentDidMount() {
        async function main() {
            const pyodide = await window.loadPyodide();
            await pyodide.loadPackage("numpy");
            await pyodide.loadPackage("micropip");
            const micropip = pyodide.pyimport("micropip");
            await micropip.install("ase");
        }
        await main();
    }

    handleCodeChange(newContent) {
        this.setState({ pythonCode: newContent });
    }

    async runPythonCode() {
        const { pythonCode } = this.state;
        const pyodide = await window.loadPyodide();
        const result = await pyodide.runPythonAsync(pythonCode);
        this.setState({ result });
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
                        <TextField fullWidth value={result} rows={5} />
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
