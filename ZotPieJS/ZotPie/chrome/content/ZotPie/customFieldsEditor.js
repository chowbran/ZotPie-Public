var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                          .getService(Components.interfaces.nsIPromptService);

var types = Zotero.ItemTypes.getTypes();
var dict = {};

var localTypes = [];

for (i = 0; i < types.length; i++) {
    var s = Zotero.ItemTypes.getLocalizedString(types[i].id);
    dict[s] = types[i];
}

for (var key in dict) {
    if (dict.hasOwnProperty(key)) {
        localTypes.push(key);
    }
}

localTypes.sort();

Zotero.CustomFieldsEditor = {
	onLoad: function() {
		console.log("Init custom field editor");
		this.doc = Zotero.ZotPie.customFieldsDoc.document;
		//this.editAction = this.doc.getElementById('combo_action').value;
		//this.matchCase = false;
		//this.currentCollID = -1;
		this.addButton = this.doc.getElementById("addfield");
		this.addButton.disabled = true;

		this.removeButton = this.doc.getElementById("removefield");
		this.removeButton.disabled = true;

		this.itemTypes = this.doc.getElementById("itemtypes");
		this.itemFields = this.doc.getElementById("itemfields");
		this.tree = this.doc.getElementById("fieldtree");

		this._setupItemTypes();
		//this._setupTags();
	},

	_setupItemTypes: function() {
        
		this.itemTypes.appendItem("--Select Item Type--");
		for (i = 0; i < localTypes.length; i++) {
		    this.itemTypes.appendItem(localTypes[i]);
		}

		//for (var type of t) {
		//    itemTypes.appendItem(type);
		//}

		this.itemTypes.selectedIndex = 0;

	},
    
	selectedField : function () {
	    this.removeButton.disabled = true;
	    console.log(this.tree.currentIndex);
	    if (this.tree.currentIndex >= 0) {
	        this.removeButton.disabled = false;
	    }
	},

	getCustomFields: function () {

	    console.log("NICE ICE");
	    //var addButton = this.doc.getElementById("addfield");

	    while (this.itemFields.firstChild) {
	        this.itemFields.removeChild(this.itemFields.firstChild);
	    }

	    if (this.itemTypes.selectedIndex === 0) {
	        this.addButton.disabled = true;
	        return;
	    }

	    this.addButton.disabled = false;

	    var localType = (this.itemTypes.selectedItem).getAttribute("label");
	    console.log(localType);
	    var trueType = dict[localType];

	    //var fieldNames = db.get(truetype, col2);
	    //var fieldTypes = db.get(truetype, col3);

	    var fieldNames = ['Gregorian Date', 'Medical Number'];
	    var fieldTypes = ['Date', 'Number'];


	    for (i = 0; i < fieldNames.length; i++) {

	        var customField = this.doc.createElement("treeitem");
	        var row = this.doc.createElement("treerow");
	        var cell1 = this.doc.createElement("treecell");
	        cell1.setAttribute("label", fieldNames[i]);
            
	        var cell2 = this.doc.createElement("treecell");
	        cell2.setAttribute("label", fieldTypes[i]);

	        row.appendChild(cell1);
	        row.appendChild(cell2);

	        customField.appendChild(row);
	        this.itemFields.appendChild(customField);

	    }

	},

	openAddWindow: function () {

	    //var ww = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
        //                   .getService(Components.interfaces.nsIWindowWatcher);

	    //var array = Components.classes["@mozilla.org/array;1"]
        //              .createInstance(Components.interfaces.nsIMutableArray);

	    //var itemTypes = this.doc.getElementById("itemtypes");
	    //var type = (itemTypes.selectedItem).getAttribute("label");

	    //array.appendElement(type);
	    //ww.openWindow(null, "chrome://zotpie/content/customFieldsEditorWindow.xul",
        //    "Custom Fields Editor", "chrome,centerscreen", array);
	    Zotero.ZotPie.startCustomFieldsAdding();
	},

	removeSelectedField: function () {

	    var index = this.tree.currentIndex;
	    var type = (this.itemTypes.selectedItem).getAttribute("label");
	    var fieldName = this.tree.view.getCellText(index, this.tree.columns.getColumnAt(0));

	    var flags = ps.BUTTON_POS_0 * ps.BUTTON_TITLE_IS_STRING +
        ps.BUTTON_POS_1 * ps.BUTTON_TITLE_IS_STRING +
        ps.BUTTON_POS_2 * ps.BUTTON_TITLE_IS_STRING;

	    var button = ps.confirmEx(null, "Are you sure?", "Are you sure you want to remove the field " + fieldName + " from " + type + "?"
                                    + "\nNOTE: This will also remove ALL data associated with this field.",
                               flags, "Yes", "Cancel", null, null, {});

	    if (button == 0) {
	        this.tree.view.getItemAtIndex(index).parentNode.removeChild(this.tree.view.getItemAtIndex(index));
	    }
        //db.removeField("itemtype", "fieldname");
    }
};
