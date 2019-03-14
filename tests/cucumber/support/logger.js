import debug from "debug";

const LEVELS = {
    debug: 3,
    warn: 2,
    info: 1,
    error: 0
};

const DEBUG_LEVEL = process.env.DEBUG_LEVEL || LEVELS.warn;

/**
 * @summary Returns a logger with specified name.
 * @param name {String} E.g. "exachimp:widget"
 */
export function getLogger(name) {
    const log = debug(name);

    return {
        debug(message) {
            if (DEBUG_LEVEL >= LEVELS.debug) {
                log(message);
            }
        },
        warn(message) {
            if (DEBUG_LEVEL >= LEVELS.warn) {
                log(message);
            }
        },
        info(message) {
            if (DEBUG_LEVEL >= LEVELS.info) {
                log(message);
            }
        },
        error(message) {
            if (DEBUG_LEVEL >= LEVELS.error) {
                log(message);
            }
        }
    }
}

export const logger = getLogger("exachimp:default");
