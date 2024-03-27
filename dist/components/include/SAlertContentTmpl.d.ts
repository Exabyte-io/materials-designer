export default SAlertContentTmpl;
declare function SAlertContentTmpl({ id, classNames, condition, styles, message, handleClose, }: {
    id: any;
    classNames: any;
    condition: any;
    styles: any;
    message: any;
    handleClose: any;
}): import("react/jsx-runtime").JSX.Element;
declare namespace SAlertContentTmpl {
    namespace propTypes {
        const id: PropTypes.Validator<string>;
        const classNames: PropTypes.Validator<string>;
        const condition: PropTypes.Validator<string>;
        const styles: PropTypes.Validator<object>;
        const message: PropTypes.Validator<NonNullable<NonNullable<string | object | null | undefined>>>;
        const handleClose: PropTypes.Validator<(...args: any[]) => any>;
    }
}
import PropTypes from "prop-types";
