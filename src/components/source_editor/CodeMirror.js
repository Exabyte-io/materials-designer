import PropTypes from "prop-types";
import React from "react";

import CodeMirrorBase from "@uiw/react-codemirror";

export default class CodeMirror extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoaded: false };
        this.handleContentChange = this.handleContentChange.bind(this);
    }

    /*
     * editor - CodeMirror object https://uiwjs.github.io/react-codemirror/
     * viewUpdate - object containing the update to the editor tree structure
     */
    handleContentChange(editor, viewUpdate) {
        const { isLoaded } = this.state;
        const { updateContent, updateOnFirstLoad } = this.props;
        // kludge for the way state management is handled in web-app
        if (!isLoaded && !updateOnFirstLoad && viewUpdate.origin === "setValue") {
            this.setState({ isLoaded: true });
            return;
        }
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
    updateOnFirstLoad: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    // eslint-disable-next-line react/forbid-prop-types
    options: PropTypes.object,
};

CodeMirror.defaultProps = {
    content: "",
    updateOnFirstLoad: true,
    updateContent: () => {},
    onFocus: () => {},
    onBlur: () => {},
    options: {},
};
