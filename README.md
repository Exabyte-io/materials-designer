[![npm version](https://badge.fury.io/js/%40exabyte-io%2Fmaterials-designer.svg)](https://badge.fury.io/js/%40exabyte-io%2Fmaterials-designer)
[![License: Apache](https://img.shields.io/badge/License-Apache-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)

# Materials Designer

A standalone React/Redux application for atomistic design of material structures. Deployed within the Mat3ra.com platform as explained in the corresponding part of its documentatation [here](https://docs.mat3ra.com/materials-designer/overview/). Can be used as a library in other applications.

![Materials Designer in action](https://private-user-images.githubusercontent.com/721112/286782899-9671b06c-ef73-42e7-97d5-a7937c416364.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTEiLCJleHAiOjE3MDI5NTE5NTUsIm5iZiI6MTcwMjk1MTY1NSwicGF0aCI6Ii83MjExMTIvMjg2NzgyODk5LTk2NzFiMDZjLWVmNzMtNDJlNy05N2Q1LWE3OTM3YzQxNjM2NC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBSVdOSllBWDRDU1ZFSDUzQSUyRjIwMjMxMjE5JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDIzMTIxOVQwMjA3MzVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0wMzMzNDExNjE1YTk3ZGMzNmEwMzU4YWY2MGJkNzAzZDJlMzA2MzE3NDk3YzA3YmEzMWU0YmRiYTgzMzI3MDMwJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZhY3Rvcl9pZD0wJmtleV9pZD0wJnJlcG9faWQ9MCJ9.7eF5iaRW_06y0i2D3DQ_hjOPL12eSBRmbV59sdyNPEo)

## Functionality

As below:

- Input/Output Menu
    - Export materials in JSON/POSCAR formats
- Edit Menu
    - Undo/Redo/Reset/Clone operations
- View
    - Fullscreen mode
    - Multi-material Editor (combining multiple materials into one)
- Advanced Menu
    - Creating supercells
    - Creating surfaces/slabs
    - Creating combinatorial sets
    - Creating interpolated sets
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
        - multiple selection with drag-and-drop

## Installation

Tested with `Node` v14.19.3. The corresponding version(s) of npm should be fine, tested with v6.4.19. We recommend using `nvm` for version management.


### From source

Materials Designer can be installed from source as follows:

```bash
git clone git@github.com:Exabyte-io/materials-designer.git
```
Or use https, if no SSH authentication is set up with GitHub:

```bash
git clone https://github.com/Exabyte-io/materials-designer.git
```

then start the application:

```bash
cd materials-designer
sh run-application.sh
```

> Some files might not be downloaded by `git clone` or `git pull` commands if your system doesn't have `git-lfs` installed.
> To fix this run (on OSX):
> ```
> brew install git-lfs
> # after successful installation run next command in the root directory of this repository:
> git lfs install
> ```

Open http://localhost:3001 to view the application in the browser

### From Docker

See Docker Files section below.

## Development

Execute the following commands when running the application in development mode.

```bash
npm install
npm start
```

## Tests

Start the application and then run one of the below commands to run the tests.

> This will require proper java v1.8 installed, please verify it with command `java -version`.
> If version does not mach use next commands to install (on OSX):
> ```
> brew tap adoptopenjdk/openjdk
> brew install --cask adoptopenjdk8
> # set to path
> export PATH=/Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home/bin:$PATH
> ```

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

## CI Docker files

There are two docker files used for testing in CI. In principle, we could use
more targeted base images for the use case (e.g. `node` or `selenium` images),
but we want to verify correct behavior
on a specific CentOS version. The first `dockerfiles/centos/Dockerfile` builds and
runs the application. The second `dockerfiles/test/Dockerfile` provisions and runs
the tests. The `test` image uses the `centos` image as a base and is related by the
`entrypoint.sh` script. It is targeted for CI so if you are editing
the `entrypoint.sh` you may need to re-build both containers for your changes to
work. It can also be useful to comment out the `ENTRYPOINT` in the `centos` dockerfile
as well as the `CMD` in the `test` dockerfile in order to easily run and debug both
containers. There is also a `docker-compose.yml` file which can be used for local
building and testing. Provided `docker-compose` is installed, it can be used like so:

```bash
docker-compose build materials-designer
docker-compose build materials-designer-test

docker-compose up -d materials-designer
sleep 30  # let the app actually start
docker-compose run materials-designer-test
```

## Cove.js local development

In case you need to link Cove.js into the app for local development you need

1. Add local path of Cove.js to package.json
```bash
    "@exabyte-io/code.js": "file:../../cove.js"
```
2. Run the app
```bash
    npm start
```

If you need to re-link it again, remove node_modules in cove.js and the app, run npm install, then run npm start again. 


## Links

1. [Create React App, GitHub Repository](https://github.com/facebook/create-react-app)
