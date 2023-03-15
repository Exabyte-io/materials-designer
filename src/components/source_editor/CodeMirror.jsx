import { StreamLanguage } from "@codemirror/language";
import { fortran } from "@codemirror/legacy-modes/mode/fortran";
import { androidstudio } from "@uiw/codemirror-theme-androidstudio";
import CodeMirrorBase from "@uiw/react-codemirror";
import PropTypes from "prop-types";
import React from "react";

class CodeMirror extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoaded: false };
        this.handleContentChange = this.handleContentChange.bind(this);
    }

    /*
     * editor - CodeMirror object https://uiwjs.github.io/react-codemirror/
     * viewUpdate - object containing the update to the editor tree structure
     */
    handleContentChange(newContent, viewUpdate) {
        const { isLoaded } = this.state;
        const { updateContent, updateOnFirstLoad } = this.props;
        // kludge for the way state management is handled in web-app
        if (!isLoaded && !updateOnFirstLoad && viewUpdate.origin === "setValue") {
            this.setState({ isLoaded: true });
            return;
        }

        updateContent(newContent);
    }

    render() {
        const { content, options, readOnly, onFocus, onBlur } = this.props;
        return (
            <CodeMirrorBase
                value={content}
                onChange={(editor, viewUpdate) => {
                    this.handleContentChange(editor, viewUpdate);
                }}
                onFocus={onFocus}
                onBlur={onBlur}
                readOnly={readOnly}
                lineNumbers={false}
                theme={androidstudio}
                basicSetup={options}
                extensions={[StreamLanguage.define(fortran)]}
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
    readOnly: PropTypes.bool,
};

CodeMirror.defaultProps = {
    content: "",
    updateOnFirstLoad: true,
    readOnly: false,
    updateContent: () => {},
    onFocus: () => {},
    onBlur: () => {},
    options: {},
};

export default CodeMirror;
