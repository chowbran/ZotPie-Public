var ZotPieOverlay = new function ()
{
    var tab, tabpanels;

    console.log("AAAA");
    this.isTab = false;

	this.onLoad = function() {
		console.log("TEST");

		tab = document.getElementById("zotero-view-tabbox");
			
		if (tab) {
		    console.log("COOL");
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
	}
	
	
	this.onUnload = function() {

	}
	
	this.onBeforeUnload = function() {

	}
}

window.addEventListener("load", function(e) { ZotPieOverlay.onLoad(e); }, false);
window.addEventListener("unload", function(e) { ZotPieOverlay.onUnload(e); }, false);
window.addEventListener("beforeunload", function(e) { ZotPieOverlay.onBeforeUnload(e); }, false);
