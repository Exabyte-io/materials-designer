import _ from "underscore";

export function safeMakeArrayIfNot(x) {
    // TODO: should here be used js function Array.isArray() ??
    if (!_.isArray(x)) return [x];
    return x;
}
