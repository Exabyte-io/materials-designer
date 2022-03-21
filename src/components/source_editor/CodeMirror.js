import PropTypes from "prop-types";
import React from "react";

import CodeMirrorBase from "@uiw/react-codemirror";

export class CodeMirror extends React.Component {
    constructor(props) {
        super(props);
        this.handleContentChange = this.handleContentChange.bind(this);
    }

    /*
     * editor - CodeMirror object https://uiwjs.github.io/react-codemirror/
     * viewUpdate - object containing the update to the editor tree structure
     */
    handleContentChange(editor, viewUpdate) {
        console.log(viewUpdate);
        const { updateContent } = this.props;
        updateContent(editor.getValue());
    }

    render() {
        const { content, options, onFocus, onBlur } = this.props;
        return (
            <CodeMirrorBase
                value={content}
                onChange={(editor, viewUpdate) => {
                    this.handleContentChange(editor, viewUpdate);
                }}
                onFocus={onFocus}
                onBlur={onBlur}
                options={options}
            />
        );
    }
}

CodeMirror.propTypes = {
    content: PropTypes.string,
    updateContent: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    // eslint-disable-next-line react/forbid-prop-types
    options: PropTypes.object,
};

CodeMirror.defaultProps = {
    content: "",
    updateContent: () => {},
    onFocus: () => {},
    onBlur: () => {},
    options: {},
};
