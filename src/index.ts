/**
 * @OnlyCurrentDoc
 */

function menuItem1() {
    SpreadsheetApp.getActiveRange().setValue('Hello world')
}

function onOpen(event: {authMode: GoogleAppsScript.Script.AuthMode}) {
    console.log(event.authMode)
    const ui = SpreadsheetApp.getUi();
    // Or DocumentApp, SlidesApp or FormApp.
    ui.createMenu('Custom Menu')
        .addItem('First item', 'menuItem1')
        .addSeparator()
        .addSubMenu(ui.createMenu('Sub-menu')
            .addItem('Second item', 'menuItem2'))
        .addToUi();   
}

function onInstall(event: GoogleAppsScript.Events.AddonOnInstall) {
    onOpen(event)
}