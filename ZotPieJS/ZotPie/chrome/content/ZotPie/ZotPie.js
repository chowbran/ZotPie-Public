Zotero.ZotPie = {
	DB: null,
	
	init: function () {
		console.log("ZotPie init");
		this.ww = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
		                   .getService(Components.interfaces.nsIWindowWatcher);
		this.batchEditorDoc = "";
	},

	docBatchEditor: function () {

	},

	startBatchEditor: function () {
		this.batchEditorDoc = this.ww.openWindow(null, "chrome://zotpie/content/batchEditorWindow.xul",
		                        "Batch Editor", "chrome,centerscreen", null);
		// window.openDialog('chrome://zotpie/content/batchEditorWindow.xul', 'Batch Editor', 'chrome,centerscreen');
	}
	
};

// Initialize the utility
window.addEventListener('load', function(e) { Zotero.ZotPie.init(); }, false);