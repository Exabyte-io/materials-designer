import _ from "underscore";

export function safeMakeArrayIfNot(x) {
    if (!_.isArray(x)) return [x];
    return x;
}
