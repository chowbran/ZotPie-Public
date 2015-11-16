// Only create main object once
if (!Zotero.BatchEditor) {
	let loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
					.getService(Components.interfaces.mozIJSSubScriptLoader);
	loader.loadSubScript("chrome://zotpie/content/batchEditor.js");
}

if (!Zotero.CitationEditor) {
	let loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
					.getService(Components.interfaces.mozIJSSubScriptLoader);
	loader.loadSubScript("chrome://zotpie/content/citationEditor.js");
}
