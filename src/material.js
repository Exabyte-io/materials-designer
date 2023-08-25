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
                            message: `Lines ${basis.elements[i].id + 1} and ${
                                basis.elements[j].id + 1
                            } are duplicates`,
                            type: "warning",
                            id: basis.elements[j].id,
                        });
                    }
                }
            }
        }

        checks.push(...this.runChecks());

        return checks;
    }
}
