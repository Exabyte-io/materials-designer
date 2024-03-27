/**
 * Creates deep clone of the object.
 * `lodash` appears to be the fastest: http://jsben.ch/bWfk9
 * @param obj {Object}
 */
export function deepClone(obj) {
    //    return lodash.cloneDeep(obj);
    return JSON.parse(JSON.stringify(obj));
}
