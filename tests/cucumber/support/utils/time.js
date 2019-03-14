import _ from "underscore";
import moment from "moment";

export function dateToUnix(date) {
    return date.getTime() / 1000;
}

export function dateToString(date, format = 'MM/DD/YYYY') {
    return _.isString(date) ? date : moment(date).format(format);
}
