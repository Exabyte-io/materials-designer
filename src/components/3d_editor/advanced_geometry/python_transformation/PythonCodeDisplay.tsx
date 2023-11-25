import CodeMirror from "@exabyte-io/cove.js/dist/other/codemirror";
import theme from "@exabyte-io/cove.js/dist/theme";
import Box from "@mui/material/Box";
import React from "react";

interface PythonCodeDisplayProps {
    pythonCode: string;
    pythonOutput: string;
    setPythonCode: (pythonCode: string) => void;
}

const PythonCodeDisplay = (props: PythonCodeDisplayProps) => {
    const { pythonCode, pythonOutput, setPythonCode } = props;
    // @ts-ignore
    return (
        <>
            <Box
                id="python-code-input"
                sx={{
                    border: `1px solid ${theme.palette.secondary.light}`,
                }}
            >
                {pythonCode && (
                    // eslint-disable-next-line no-irregular-whitespace
                    /* Figure out how to fix errors and remove ts-ignore:
                       JSX element class does not support attributes because it does not have a 'props' property.
                       'CodeMirror' cannot be used as a JSX component.  instance type 'CodeMirror' is
                        not a valid JSX element. type 'CodeMirror' is missing the following properties
                        from type 'ElementClass': context, setState, forceUpdate, props, and 2 more.
                    */
                    // @ts-ignore
                    <CodeMirror
                        content={pythonCode}
                        updateContent={(newContent: string) => setPythonCode(newContent)}
                        options={{
                            lineNumbers: true,
                        }}
                        theme="light"
                        language="python"
                    />
                )}
            </Box>
            <Box id="python-output" mt={theme.spacing(1)}>
                {pythonOutput && (
                    // @ts-ignore
                    <CodeMirror
                        content={pythonOutput}
                        readOnly
                        options={{
                            lineNumbers: false,
                        }}
                        theme="light"
                        language="python"
                    />
                )}
            </Box>
        </>
    );
};

export default PythonCodeDisplay;
