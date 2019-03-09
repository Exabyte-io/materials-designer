import React from 'react';
import ReactDOM from 'react-dom';

// Load styling, bootstrap needs to be loaded first
import 'bootstrap/dist/css/bootstrap.css';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css';
import "wave/dist/stylesheets/wave.css";
import "./stylesheets/main.scss";

import {MaterialsDesignerContainer} from './MaterialsDesignerContainer';

ReactDOM.render(<MaterialsDesignerContainer/>, document.getElementById('root'));
