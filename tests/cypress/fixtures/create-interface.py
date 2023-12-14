"""TITLE: Layer on Substrate."""
"""BLOCK: Install Dependencies"""
"""
This scripts creates a basic interface between two materials: (1) substrate and (2) layer.
It is assumed that the substrate is a 3D material and the layer is a 2D material.
This script is based on the ASE package (Atomic Simulation Environment).
"""

# This block handles the installation of necessary packages for the script using Micropip in a Pyodide environment.
# ASE (Atomic Simulation Environment) is installed for manipulating structures.
import micropip

await micropip.install("ase")

"""BLOCK: Classes and Definitions"""
"""
NOTE: edit the variables above for your specific use case.
"""

# Indices identifying the substrate and layer from the list of input materials.
SUBSTRATE_INDEX = 0
LAYER_INDEX = 1

SETTINGS = {
    "surface": {
        # Set Miller indices (h, k, l) for the resulting substrate surface
        "miller:h": 1,
        "miller:k": 1,
        "miller:l": 1,
        # The vacuum space (in Ångströms) added to the surface in the direction perpendicular to the surface
        "vacuum": 5,
        # The number of atomic layers in the resulting substrate
        "number_of_layers": 3,
    },
    "interface": {
        # The transformation matrix for the surface
        "surface_v:matrix": [
            [1, 0],
            [0, 1]
        ],
        # The transformation matrix for the surface
        "layer_v:matrix": [
            [1, 0],
            [0, 1]
        ],
        # Distance between the substrate and the layer (in Ångströms)
        "distance": 3.0,
    },
}


"""
NOTE: DO NOT edit code below unless you know what you are doing.
"""

from ase.build import surface as make_surface, supercells
from ase.io import read, write
import io
import numpy as np


# The following 3 util functions are used for convenience purposes.
def poscar_to_atoms(poscar):
    input = io.StringIO(poscar)
    atoms = read(input, format="vasp")
    return atoms


def atoms_to_poscar(atoms):
    output = io.StringIO()
    write(output, atoms, format="vasp")
    content = output.getvalue()
    output.close()
    return content


def expand_matrix_2x2_to_3x3(matrix_2x2):
    matrix_3x3 = np.identity(3)
    matrix_3x3[0:2, 0:2] = matrix_2x2
    return matrix_3x3


class MaterialInterface:
    """
    This class Encapsulates the creation and manipulation of a material interface.
    Includes methods to create the structure of the interface, calculate strain and distance between layers.
    """
    def __init__(self, substrate, material, settings=None):
        self.substrate = substrate
        self.material = material
        self.original_material = self.material.copy()
        self.settings = settings
        if settings:
            for key in self.settings.keys():
                if key in settings:
                    self.settings[key].update(settings[key])
        self.structure = self.create_structure()

    def create_structure(self):
        """
        Creates the interface structure from the substrate and the material.
        """
        surface = self.settings["surface"]
        interface = self.settings["interface"]

        self.substrate = make_surface(
            self.substrate,
            (surface["miller:h"], surface["miller:k"], surface["miller:l"]),
            vacuum=surface["vacuum"],
            layers=surface["number_of_layers"],
        )

        surface_v_matrix = expand_matrix_2x2_to_3x3(interface["surface_v:matrix"])
        layer_v_matrix = expand_matrix_2x2_to_3x3(interface["layer_v:matrix"])

        self.substrate = supercells.make_supercell(self.substrate, surface_v_matrix)
        self.substrate.wrap()
        self.material = supercells.make_supercell(self.material, layer_v_matrix)

        self.material.set_cell(self.substrate.get_cell(), scale_atoms=True)
        cell = self.material.get_cell_lengths_and_angles()
        # Reverting lattices switched by ASE wrap
        cell[5] = 180 - cell[5]

        self.material.set_cell(cell, scale_atoms=True)

        self.material.wrap()

        z_offset = self.calculate_distance()
        self.material.positions[:, 2] += z_offset
        interface = self.substrate + self.material
        interface.wrap()
        return interface

    def calculate_strain(self, substrate=None, material=None):
        """
        Calculates strain between the layer and the substrate.
        """
        if substrate is None:
            substrate = self.substrate
        if material is None:
            material = self.original_material

        substrate_cell = substrate.get_cell()
        material_cell = material.get_cell()

        a0 = np.linalg.norm(substrate_cell[0])
        b0 = np.linalg.norm(substrate_cell[1])

        a1 = np.linalg.norm(material_cell[0])
        b1 = np.linalg.norm(material_cell[1])

        strain_a = (a1 - a0) / a0
        strain_b = (b1 - b0) / b0

        return {"a": strain_a, "b": strain_b}

    def calculate_distance(self):
        """
        Calculates distance between the substrate and the material
        """
        interface = self.settings["interface"]
        z_max_substrate = max(self.substrate.positions[:, 2])
        z_min_material = min(self.material.positions[:, 2])
        z_offset = z_max_substrate - z_min_material + interface["distance"]

        return z_offset


def main():
    """
    The main function of the script.
    Creates a `MaterialInterface` object with input materials and settings.
    Calculates the interface structure, and handles output.

    Returns:
        globals(): The globals() dictionary is returned to the platform JS environment.
    """
    materials = globals()["materials_in"]
    substrate_data = materials[SUBSTRATE_INDEX].getAsPOSCAR()
    layer_data = materials[LAYER_INDEX].getAsPOSCAR()

    substrate = poscar_to_atoms(substrate_data)
    layer = poscar_to_atoms(layer_data)

    interface = MaterialInterface(substrate, layer, SETTINGS)

    globals()["materials_out"] = [
        {
            "poscar": atoms_to_poscar(interface.structure),
        }
    ]

    print(globals()["materials_out"][0]["poscar"])

    return globals()


main()
