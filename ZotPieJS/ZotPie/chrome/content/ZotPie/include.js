// Only create main object once
let loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
				.getService(Components.interfaces.mozIJSSubScriptLoader);
if (!Zotero.BatchEditor) {
	loader.loadSubScript("chrome://zotpie/content/batchEditor.js");
}

if (!Zotero.Interface) {
	loader.loadSubScript("chrome://zotpie/content/interface.js");
}
