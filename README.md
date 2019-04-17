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

Materials Designer can be installed from source as follow:

```bash
git clone git@github.com:Exabyte-io/materials-designer.git
cd materials-designer

npm install --no-save

# Fix materials-designer runtime-corejs symlink
cd node_modules/@babel/runtime
ln -sf ../runtime-corejs2/core-js .
cd -
```

## Development

Execute the following command to run the application in development mode.

```bash
npm start
```

Open http://localhost:3001 to view the application in the browser.

## Tests

Start the application and then run one of the below commands to run the tests.

```bash
sh run-tests.sh                                                 # to run all the tests
sh run-tests.sh -f=menu/advanced/create-supercell.feature       # to run an specific test
```

### TODO list

Desirable features for implementation:

- Add tests for all the functionality listed above. We only tests advanced operations at current.
- TBA

## Links

1. [Create React App, GitHub Repository](https://github.com/facebook/create-react-app)
