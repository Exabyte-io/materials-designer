import _ from "underscore";
import React from 'react';
import setClass from 'classnames';
import {Made} from "@exabyte-io/made.js";

import {displayMessage} from "../../i18n/messages";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/darcula.css";
import "codemirror/mode/fortran/fortran";
import CodeMirror from "react-codemirror";

class BasisText extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            content: this.props.content,
            isContentValidated: true,   // assuming that initial content is valid
            message: '',
            manualEditStarted: false,
        };
        this.onChange = _.debounce(this.props.onChange, 700);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.content !== nextProps.content) {
            this.reformatContentAndUpdateStateIfNoManualEdit(nextProps.content);
        }

    }

    isContentPassingValidation(content) {
        try {
            Made.parsers.xyz.validate(content);
            // only show the success message first time after last failure
            if (!this.state.isContentValidated) {
                this.setState({
                    isContentValidated: true,
                    // TODO: consider removing the success message after a timeout period
                    message: displayMessage('basis.validationSuccess')
                });
            } else {
                // already validated before -> remove message
                this.setState({message: ''});
            }
        } catch (err) {
            this.setState({
                isContentValidated: false,
                message: displayMessage('basis.validationError')
            });
            return false;
        }
        return true;
    }

    reformatContentAndUpdateStateIfNoManualEdit = (newContent) => {
        // Change state only if user is not editing basis
        if (!this.state.manualEditStarted && this.state.content !== newContent) {
            // NOTE: from v 1.0.0 ReactCodeMirror is not handling the content updates properly (thus use v0.3.0)
            // https://github.com/JedWatson/react-codemirror/issues/106
            this.setState({
                content: newContent,
                // assuming that the content passed here is safe and valid
                message: "",
                isContentValidated: true,
            })
        }
    };

    handleContentChange = (content) => {
        this.setState({content}, () => {
            if (this.isContentPassingValidation(content)) {
                this.props.onChange(content);
            }
        });
    };

    render() {
        return (
            <div className={setClass("xyz", this.props.className || "")}>
                <div id="basis-xyz">
                    <CodeMirror className="xyz-codemirror"
                        value={this.state.content}
                        onFocusChange={(isFocused) => {
                            if (isFocused) {
                                this.setState({manualEditStarted: true})
                            } else {
                                this.setState({manualEditStarted: false});
                                this.reformatContentAndUpdateStateIfNoManualEdit(this.props.content);
                            }
                        }}
                        onChange={this.handleContentChange}
                        options={{
                            theme: "darcula",
                            lineNumbers: true,
                            readOnly: this.props.readOnly,
                            mode: 'fortran',
                            ...this.props.codeMirrorOptions,
                        }}
                    />
                    <div className="col-xs-12 p-5 text-center">
                        <span className={this.state.isContentValidated ? "text-success" : "text-danger"}>
                            {this.state.message}&nbsp;
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

BasisText.propTypes = {
    content: React.PropTypes.string,
    readOnly: React.PropTypes.bool,
    codeMirrorOptions: React.PropTypes.object,
    onFocusChange: React.PropTypes.func,
    onChange: React.PropTypes.func,
};

BasisText.defaultProps = {
    readOnly: false,
    content: "---- No content passed ----\n",
    codeMirrorOptions: {},
    onFocus: () => {},
    onBlur: () => {},
    onChange: () => {},
};

export default BasisText;
