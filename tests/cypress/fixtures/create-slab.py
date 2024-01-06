import micropip
await micropip.install("ase")
from ase.build import surface
from ase.io import read, write
import io
import numpy as np


# Classes and Definitions
def ase_poscar_to_atoms(poscar):
    input = io.StringIO(poscar)
    atoms = read(input, format="vasp")
    return atoms


def ase_atoms_to_poscar(atoms):
    output = io.StringIO()
    write(output, atoms, format="vasp")
    content = output.getvalue()
    output.close()
    return content


# Function to run
def func():
    materials = globals()["materials_in"]
    material_data = materials[0].getAsPOSCAR()
    material = ase_poscar_to_atoms(material_data)

    # Create slab using ASE
    slab = surface(material, (1,1,1), vacuum=5, layers=3)
    globals()["materials_out"] = [{"poscar": ase_atoms_to_poscar(slab)}]
    print(globals()["materials_out"][0]["poscar"])
    return globals()

func()
