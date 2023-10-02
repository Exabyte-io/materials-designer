export const pythonCodeMap = {
    createSurface: `
from ase import Atoms
from ase.build import surface
from ase.io import read, write
import io
import matplotlib
import matplotlib.pyplot as plt
matplotlib.use("module://matplotlib_pyodide.html5_canvas_backend")

def func() :
    # Extracting data from globals
    material_data = globals()["data"]
    print(material_data)
    poscar_str = material_data["poscar"][0]
    # boilerplate for reading POSCAR
    input = io.StringIO()
    input.write(poscar_str)
    input.seek(0)
    atoms = read(input, format="vasp")
    
    h = 1 # material_data["h"]
    k = 0 # material_data["k"]
    l = 0 # material_data["l"]
    layers = 3 # material_data["thickness"]
    vacuum = 0.1 # material_data["vacuum"]
    
    slab = surface(atoms, (h, k, l), layers, vacuum)
    
    # boilerplate for retrieving information
    output = io.StringIO()
    write(output, slab, format="vasp")
    global content
    content = output.getvalue()
    input.close()
    output.close()
   
    # plotting for the fun:
    z_coords = [atom.position[2] for atom in slab]
    symbols = [atom.symbol for atom in slab]
    
    plt.scatter(z_coords, range(len(z_coords)), c='blue')
    for i, txt in enumerate(symbols):
        plt.annotate(txt, (z_coords[i], i))
    plt.xlabel('Z coordinate')
    plt.ylabel('Atom Index')
    plt.title('Atomic Positions in Z direction')
    plt.show()

    return globals()

func()`,
};
