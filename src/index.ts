/**
 * @OnlyCurrentDoc
 */

function menuItem1() {
    var html = HtmlService.createHtmlOutputFromFile('src/ui/index')
        .setWidth(400)
        .setHeight(300);
    SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
        .showModalDialog(html, 'My custom dialog');
}

function onOpen(event: { authMode: GoogleAppsScript.Script.AuthMode }) {
    console.log(event.authMode)
    const ui = SpreadsheetApp.getUi();
    // Or DocumentApp, SlidesApp or FormApp.
    ui.createMenu('Custom Menu')
        .addItem('First item', 'menuItem1')
        .addToUi();
}

function onInstall(event: GoogleAppsScript.Events.AddonOnInstall) {
    onOpen(event)
}