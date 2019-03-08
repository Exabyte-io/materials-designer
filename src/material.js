import {Made} from "made.js";

export class Material extends Made.Material {

    constructor(config) {
        super(Object.assign({}, Made.defaultMaterialConfig, config));
    }

    get id() {return this.prop('_id', '')}

    set id(id) {this.setProp('_id', id)}

    get exabyteId() {return this.prop('exabyteId')}

    get tags() {return this.prop('tags', [])}

    set tags(array) {this.setProp('tags', array)}

    get metadata() {return this.prop('metadata', {})}

    set metadata(object) {this.setProp('metadata', object)}

    toJSON() {
        return {
            ...super.toJSON(),
            _id: this.id,
            tags: this.tags,
            metadata: this.metadata,
            exabyteId: this.exabyteId
        };
    }

    unsetProp(name) {delete this._json[name]}

    cleanOnCopy() {
        [
            "_id",
        ].forEach(p => this.unsetProp(p));
    }
}
