var ZotPieOverlay = new function ()
{
    var tab, tabpanels;

    var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                              .getService(Components.interfaces.nsIPromptService);
    var ZoteroPane = Components.classes["@mozilla.org/appshell/window-mediator;1"]
        .getService(Components.interfaces.nsIWindowMediator)
        .getMostRecentWindow("navigator:browser").ZoteroPane;
    
    var batchedItems = [];

	this.onLoad = function() {

		tab = document.getElementById("zotero-view-tabbox");
			
		if (tab) {
		    console.log(tab.getAttribute("id"));

		    var cdTab = document.createElement("tab");
		    cdTab.setAttribute("id", "zotpie-customdatatab");
		    cdTab.setAttribute("label", "Custom Data");
		    cdTab.setAttribute("value", "customdata");
		    tab.firstChild.appendChild(cdTab);
		    //console.log(zoteroTab.firstChild.);
			//zoteroTab.firstChild.setAttribute("id", "zotpie-tabs");
		}

		tabpanels = document.getElementById("zotero-view-item");

		if (tabpanels) {
		    var cdTabPanel = document.createElement("tabpanel");
		    cdTabPanel.setAttribute("id", "zotpie-customdatapanel");
		    var zoterobox = document.createElement("zoteroitembox");
		    cdTabPanel.appendChild(zoterobox);

		    tabpanels.appendChild(cdTabPanel);
		}

	    // Add custom elements to the Zotero toolbar

        // Grab the advanced search node (we will add our custom elements before this)
		var advSearch = document.getElementById("zotero-tb-advanced-search");

		if (advSearch) {
		    var sep = document.createElement("toolbarseparator");
		    advSearch.parentNode.insertBefore(sep, advSearch);

		    var cslEdit = document.createElement("toolbarbutton");
		    cslEdit.setAttribute("id", "zotpie-csledit");
		    cslEdit.setAttribute("class", "zotero-tb-button");
		    cslEdit.setAttribute("tooltiptext", "CSL Editor");
		    cslEdit.setAttribute("image", "chrome://ZotPie/skin/toolbar-csledit.png");
		    cslEdit.setAttribute("oncommand", "openInViewer('chrome://zotero/content/tools/csledit.xul', true)");
		    sep.parentNode.insertBefore(cslEdit, sep);

		    var batchEdit = document.createElement("toolbarbutton");
		    batchEdit.setAttribute("id", "zotpie-batchedit");
		    batchEdit.setAttribute("class", "zotero-tb-button");
		    batchEdit.setAttribute("tooltiptext", "Batch Tag Editor");
		    batchEdit.setAttribute("image", "chrome://ZotPie/skin/tag.png");
		    batchEdit.setAttribute("oncommand", "Zotero.ZotPie.startBatchEditor()");
		    cslEdit.parentNode.insertBefore(batchEdit, cslEdit);

		    var documentLinker = document.createElement("toolbarbutton");
		    documentLinker.setAttribute("id", "zotpie-documentlinker");
		    documentLinker.setAttribute("class", "zotero-tb-button");
		    documentLinker.setAttribute("tooltiptext", "Document Linker");
		    documentLinker.setAttribute("image", "chrome://ZotPie/skin/toolbar-documentlinker.png");
		    documentLinker.setAttribute("oncommand", "window.openDialog('chrome://zotpie/content/coupleDocumentsWindow.xul', 'Link Documents', 'chrome,centerscreen')");
		    batchEdit.parentNode.insertBefore(documentLinker, batchEdit);
		}

		var addGroup = document.getElementById("zotero-tb-group-add");
		if (addGroup) {
		    var sep2 = document.createElement("toolbarseparator");
		    addGroup.nextSibling.parentNode.insertBefore(sep2, addGroup);

		    var createSync = document.createElement("toolbarbutton");
		    createSync.setAttribute("id", "zotpie-batchedit");
		    createSync.setAttribute("class", "zotero-tb-button");
		    createSync.setAttribute("tooltiptext", "New Synced Collection...");
		    createSync.setAttribute("image", "chrome://ZotPie/skin/toolbar-synccollection.png");
		    createSync.setAttribute("oncommand", "Zotero.ZotPie.startCreateSync()");
		    sep2.parentNode.insertBefore(createSync, sep2);
		}

		var itemContextMenu = document.getElementById("zotero-itemmenu");

		if (itemContextMenu) {
		    var sep3 = document.createElement("menuseparator");
		    itemContextMenu.appendChild(sep3);

		    var addToQueue = document.createElement("menuitem");
		    addToQueue.setAttribute("class", "menuitem-iconic");
		    addToQueue.setAttribute("id", "zotpie-batcheditqueue");
		    addToQueue.setAttribute("label", "Add Item to Batch Edit Queue...")
		    addToQueue.setAttribute("image","chrome://ZotPie/skin/tagbatch.png");
		    addToQueue.setAttribute("oncommand", "addToBatchEditQueue()");
		    itemContextMenu.appendChild(addToQueue);
		}
	},
	
    addToBatchEditQueue = function () {
        var selectedItems = ZoteroPane.getSelectedItems();
        var item = selectedItems[0];
        var counter = 0;

        for (i = 0; i < selectedItems.length; i++) {
            if (batchedItems.indexOf(selectedItems[i].id) == -1) {
                batchedItems.push(selectedItems[i].id);
                counter++;
            }
        }

        var flags = ps.BUTTON_POS_0 * ps.BUTTON_TITLE_IS_STRING +
                    ps.BUTTON_POS_1 * ps.BUTTON_TITLE_IS_STRING +
                    ps.BUTTON_POS_2 * ps.BUTTON_TITLE_IS_STRING;
        // This value of flags will create 3 buttons. The first will be "Save", the
        // second will be the value of aButtonTitle1, and the third will be "Cancel"

        var button = ps.confirmEx(null, "Success!", "Added " + counter + " items to the tag batch edit queue.\nThere are currently "
                                        + batchedItems.length.toString() + " items in the queue.",
                                       flags, "Open Batch Editor", "Continue Adding", null, null, {});

        if (button == 0) {
            Zotero.ZotPie.startBatchEditor();
        }
        //toastr.success("test");

    },
    /**
    * Opens a URI in the basic viewer in Standalone, or a new window in Firefox
    */
    openInViewer = function (uri, newTab) {
        var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
			.getService(Components.interfaces.nsIWindowMediator);
        const features = "menubar=yes,toolbar=no,location=no,scrollbars,centerscreen,resizable";
		
        if(Zotero.isStandalone) {
            var win = wm.getMostRecentWindow("zotero:basicViewer");
            if(win) {
                win.loadURI(uri);
            } else {
                window.openDialog("chrome://zotero/content/standalone/basicViewer.xul",
					"basicViewer", "chrome,resizable,centerscreen,menubar,scrollbars", uri);
            }
        } else {
            var win = wm.getMostRecentWindow("navigator:browser");
            if(win) {
                if(newTab) {
                    win.gBrowser.selectedTab = win.gBrowser.addTab(uri);
                } else {
                    win.open(uri, null, features);
                }
            }
            else {
                var ww = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
							.getService(Components.interfaces.nsIWindowWatcher);
                var win = ww.openWindow(null, uri, null, features + ",width=775,height=575", null);
            }
        }
    }
	this.onUnload = function() {

	}
	
	this.onBeforeUnload = function() {

	}
}

window.addEventListener("load", function(e) { ZotPieOverlay.onLoad(e); }, false);
window.addEventListener("unload", function(e) { ZotPieOverlay.onUnload(e); }, false);
window.addEventListener("beforeunload", function(e) { ZotPieOverlay.onBeforeUnload(e); }, false);
