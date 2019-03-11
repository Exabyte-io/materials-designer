import {logger} from "../logger";

export function getCacheValue(context, key) {
    return context[key]
}

export function setCacheValue(context, key, value) {
    context[key] = value;
}

/**
 * @summary Stores a given entity config in the context.
 * when useCollectionItem is passed collection item is stored instead of config.
 */
export function cacheEntityData(config, context, entityId, entityTAO) {
    if (!config.cacheKey || !context) return;
    logger.debug(`Entity with name "${config.name || config.username}" is stored under cacheKey "${config.cacheKey}"`);
    setCacheValue(context, config.cacheKey, config.useCollectionItem ? entityTAO.findById(entityId) : config);
}
