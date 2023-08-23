import { StreamLanguage } from "@codemirror/language";
import { fortran } from "@codemirror/legacy-modes/mode/fortran";
import { linter } from "@codemirror/lint";
import { darcula } from "@uiw/codemirror-theme-darcula";
import CodeMirrorBase from "@uiw/react-codemirror";
import PropTypes from "prop-types";
import React from "react";

class CodeMirror extends React.Component {
    constructor(props) {
        super(props);
        this.editorRef = React.createRef();
        this.state = { isLoaded: false };
        this.handleContentChange = this.handleContentChange.bind(this);
    }

    componentDidMount() {
        const { forwardedRef } = this.props;
        if (forwardedRef) {
            forwardedRef.current = this.editorRef.current;
        }
    }

    componentDidUpdate() {
        const { forwardedRef } = this.props;
        if (forwardedRef) {
            forwardedRef.current = this.editorRef.current;
        }
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
        const { content, options, readOnly, onFocus, onBlur, customLinter } = this.props;
        return (
            <CodeMirrorBase
                ref={this.editorRef}
                value={content}
                onChange={(editor, viewUpdate) => {
                    this.handleContentChange(editor, viewUpdate);
                }}
                onFocus={onFocus}
                onBlur={onBlur}
                readOnly={readOnly}
                lineNumbers={false}
                theme={darcula}
                // basicSetup={options}
                extensions={[StreamLanguage.define(fortran), linter(customLinter)]}
                options={{
                    ...options,
                    gutters: ["CodeMirror-lint-markers"],
                    lint: {
                        getAnnotations: customLinter,
                        async: false,
                    },
                }}
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
    customLinter: PropTypes.func,
    forwardedRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    ]),
};

CodeMirror.defaultProps = {
    content: "",
    updateOnFirstLoad: true,
    readOnly: false,
    updateContent: () => {},
    onFocus: () => {},
    onBlur: () => {},
    options: {},
    customLinter: () => [],
    forwardedRef: null,
};

export default CodeMirror;
