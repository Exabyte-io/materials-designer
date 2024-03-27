import { Made } from "@mat3ra/made";
import React from "react";
import { ExecutionStatus } from "./CodeExecutionControls";
import { ExecutionCellState } from "./ExecutionCell";
import { Transformation } from "./TransformationSelector";
interface PythonTransformationProps {
    materials: Made.Material[];
    show: boolean;
    onSubmit: (newMaterials: Made.Material[]) => void;
    onHide: () => void;
}
interface PythonTransformationState {
    materials: Made.Material[];
    selectedMaterials: Made.Material[];
    newMaterials: Made.Material[];
    executionStatus: ExecutionStatus;
    pyodide: any;
    transformation: Transformation | null;
    pythonCode: string;
    pythonOutput: string;
    executionCells: ExecutionCellState[];
}
type MapValue = string | number | Map<string, MapValue>;
interface PyodideDataMap {
    [key: string]: string | number | PyodideDataMap;
}
declare class PythonTransformation extends React.Component<PythonTransformationProps, PythonTransformationState> {
    constructor(props: PythonTransformationProps);
    componentDidUpdate(prevProps: PythonTransformationProps): void;
    onPyodideLoad: (pyodideInstance: any) => void;
    handleSubmit: () => Promise<void>;
    updateStateAtIndex: (stateArray: ExecutionCellState[], index: number, newState: ExecutionCellState) => void;
    executeSection: (sectionIndex: number) => Promise<void>;
    executeAllExecutionCells: () => Promise<void>;
    handleTransformationChange: (newPythonCode: string) => void;
    handleDownload: () => void;
    parseAndSetExecutionCells: (pythonCode: string) => void;
    mapToObject(map: Map<string, MapValue>): PyodideDataMap;
    render(): import("react/jsx-runtime").JSX.Element;
}
export default PythonTransformation;
