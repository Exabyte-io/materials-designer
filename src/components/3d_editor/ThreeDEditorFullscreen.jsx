import { ThreeDEditor } from "@exabyte-io/wave.js";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import setClass from "classnames";
import { mix } from "mixwith";
import PropTypes from "prop-types";
import React from "react";

import { FullscreenComponentMixin } from "../include/FullscreenComponentMixin";

export class ThreeDEditorFullscreen extends mix(ThreeDEditor).with(FullscreenComponentMixin) {
    getToolbarConfig() {
        const clsInstance = this;
        return [
            ...super.getToolbarConfig(),
            {
                id: "Fullscreen",
                title: "Fullscreen",
                leftIcon: <FullscreenIcon />,
                onClick: () => {
                    clsInstance.setState({ viewerTriggerResize: true });
                    clsInstance.toggleFullscreen();
                },
            },
        ];
    }

    getThreeDEditorClassNames() {
        const isFullscreenCls = this.state.isFullscreen ? "full-screen" : "";
        return setClass(super.getThreeDEditorClassNames(), isFullscreenCls);
    }

    onFullscreen(isFullscreen) {
        this.setState({
            isFullscreen,
            viewerTriggerResize: isFullscreen !== this.state.isFullscreen,
        });
    }
}

ThreeDEditorFullscreen.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    material: PropTypes.object,
    isConventionalCellShown: PropTypes.bool,
    onUpdate: PropTypes.func,
    editable: PropTypes.bool,
};
