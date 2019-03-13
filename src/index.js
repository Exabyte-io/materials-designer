import React from 'react';
import ReactDOM from 'react-dom';

// Load styling, bootstrap needs to be loaded first
import 'bootstrap/dist/css/bootstrap.css';
import "./stylesheets/main.scss";

import {MaterialsDesignerContainer} from './MaterialsDesignerContainer';

ReactDOM.render(<MaterialsDesignerContainer/>, document.getElementById('root'));
