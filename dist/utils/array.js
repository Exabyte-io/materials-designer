import _ from "underscore";
export function safeMakeArrayIfNot(x) {
    // TODO: use code.js and Array.isArray() for this
    if (!_.isArray(x))
        return [x];
    return x;
}
