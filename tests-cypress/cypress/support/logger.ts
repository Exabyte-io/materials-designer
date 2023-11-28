import debug from "debug";

const LEVELS = {
    debug: 3,
    warn: 2,
    info: 1,
    error: 0,
};

const DEBUG_LEVEL = Number(process.env.DEBUG_LEVEL || LEVELS.warn);

/**
 * @summary Returns a logger with specified name.
 */
export function getLogger(name: string) {
    const log = debug(name);

    return {
        debug(message: unknown) {
            if (DEBUG_LEVEL >= LEVELS.debug) {
                log(message);
            }
        },
        warn(message: unknown) {
            if (DEBUG_LEVEL >= LEVELS.warn) {
                log(message);
            }
        },
        info(message: unknown) {
            if (DEBUG_LEVEL >= LEVELS.info) {
                log(message);
            }
        },
        error(message: unknown) {
            if (DEBUG_LEVEL >= LEVELS.error) {
                log(message);
            }
        },
    };
}

export const logger = getLogger("exachimp:default");
