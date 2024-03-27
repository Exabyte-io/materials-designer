import { Made } from "@mat3ra/made";
interface MaterialsSelectorProps {
    materials: Made.Material[];
    selectedMaterials: Made.Material[];
    setSelectedMaterials: (selectedMaterials: Made.Material[]) => void;
    testId?: string;
}
declare function MaterialsSelector(props: MaterialsSelectorProps): import("react/jsx-runtime").JSX.Element;
export default MaterialsSelector;
