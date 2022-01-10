import setClass from "classnames";
import PropTypes from "prop-types";
import React from "react";

import BasisEditor from "./Basis";
import LatticeEditor from "./Lattice";

class SourceEditor extends React.Component {
    render() {
        return (
            <div
                className={setClass(this.props.className, "materials-designer-source-editor")}
                style={{
                    // TODO: move out of here
                    borderLeft: "1px solid",
                    borderRight: "1px solid",
                }}
            >
                <LatticeEditor
                    className="col-xs-12 p-0"
                    material={this.props.material}
                    onUpdate={this.props.onUpdate}
                />
                <BasisEditor
                    className="col-xs-12 p-0"
                    material={this.props.material}
                    onUpdate={this.props.onUpdate}
                />
            </div>
        );
    }
}

SourceEditor.propTypes = {
    editable: PropTypes.bool.isRequired,
    showToolbar: PropTypes.bool,

    material: PropTypes.object.isRequired,
    index: PropTypes.number,
    length: PropTypes.number,

    onUpdate: PropTypes.func,
    onAdd: PropTypes.func,
    onRemove: PropTypes.func,
    onUpdateIndex: PropTypes.func,
};

export default SourceEditor;
