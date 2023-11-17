export default function () {
    this.When(/^I close PythonTransformationDialog$/, () => {
        pythonTransformationDialogWidget.cancel();
    });
}
