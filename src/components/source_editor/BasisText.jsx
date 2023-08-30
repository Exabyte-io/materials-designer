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
            checks: props.checks,
            isContentValidated: true, // assuming that initial content is valid
            message: "",
            manualEditStarted: false,
        };
        this.updateContent = this.updateContent.bind(this);
        this.codeMirrorRef = React.createRef();
        this.customLinter = this.customLinter.bind(this);
        // TODO: adjust tests to accommodate for the delay and re-enable
        // this.updateContent = _.debounce(this.updateContent, 700);
    }

    // eslint-disable-next-line no-unused-vars
    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        const { content, checks } = this.props;
        if (content !== nextProps.content) {
            this.reformatContentAndUpdateStateIfNoManualEdit(nextProps.content);
        }
        if (checks !== nextProps.checks) {
            this.setState({ checks: nextProps.checks });
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
        const { manualEditStarted, content } = this.state;
        // Change state only if user is not editing basis
        if (!manualEditStarted && content !== newContent) {
            // NOTE: from v 1.0.0 ReactCodeMirror is not handling the content updates properly (thus use v0.3.0)
            // https://github.com/JedWatson/react-codemirror/issues/106
            this.setState({
                content: newContent,
                // assuming that the content passed here is safe and valid
                message: "",
                isContentValidated: true,
            });
        }
    };

    updateContent(newContent) {
        const { onChange, content } = this.props;
        // Avoid triggering update actions when content is set from props
        if (content === newContent) return;
        this.setState({ content: newContent }, () => {
            if (this.isContentPassingValidation(newContent)) {
                onChange(newContent);
            }
        });
    }

    customLinter(editorView) {
        const { checks } = this.state;
        const { doc } = editorView.state;

        if (checks.length === 0 || !doc) return [];

        const warnings = checks.map((check) => {
            // TODO: wrap in a mixin with named functions for this
            const lineNumber = check.id + 1; // codemirror counts from 1
            return {
                message: check.message,
                severity: check.type,
                from: doc.line(lineNumber).from,
                to: doc.line(lineNumber).to,
            };
        });

        return warnings;
    }

    render() {
        const { className, readOnly, codeMirrorOptions } = this.props;
        const { content, isContentValidated, message } = this.state;
        return (
            <div className={setClass("xyz", className)}>
                <div id="basis-xyz">
                    <CodeMirror
                        forwardedRef={this.codeMirrorRef}
                        customLinter={this.customLinter}
                        className="xyz-codemirror"
                        // eslint-disable-next-line react/no-unused-class-component-methods
                        content={content}
                        updateContent={this.updateContent}
                        onFocus={() => this.setState({ manualEditStarted: true })}
                        onBlur={() => this.setState({ manualEditStarted: false })}
                        readOnly={readOnly}
                        options={{
                            lineNumbers: true,
                            ...codeMirrorOptions,
                        }}
                        theme="dark"
                        completions={() => {}}
                        updateOnFirstLoad
                        language="exaxyz"
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
    // eslint-disable-next-line react/forbid-prop-types
    checks: PropTypes.object,
    readOnly: PropTypes.bool,
    // eslint-disable-next-line react/forbid-prop-types
    codeMirrorOptions: PropTypes.object,
    onChange: PropTypes.func,
};

BasisText.defaultProps = {
    className: "",
    readOnly: false,
    content: "---- No content passed ----\n",
    checks: {},
    codeMirrorOptions: {},
    onChange: () => {},
};

export default BasisText;
