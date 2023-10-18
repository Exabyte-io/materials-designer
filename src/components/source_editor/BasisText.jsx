// import _ from "underscore";
/* eslint-disable react/sort-comp */
import CodeMirror from "@exabyte-io/cove.js/dist/other/codemirror/CodeMirror";
import { Made } from "@exabyte-io/made.js";
import setClass from "classnames";
import PropTypes from "prop-types";
import React from "react";

import { displayMessage } from "../../i18n/messages";

class BasisText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: props.content,
            isContentValidated: true, // assuming that initial content is valid
            message: "",
        };
        this.codeMirrorRef = React.createRef();
        this.updateContent = this.updateContent.bind(this);
        // TODO: adjust tests to accommodate for the delay and re-enable
        // this.updateContent = _.debounce(this.updateContent, 700);
    }

    // eslint-disable-next-line no-unused-vars
    componentDidUpdate(prevProps, prevState) {
        console.log("BasisText componentDidUpdate");
        const { content } = this.props;
        if (prevProps.content !== content) {
            // eslint-disable-next-line react/destructuring-assignment
            const isEditing = this.codeMirrorRef.current?.state.isEditing;
            if (!isEditing) this.reformatContentAndUpdateStateIfNoManualEdit(content);
        }
    }

    validateContent = (content) => {
        try {
            Made.parsers.xyz.validate(content);
            return true;
        } catch (e) {
            return false;
        }
    };

    isContentPassingValidation(content) {
        const { isContentValidated } = this.state;
        const isValid = this.validateContent(content);
        let message = displayMessage("basis.validationError");
        if (isValid) {
            // if not previously validated, display success, otherwise remove message
            message = !isContentValidated ? displayMessage("basis.validationSuccess") : "";
        }
        this.setState({ isContentValidated: isValid, message });
        return isValid;
    }

    reformatContentAndUpdateStateIfNoManualEdit = (newContent) => {
        const codeMirrorState = this.codeMirrorRef.current?.state;
        const { content, isEditing } = codeMirrorState;
        // Change state only if user is not editing basis
        if (!isEditing && content !== newContent) {
            this.setState({
                content: newContent,
                // assuming that the content passed here is safe and valid
                message: "",
                isContentValidated: true,
            });
        }
    };

    updateContent() {
        const { onChange, content } = this.props;
        const newContent = this.codeMirrorRef.current?.state.content;
        // Avoid triggering update actions when content is set from props
        if (content === newContent) return;
        this.setState(() => {
            if (this.isContentPassingValidation(newContent)) {
                onChange(newContent);
            }
        });
    }

    render() {
        const { className, readOnly, codeMirrorOptions } = this.props;
        const { content, isContentValidated, message } = this.state;
        return (
            <div className={setClass("xyz", className)}>
                <div id="basis-xyz">
                    <CodeMirror
                        ref={this.codeMirrorRef}
                        className="xyz-codemirror"
                        // eslint-disable-next-line react/no-unused-class-component-methods
                        content={content}
                        updateContent={(newContent) => this.updateContent(newContent)}
                        readOnly={readOnly}
                        options={{
                            lineNumbers: true,
                            ...codeMirrorOptions,
                        }}
                        theme="dark"
                        completions={() => {}}
                        updateOnFirstLoad
                        language="fortran"
                    />
                    <div className="col-xs-12 p-5 text-center">
                        <span className={isContentValidated ? "text-success" : "text-danger"}>
                            {message}&nbsp;
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

BasisText.propTypes = {
    className: PropTypes.string,
    content: PropTypes.string,
    readOnly: PropTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types
    codeMirrorOptions: PropTypes.object,
    onChange: PropTypes.func,
};

BasisText.defaultProps = {
    className: "",
    readOnly: false,
    content: "---- No content passed ----\n",
    codeMirrorOptions: {},
    onChange: () => {},
};

export default BasisText;
