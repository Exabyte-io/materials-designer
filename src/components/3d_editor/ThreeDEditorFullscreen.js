import React from 'react';
import {mix} from "mixwith";
import setClass from "classnames";
import {ThreeDEditor} from "wave";
import {Fullscreen,} from 'material-ui-icons-next';

import {FullscreenComponentMixin} from "/imports/ui/exports";

export class ThreeDEditorFullscreen extends mix(ThreeDEditor).with(FullscreenComponentMixin) {

    constructor(props) {
        super(props);
    }

    getExportToolbarItems() {
        const clsInstance = this;
        return [
            ...super.getExportToolbarItems(),
            this.getRoundIconButton("Fullscreen", "top", () => {
                clsInstance.setState({viewerTriggerResize: true});
                clsInstance.goFullscreen();
            }, <Fullscreen/>)
        ]
    }

    getThreeDEditorClassNames() {
        const isFullscreenCls = (this.state.isFullscreen) ? "full-screen" : "";
        return setClass(super.getThreeDEditorClassNames(), isFullscreenCls);
    }

    onFullscreen(isFullscreen) {
        this.setState({
            isFullscreen,
            viewerTriggerResize: isFullscreen !== this.state.isFullscreen
        })
    }
}

ThreeDEditorFullscreen.propTypes = {
    material: React.PropTypes.object,
    onUpdate: React.PropTypes.func,
    editable: React.PropTypes.bool
};
