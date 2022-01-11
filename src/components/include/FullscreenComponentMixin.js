import setClass from "classnames";
import React from "react";

import { triggerChartsResize } from "../../utils/charts";
import FullscreenHandlerComponent from "./fullscreen";

export const FullscreenComponentMixin = (superclass) =>
    class extends superclass {
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
                isFullscreen: true,
            });
            triggerChartsResize();
        }

        // eslint-disable-next-line class-methods-use-this
        get FullscreenHandlerComponent() {
            return FullscreenHandlerComponent;
        }

        onFullscreen(isFullscreen) {
            this.setState({ isFullscreen });
        }

        render() {
            return (
                <this.FullscreenHandlerComponent
                    className={setClass(this.props.className)}
                    enabled={this.state.isFullscreen}
                    onChange={this.onFullscreen}
                >
                    {super.render()}
                </this.FullscreenHandlerComponent>
            );
        }
    };
