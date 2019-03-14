export function getCacheValue(context, key) {
    return context[key]
}

export function setCacheValue(context, key, value) {
    context[key] = value;
}
