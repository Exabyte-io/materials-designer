import theme from "@exabyte-io/cove.js/dist/theme";
import Box from "@mui/material/Box";
import React from "react";

export const FOOTER_HEIGHT = 54;

const EditorSelectionInfo = function EditorSelectionInfo() {
    return (
        <Box
            sx={{
                textAlign: "center",
                padding: 0,
                borderTop: `1px solid ${theme.palette.grey[800]}`,
                height: `${FOOTER_HEIGHT}px`,
            }}
        />
    );
};

export default EditorSelectionInfo;
