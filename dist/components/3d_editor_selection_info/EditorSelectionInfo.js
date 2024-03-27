import { jsx as _jsx } from "react/jsx-runtime";
import Box from "@mui/material/Box";
import React from "react";
import { theme } from "../../settings";
export const FOOTER_HEIGHT = 54;
const EditorSelectionInfo = function EditorSelectionInfo() {
    return (_jsx(Box, { sx: {
            textAlign: "center",
            padding: 0,
            borderTop: `1px solid ${theme.palette.grey[800]}`,
            height: `${FOOTER_HEIGHT}px`,
        } }));
};
export default EditorSelectionInfo;
