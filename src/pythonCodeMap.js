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
        "https://raw.githubusercontent.com/Exabyte-io/api-examples/4d650febd43127fc216c8e71b139ab48db120c91/other/two_dimensional_materials/simple_material_interface.py",
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
