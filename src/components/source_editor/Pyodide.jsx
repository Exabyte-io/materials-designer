import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import setClass from "classnames";
import PropTypes from "prop-types";
import { loadPyodide } from "pyodide";
import React from "react";

class Pyodide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pythonCode: "",
            result: "",
        };
    }

    async componentDidMount() {
        async function main() {
            const pyodide = await loadPyodide();
            console.log(pyodide.runPython("import sys\nsys.version"));
            pyodide.runPython("print('Hello from Python!')");
        }
        main();
    }

    handleChange(event) {
        this.setState({ pythonCode: event.target.value });
    }

    async runPythonCode() {
        const pyodide = await loadPyodide();
        const { pythonCode } = this.state;
        const result = await pyodide.runPythonAsync(pythonCode);
        this.setState({ result });
    }

    render() {
        const { className } = this.props;
        const { result, pythonCode } = this.state;
        return (
            <Accordion defaultExpanded className={setClass(className, "crystal-basis")}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>Pyodide</AccordionSummary>
                <AccordionDetails
                    style={{
                        display: "block",
                        height: "100%",
                    }}
                >
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        placeholder="Enter Python code here..."
                        value={pythonCode}
                        onChange={(e) => this.handleChange(e)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: "10px" }}
                        onClick={() => this.runPythonCode()}
                    >
                        Run Code
                    </Button>
                    <Box style={{ marginTop: "10px" }}>
                        <code>Python Output: {result}</code>
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
