const transformationsMap = {
    default: `
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
