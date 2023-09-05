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
}
