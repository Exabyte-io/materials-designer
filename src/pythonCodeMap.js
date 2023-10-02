const transformationsMap = {
    default: `def func():
    """This function returns the material without any change (as conventional cell)"""
    poscar_data = globals()["data"]["poscar_data"]
    print("Pyodide poscar_data:", poscar_data)
    return poscar_data[0]
func()`,
    createInterface:
        "https://raw.githubusercontent.com/Exabyte-io/api-examples/afc1a490c57ba3fc7c277a501cea7f05c3300061/other/two_dimensional_materials/layer_on_a_surface.py",
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
