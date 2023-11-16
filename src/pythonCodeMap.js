const transformationsMap = {
    default: {
        name: "Default",
        content: `
import pymatgen

def func():
    """This function returns materials without any change"""
    materials = globals()["data_in"]["materials"]
    print(materials[0])
    globals()["data_out"] = {"materials": materials}
    return globals()
func()`,
    },
    createInterface: {
        name: "Create interface",
        content:
            "https://raw.githubusercontent.com/Exabyte-io/api-examples/4d650febd43127fc216c8e71b139ab48db120c91/other/two_dimensional_materials/simple_material_interface.py",
    },
};

async function fetchPythonCode(content) {
    const urlPattern = /^https?:\/\//;

    if (urlPattern.test(content)) {
        try {
            const response = await fetch(content);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error(`Error fetching code:`, error);
            return;
        }
    }

    return content;
}

export { fetchPythonCode, transformationsMap };
