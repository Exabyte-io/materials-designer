import fs from "fs";
import path from "path";

import {renderJinjaTemplate} from "./template";

export function readFileSync(path, options = {encoding: "utf8"}) {
    return fs.readFileSync(path, options);
}

export function writeFileSync(path, data, options = {}) {
    fs.writeFileSync(path, data, options);
}

export function generateFeatureFiles(configs, template, dst) {
    configs.forEach(config => {
        const path_ = path.resolve(dst, `${config.FEATURE_NAME}.feature`);
        writeFileSync(path_, renderJinjaTemplate(template, config));
    });
}
