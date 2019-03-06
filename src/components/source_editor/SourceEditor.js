import $ from "jquery";
import React from 'react';
import setClass from "classnames";

import BasisEditor from './Basis';
import LatticeEditor from './Lattice';

class SourceEditor extends React.Component {

    render() {
        return (
            <div className={setClass(this.props.className, 'materials-designer-source-editor')}
                style={{
                    // TODO: move out of here
                    borderLeft: '1px solid',
                    borderRight: '1px solid',
                }}

            >
                <LatticeEditor className="col-xs-12 p-0"
                    material={this.props.material}
                    onUpdate={this.props.onUpdate}
                />
                <BasisEditor className="col-xs-12 p-0"
                    material={this.props.material}
                    onUpdate={this.props.onUpdate}
                />
            </div>
        )
    }
}

SourceEditor.propTypes = {

    editable: React.PropTypes.bool.isRequired,
    showToolbar: React.PropTypes.bool,

    material: React.PropTypes.object.isRequired,
    index: React.PropTypes.number,
    length: React.PropTypes.number,

    onUpdate: React.PropTypes.func,
    onAdd: React.PropTypes.func,
    onRemove: React.PropTypes.func,
    onUpdateIndex: React.PropTypes.func,

};

export default SourceEditor;
