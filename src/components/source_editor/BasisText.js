/* eslint-disable react/sort-comp */
import "codemirror/lib/codemirror.css";
import "codemirror/theme/darcula.css";
import "codemirror/mode/fortran/fortran";

import { Made } from "@exabyte-io/made.js";
import setClass from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { CodeMirror } from "./CodeMirror";

import { displayMessage } from "../../i18n/messages";

class BasisText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: props.content,
            isContentValidated: true, // assuming that initial content is valid
            message: "",
            manualEditStarted: false,
        };
        this.updateContent = this.updateContent.bind(this);
    }

    // eslint-disable-next-line no-unused-vars
    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        const { content } = this.props;
        if (content !== nextProps.content) {
            this.reformatContentAndUpdateStateIfNoManualEdit(nextProps.content);
        }
    }

    isContentPassingValidation(content) {
        const { isContentValidated } = this.state;
        try {
            Made.parsers.xyz.validate(content);
            // only show the success message first time after last failure
            if (!isContentValidated) {
                this.setState({
                    isContentValidated: true,
                    // TODO: consider removing the success message after a timeout period
                    message: displayMessage("basis.validationSuccess"),
                });
            } else {
                // already validated before -> remove message
                this.setState({ message: "" });
            }
        } catch (err) {
            this.setState({
                isContentValidated: false,
                message: displayMessage("basis.validationError"),
            });
            return false;
        }
        return true;
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

    updateContent(content) {
        const { onChange } = this.props;
        this.setState({ content }, () => {
            if (this.isContentPassingValidation(content)) {
                onChange(content);
            }
        });
    }

    render() {
        const { className, readOnly, codeMirrorOptions } = this.props;
        const { content, isContentValidated, message } = this.state;
        console.log("BasisText render", content);
        return (
            <div className={setClass("xyz", className)}>
                <div id="basis-xyz">
                    <CodeMirror
                        className="xyz-codemirror"
                        // eslint-disable-next-line react/no-unused-class-component-methods
                        ref={(el) => (this.codeMirrorComponent = el)}
                        content={content}
                        updateContent={this.updateContent}
                        onFocus={() => this.setState({ manualEditStarted: true })}
                        onBlur={() => this.setState({ manualEditStarted: false })}
                        options={{
                            theme: "darcula",
                            lineNumbers: true,
                            readOnly,
                            mode: "fortran",
                            ...codeMirrorOptions,
                        }}
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
