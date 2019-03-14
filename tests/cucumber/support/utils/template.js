import jinja from "swig";

/**
 * @summary Renders a template with given context.
 * @param content {String} template string.
 * @param context {Object} context to render template with.
 * @returns {String}
 */
export function renderJinjaTemplate(content, context = {}) {
    return jinja.compile(content)(context);
}
