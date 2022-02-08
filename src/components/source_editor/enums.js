import {Made} from "@exabyte-io/made.js";
import {displayMessage} from "../../i18n/messages";

export const xyzValidationErrorMessagesConfig = {
    0: displayMessage('basis.validationSuccess'),
    1001: displayMessage('basis.validationError'),
    2001: displayMessage('basis.maxAtomError', Made.Basis.nonPeriodicMaxAtomsCount)
}
