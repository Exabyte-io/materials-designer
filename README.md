# Materials Designer

This a standalone react/redux application for atomistic material structures design.

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

cd /stack/lib/wave
npm install --no-save
cd -

# Fix Wave runtime-corejs symlink
cd /stack/lib/wave/node_modules/@babel/runtime
ln -sf ../runtime-corejs2/core-js .
cd -

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

## Architecture

As explained here in [Confluence documentation](https://exabyte.atlassian.net/wiki/spaces/PD/pages/2261113/Materials+Designer).


### General Data Flow

![Data Flow](https://user-images.githubusercontent.com/721112/37315598-b4995d8c-2617-11e8-8b9b-3004821cc61b.png)

### Example Actions

![Data Flow](https://user-images.githubusercontent.com/721112/37314717-df79d658-2612-11e8-9e1c-414efdaa1661.png)


### TODO list

Desirable features for implementation:

- Add tests for all the functionality listed above. We only tests advanced operations at current.
- TBA

## Links

1. [Create React App, GitHub Repository](https://github.com/facebook/create-react-app)
