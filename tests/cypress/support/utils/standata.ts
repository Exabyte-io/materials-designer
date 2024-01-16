import data from "@mat3ra/standata/lib/runtime_data/materials.json";

const materialConfigs = Object.values(data.filesMapByName);

export const getMaterialFromStandata = (name: string) => {
    return materialConfigs.find((material) => material.name === name);
};
