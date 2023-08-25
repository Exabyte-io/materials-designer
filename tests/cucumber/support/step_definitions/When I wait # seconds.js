export default function () {
    this.When(/^I wait "([^"]*)" seconds$/, (timer) => {
        exabrowser.pause(timer * 1000);
    });
}
