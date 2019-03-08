import React from "react";
import Fullscreen from "react-full-screen";

class FullscreenHandlerComponent extends Fullscreen {

    render() {return <div className={this.props.className}>{super.render()}</div>}

}

export default FullscreenHandlerComponent
