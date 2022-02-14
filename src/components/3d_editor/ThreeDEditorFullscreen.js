import { ThreeDEditor } from "@exabyte-io/wave.js";
import { RoundIconButton } from "@exabyte-io/wave.js/dist/components/RoundIconButton";
import { Fullscreen } from "material-ui-icons-next";
import setClass from "classnames";
import { mix } from "mixwith";
import PropTypes from "prop-types";
import React from "react";

import { FullscreenComponentMixin } from "../include/FullscreenComponentMixin";

export class ThreeDEditorFullscreen extends mix(ThreeDEditor).with(FullscreenComponentMixin) {
    getExportToolbarItems() {
        const clsInstance = this;
        return [
            ...super.getExportToolbarItems(),
            <RoundIconButton
                key="fullscreen"
                tooltipPlacement="top"
                mini
                title="Fullscreen"
                isToggleable={false}
                onClick={() => {
                    clsInstance.setState({ viewerTriggerResize: true });
                    clsInstance.goFullscreen();
                }}
            >
                <Fullscreen />
            </RoundIconButton>,
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
