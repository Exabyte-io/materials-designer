const transformationsMap = {
    default: `import micropip
await micropip.install("https://files.mat3ra.com:44318/web/pyodide/pymatgen-2023.9.10-py3-none-any.whl", deps=False)
await micropip.install("https://files.mat3ra.com:44318/web/pyodide/spglib-2.0.2-py3-none-any.whl", deps=False)
await micropip.install("https://files.pythonhosted.org/packages/d9/0e/2a05efa11ea33513fbdf4a2e2576fe94fd8fa5ad226dbb9c660886390974/ruamel.yaml-0.17.32-py3-none-any.whl", deps=False)
for pkg in ["networkx", "monty", "scipy", "lzma", "tabulate", "sqlite3"]:
  await micropip.install(pkg)
import pymatgen

def func():
    """This function returns materials without any change"""
    materials = globals()["data_in"]["materials"]
    print(materials[0])
    globals()["data_out"] = {"materials": materials}
    return globals()
func()`,
    createInterface:
        "https://raw.githubusercontent.com/Exabyte-io/api-examples/262832d9300901b8e7b9d9b09c47436f55d9846d/other/two_dimensional_materials/layer_on_a_surface.py",
};

async function fetchPythonCode(transformationName) {
    const value = transformationsMap[transformationName];

    if (!value) {
        console.error(`No value found for transformation: ${transformationName}`);
        return;
    }

    const urlPattern = /^https?:\/\//;

    if (urlPattern.test(value)) {
        try {
            const response = await fetch(value);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error(`Error fetching code for transformation: ${transformationName}`, error);
            return;
        }
    }

    return value;
}

export { fetchPythonCode, transformationsMap };
