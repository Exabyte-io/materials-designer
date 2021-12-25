[![npm version](https://badge.fury.io/js/%40exabyte-io%2Fmaterials-designer.svg)](https://badge.fury.io/js/%40exabyte-io%2Fmaterials-designer)
[![License: Apache](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

# Materials Designer

This a standalone react/redux application for atomistic material structures design. Used within the Exabyte.io platform as explained in the corresponding part of its documentatation [here](https://docs.exabyte.io/materials-designer/overview/).

![Materials Designer in action](https://docs.exabyte.io/images/materials-designer/CreateMaterialSupercell.gif "Materials Designer in action")

## Functionality

As below:

- Input/Output Menu
    - Export materials in JSON/POSCAR formats
- Edit Menu
    - Undo/Redo/Reset/Clone operations
- View
    - Fullscreen mode
- Advanced Menu
    - Creating supercell
    - Creating combinatorial set
    - Creating interpolated set
    - Creating surface/slab
- Basis Editor
    - Adding/Removing/Modifying sites
    - Adding/Removing/Modifying atomic constraints
    - Switching Crystal/Cartesian units
- Lattice Editor
    - Adjusting lattice units/types/parameters

- 3D Editor
    - Visualizing materials
        - Rotation
        - Repetition/Radius
        - Toggle axes
    - Adjusting materials
        - add/remove/select atoms

## Installation

Run with `Node` v12.21.0, tested with `Node` v8.11.4. The corresponding version(s) of npm should be fine, tested with v6.4.1. We recommend using `nvm` for version management.

Materials Designer can be installed from source as follow:

```bash
git clone git@github.com:Exabyte-io/materials-designer.git
cd materials-designer

sh run-application.sh
```
Open http://localhost:3001 to view the application in the browser.

## Development

Execute the following commands when running the application in development mode.

```bash
npm install
npm start
```

## Tests

Start the application and then run one of the below commands to run the tests.

To run all tests:

```bash
sh run-tests.sh
```

To run a specific test feature, pass it's relative path as option: 
```bash
sh run-tests.sh -f=menu/advanced/create-supercell.feature       # to run a specific test
```

### TODO list

Desirable features/fixes for implementation:

- add tests for all the functionality listed above. We only tests advanced operations at current.
- switch color back to white when the material is back to original after editing
- add logic for Interstitials, Vacancy concentrations in combinatorial sets
- fix modal dialog exceptions for AdvancedGeometryDialog
- add line numbers to SourceEditor
- remove updateIndex action when index is the same
- show the total number of materials in set and the current index
- fix fullscreen support

## Dependencies

This package depends on [Made.js](https://github.com/Exabyte-io/made.js) and [Wave.js](https://github.com/Exabyte-io/wave.js). See [package.json](package.json) for the full list.

## Links

1. [Create React App, GitHub Repository](https://github.com/facebook/create-react-app)
