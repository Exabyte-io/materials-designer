Feature: User can open Python Transformation dialog, change python code and run it, or cancel dialog

  Scenario:
    When I open materials designer page
    Then I see material designer page

    # Open
    When I open PythonTransformationDialog
    Then I see PythonTransformationDialog

    # Change code
    When I set code input with the following data:
    """
    print('Hello Matera!')
    """

    # Run
    When I click the Run button
    Then I see code output with the following data:
    """
    Hello Matera!
    """

    # Cancel
    When I cancel PythonTransformationDialog
    Then I see PythonTransformationDialog is closed

    # Create a slab from material using python transformation
    When I create materials with the following data
      | name | basis    | lattice                                     |
      | Ni   | Ni 0 0 0 | {"type":"FCC", "a":2.46,"b":2.46, "c":2.46} |
    Then material with following data exists in state
      | name | basis    | lattice                                     |
      | Ni   | Ni 0 0 0 | {"type":"FCC", "a":2.46,"b":2.46, "c":2.46} |

    When I open PythonTransformationDialog
    Then I see PythonTransformationDialog
    And I set code input with the following data:
    """import micropip

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
  globals().setdefault("data_in", {"materials": [{"poscar": ""}]})
  globals()["data_in"]["settings"] = {
  "slab": {
  "miller:h": 1,
  "miller:k": 1,
  "miller:l": 1,
  "vacuum": 5,
  "number_of_layers": 3,
  }
  }
  try:
    materials = globals()["data_in"]["materials"]
    material_data = materials[0]
    material = ase_poscar_to_atoms(material_data["poscar"])

          # Create slab using ASE
    slab = surface(
    material,
    (
    globals()["data_in"]["settings"]["slab"]["miller:h"],
    globals()["data_in"]["settings"]["slab"]["miller:k"],
    globals()["data_in"]["settings"]["slab"]["miller:l"],
    ),
    vacuum=globals()["data_in"]["settings"]["slab"]["vacuum"],
    layers=globals()["data_in"]["settings"]["slab"]["number_of_layers"],
    )

    globals()["data_out"]["materials"] = [
    {
    "poscar": ase_atoms_to_poscar(slab),
    "metadata": {},
    }
    ]
  except Exception as e:
    print(e)

  print(globals()["data_out"])
  return globals()

func()
"""

    And I click the Run button
    Then I see code output with the following data:
    """
   {'materials': [{'poscar': 'Ni \n 1.0000000000000000\n     2.4599995727812636    0.0000000000000000    0.0000000000000000\n     1.2299999576644014    2.1304228614681309    0.0000000000000000\n     0.0000000000000000    0.0000000000000000   14.0171630732453192\n Ni \n   3\nCartesian\n  0.0000000000000000  0.0000000000000000  5.0000000000000000\n  2.4599993168362597  1.4202822519692981  7.0085815366226596\n  1.2299991032268542  0.7101416424704653  9.0171630732453192\n', 'metadata': {}}]}
    """
