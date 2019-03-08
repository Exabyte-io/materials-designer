import React from "react";
import setClass from "classnames";

import FullscreenHandlerComponent from "./fullscreen";
import {triggerChartsResize} from "../../utils/charts";

export const FullscreenComponentMixin = (superclass) => class extends superclass {

    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            isFullscreen: false,
        };
        this.onFullscreen = this.onFullscreen.bind(this);
        this.goFullscreen = this.goFullscreen.bind(this);
    }

    goFullscreen() {
        this.setState({
            isFullscreen: true
        });
        triggerChartsResize();
    }

    get FullscreenHandlerComponent() {return FullscreenHandlerComponent}

    onFullscreen(isFullscreen) {this.setState({isFullscreen})}

    render() {
        return (
            <this.FullscreenHandlerComponent
                className={setClass(this.props.className)}
                enabled={this.state.isFullscreen}
                onChange={this.onFullscreen}
            >
                {super.render()}
            </this.FullscreenHandlerComponent>
        )

    }

};

