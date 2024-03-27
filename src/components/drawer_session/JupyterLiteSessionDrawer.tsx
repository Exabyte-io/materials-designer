import ResizableDrawer from "@exabyte-io/cove.js/dist/mui/components/custom/resizable-drawer/ResizableDrawer";
import JupyterLiteSession from "@exabyte-io/cove.js/dist/other/jupyterlite/JupyterLiteSession";
import React from "react";

import BaseJupyterLiteSessionComponent from "../include/jupyterlite/BaseJupyterLiteComponent";

class JupyterLiteSessionDrawer extends BaseJupyterLiteSessionComponent {
    render() {
        const { show, onHide, containerRef } = this.props;

        return (
            <div style={{ display: show ? "block" : "none" }}>
                <ResizableDrawer open={show} onClose={onHide} containerRef={containerRef}>
                    <JupyterLiteSession
                        originURL="https://jupyterlite.mat3ra.com"
                        defaultNotebookPath={this.DEFAULT_NOTEBOOK_PATH}
                        messageHandler={this.messageHandler}
                    />
                </ResizableDrawer>
            </div>
        );
    }
}

export default JupyterLiteSessionDrawer;
