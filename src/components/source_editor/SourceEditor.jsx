import setClass from "classnames";
import PropTypes from "prop-types";
import React from "react";

import BasisEditor from "./Basis";
import LatticeEditor from "./Lattice";
import Pyodide from "./Pyodide.jsx";

// eslint-disable-next-line react/prefer-stateless-function
class SourceEditor extends React.Component {
    render() {
        const { className, material, onUpdate } = this.props;
        return (
            <div
                className={setClass(className, "materials-designer-source-editor")}
                style={{
                    // TODO: move out of here
                    borderLeft: "1px solid",
                    borderRight: "1px solid",
                }}
            >
                <LatticeEditor className="col-xs-12 p-0" material={material} onUpdate={onUpdate} />
                <BasisEditor className="col-xs-12 p-0" material={material} onUpdate={onUpdate} />
                <Pyodide className="col-xs-12 p-0" />
            </div>
        );
    }
}

SourceEditor.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    material: PropTypes.object.isRequired,
    className: PropTypes.string.isRequired,
    onUpdate: PropTypes.func.isRequired,
};

export default SourceEditor;
