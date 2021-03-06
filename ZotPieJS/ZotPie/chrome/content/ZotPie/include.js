// Only create main object once
let loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
				.getService(Components.interfaces.mozIJSSubScriptLoader);

// if (!Fuse) {
	loader.loadSubScript("chrome://zotpie/content/Fuse.js");
// }

if (!Zotero.BatchEditor) {
	loader.loadSubScript("chrome://zotpie/content/batchEditor.js");
}

if (!Zotero.CustomFieldsEditor) {
	loader.loadSubScript("chrome://zotpie/content/customFieldsEditor.js");
}

if (!Zotero.CustomFieldsAdding) {
    loader.loadSubScript("chrome://zotpie/content/customFieldsAdding.js")
}

if (!Zotero.Couple){
    loader.loadSubScript("chrome://zotpie/content/couple.js");
}

if (!Zotero.SyncCollection){
    loader.loadSubScript("chrome://zotpie/content/syncCollection.js")
}

if (!Zotero.CustomDB){
    loader.loadSubScript("chrome://zotpie/content/customDB.js");
}

if (!Zotero.ZotPie) {
	loader.loadSubScript("chrome://zotpie/content/ZotPie.js");
}

if (!Zotero.Helpers) {
	loader.loadSubScript("chrome://zotpie/content/Helpers.js");
}
