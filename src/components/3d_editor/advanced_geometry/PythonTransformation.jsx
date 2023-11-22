import PyodideLoader from "@exabyte-io/cove.js/dist/other/pyodide";
import Dialog from "@mui/material/Dialog";
import PropTypes from "prop-types";
import React from "react";

class PythonTransformation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pyodide: null,
        };
    }

    onLoad = (pyodideInstance) => {
        this.setState({ pyodide: pyodideInstance });
    };

    render() {
        const { show, onHide } = this.props;

        return (
            <>
                <PyodideLoader onLoad={this.onLoad} triggerLoad={show} />
                <Dialog
                    open={show}
                    onClose={onHide}
                    fullWidth
                    maxWidth="lg"
                    PaperProps={{ sx: { width: "60vw", height: "60vh", padding: "20px" } }}
                >
                    {/* eslint-disable-next-line react/destructuring-assignment */}
                    <div>{this.state.pyodide ? "Pyodide is loaded" : "Pyodide is not loaded"}</div>
                </Dialog>
            </>
        );
    }
}

PythonTransformation.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
};

export default PythonTransformation;
