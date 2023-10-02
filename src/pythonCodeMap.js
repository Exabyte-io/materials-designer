const transformationsMap = {
    createInterface:
        "https://raw.githubusercontent.com/Exabyte-io/api-examples/afc1a490c57ba3fc7c277a501cea7f05c3300061/other/two_dimensional_materials/layer_on_a_surface.py",
};

async function fetchPythonCode(transformationName) {
    const url = transformationsMap[transformationName];
    if (!url) {
        console.error(`No URL found for transformation: ${transformationName}`);
        return;
    }

    try {
        const response = await fetch(url);
        return await response.text();
    } catch (error) {
        console.error(`Error fetching code for transformation: ${transformationName}`, error);
    }
}

export { fetchPythonCode, transformationsMap };
