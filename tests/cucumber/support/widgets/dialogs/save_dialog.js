import {Widget} from "../../widget";
import {logger} from "../../logger";
import {SELECTORS} from "../../selectors";
import {MaterialsExplorerWidget} from "../../materials_explorer_widget";

export class SaveDialogWidget extends Widget {
    constructor(selector) {
        super(selector);
        this.selectors = SELECTORS.materialDesignerWidget.headerMenu.saveDialog;
        this.wrappedSelectors = this.getWrappedSelectors(this.selectors);
        this.materialsSetSelectExplorer = new MaterialsExplorerWidget(this.selectors.materialsSetSelectExplorerWrapper);
    }

    setTags(tags) {
        if (!tags) return;
        tags = tags.split(',');
        tags.forEach(tag => {
            exabrowser.setValue(this.wrappedSelectors.tagsSelectorInput, tag);
            exabrowser.keys('Enter');
        })
    };

    setIsPublic(bool) {
        if (bool === undefined) return;
        if (this.isPublicIsDisabled) {
            logger.debug('isPublic checkbox is disabled => aborting set attempt.');
            return
        }
        if (bool !== this.isPublicIsChecked)
            exabrowser.scrollAndClick(this.wrappedSelectors.isPublicTriggerCheckbox, true);
    };

    get isPublicIsChecked() {
        return exabrowser.isSelected(this.wrappedSelectors.isPublicTriggerCheckboxInput);
    };

    get isPublicIsDisabled() {
        return exabrowser.getAttribute(
            this.wrappedSelectors.isPublicTriggerCheckboxInput, 'disabled'
        );
    };

    get saveAllIsChecked() {
        return exabrowser.isSelected(this.wrappedSelectors.isPublicTriggerCheckbox);
    };

    setSaveAll(bool) {
        if (bool === undefined) return;
        if (bool !== this.saveAllIsChecked)
            exabrowser.scrollAndClick(this.wrappedSelectors.saveAllTriggerCheckbox, true);
    };

    submit() {exabrowser.scrollAndClick(SELECTORS.materialDesignerWidget.actionDialogSubmitButton)}

    openMaterialsSetSelectModal() {
        exabrowser.scrollAndClick(this.wrappedSelectors.selectMaterialsSetTextInput);
        exabrowser.waitForVisible(this.selectors.materialsSetSelectExplorerWrapper);
    }

}
