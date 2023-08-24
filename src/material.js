import { Made } from "@exabyte-io/made.js";

export class Material extends Made.Material {
    constructor(config) {
        super({ ...Made.defaultMaterialConfig, ...config });
    }

    get id() {
        return this.prop("_id", "");
    }

    set id(id) {
        this.setProp("_id", id);
    }

    get isUpdated() {
        return this.prop("isUpdated", false);
    }

    set isUpdated(bool) {
        this.setProp("isUpdated", bool);
    }

    get metadata() {
        return this.prop("metadata", {});
    }

    set metadata(object) {
        this.setProp("metadata", object);
    }

    toJSON() {
        return {
            ...super.toJSON(),
            _id: this.id,
            metadata: this.metadata,
        };
    }

    cleanOnCopy() {
        ["_id"].forEach((p) => this.unsetProp(p));
    }

    get boundaryConditions() {
        return this.metadata.boundaryConditions || {};
    }

    static createFromMadeMaterial(material) {
        const config = material.toJSON();
        return new Material(config);
    }

    // eslint-disable-next-line class-methods-use-this
    getBasisChecks() {
        const { basis } = this.toJSON();
        const checks = [];

        // TODO: implement testing for rules in Material class (warnings mixin?)
        for (let i = 0; i < basis.elements.length; i++) {
            for (let j = i + 1; j < basis.elements.length; j++) {
                if (basis.elements[i].value === basis.elements[j].value) {
                    const coord1 = basis.coordinates.find(
                        (coord) => coord.id === basis.elements[i].id,
                    );
                    const coord2 = basis.coordinates.find(
                        (coord) => coord.id === basis.elements[j].id,
                    );

                    if (JSON.stringify(coord1.value) === JSON.stringify(coord2.value)) {
                        checks.push({
                            message: `Atoms #${basis.elements[i].id} and #${basis.elements[j].id} are duplicates`,
                            severity: "warning",
                            id: basis.elements[j].id,
                        });
                    }
                }
            }
        }

        // Function to calculate Euclidean distance between two 3D points
        const distance = (point1, point2) => {
            return Math.sqrt(
                (point2[0] - point1[0]) ** 2 +
                    (point2[1] - point1[1]) ** 2 +
                    (point2[2] - point1[2]) ** 2,
            );
        };

        const tolerance = 0.15;
        // Check for overlapping atoms within the tolerance
        for (let i = 0; i < basis.coordinates.length; i++) {
            for (let j = i + 1; j < basis.coordinates.length; j++) {
                const coord1 = basis.coordinates[i].value;
                const coord2 = basis.coordinates[j].value;

                if (distance(coord1, coord2) < tolerance) {
                    checks.push(
                        {
                            message: `Atoms #${basis.coordinates[i].id} and #${basis.coordinates[j].id} overlap within the tolerance`,
                            severity: "warning",
                            id: basis.coordinates[i].id,
                        },
                        {
                            message: `Atoms #${basis.coordinates[i].id} and #${basis.coordinates[j].id} overlap within the tolerance`,
                            severity: "warning",
                            id: basis.coordinates[j].id,
                        },
                    );
                }
            }
        }

        return checks;
    }
}
