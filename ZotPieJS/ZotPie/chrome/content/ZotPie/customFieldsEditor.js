var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                          .getService(Components.interfaces.nsIPromptService);

var types = Zotero.ItemTypes.getTypes();
var typeMap = {};

var localTypes = [];

for (i = 0; i < types.length; i++) {
    var s = Zotero.ItemTypes.getLocalizedString(types[i].id);
    typeMap[s] = types[i].name;
}

for (var key in typeMap) {
    if (typeMap.hasOwnProperty(key)) {
        localTypes.push(key);
    }
}

localTypes.sort();

Zotero.CustomFieldsEditor = {
	onLoad: function() {
		console.log("Init custom field editor");
		this.doc = Zotero.ZotPie.customFieldsDoc.document;

        // Get reference to docuement elements
		this.addButton = this.doc.getElementById("addfield");
		this.addButton.disabled = true;

		this.removeButton = this.doc.getElementById("removefield");
		this.removeButton.disabled = true;

		this.itemTypes = this.doc.getElementById("itemtypes");
		this.itemFields = this.doc.getElementById("itemfields");
		this.tree = this.doc.getElementById("fieldtree");

        // Find native Zotero item types and populate the dropdown
		this._setupItemTypes();
	},

	_setupItemTypes: function () {
        // Append the default element to dropdown
	    this.itemTypes.appendItem("--Select Item Type--");

        // Append all the localized types to dropdown
		for (i = 0; i < localTypes.length; i++) {
		    this.itemTypes.appendItem(localTypes[i]);
		}

		this.itemTypes.selectedIndex = 0;
	},
    
	selectedField: function () {
        // Enable remove button only when something is selected in the tree
	    this.removeButton.disabled = true;
	    if (this.tree.currentIndex >= 0) {
	        this.removeButton.disabled = false;
	    }
	},

	getTrueType: function (localType) {
	    return typeMap[localType];
	},

	getCustomFields: function () {

        // Remove previous elements in the tree
	    while (this.itemFields.firstChild) {
	        this.itemFields.removeChild(this.itemFields.firstChild);
	    }

	    // Disable add button if the selected element in the dropdown
	    // is the default index
	    if (this.itemTypes.selectedIndex === 0) {
	        this.addButton.disabled = true;
	        return;
	    }

	    this.addButton.disabled = false;

        // Get current selected value (localType) and find the trueType
	    var localType = (this.itemTypes.selectedItem).getAttribute("label");
	    var trueType = typeMap[localType];

        // Get the field names/types pertaining to the type of item
	    var fieldNames = Zotero.ZotPie.DBHelper.getFieldName(trueType);
	    var fieldTypes = Zotero.ZotPie.DBHelper.getFieldType(trueType);

	    // Quit early if field names doesn't exist
        // This also means field types don't exist
	    if (fieldNames === false) {
	        return;
	    }

        // Populate the tree with field names/types
	    for (i = 0; i < fieldNames.length; i++) {

	        if (fieldNames[i] === "") {
	            continue;
	        }

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
	    Zotero.ZotPie.startCustomFieldsAdding();
	},

	removeSelectedField: function () {
        // Get current selected item in the tree
	    var index = this.tree.currentIndex;
	    var type = (this.itemTypes.selectedItem).getAttribute("label");
	    var fieldName = this.tree.view.getCellText(index, this.tree.columns.getColumnAt(0));

        // Prompt flags
	    var flags = ps.BUTTON_POS_0 * ps.BUTTON_TITLE_IS_STRING +
        ps.BUTTON_POS_1 * ps.BUTTON_TITLE_IS_STRING +
        ps.BUTTON_POS_2 * ps.BUTTON_TITLE_IS_STRING;

	    var button = ps.confirmEx(null, "Are you sure?", "Are you sure you want to remove the field " + fieldName + " from " + type + "?"
                                    + "\nNOTE: This will also remove ALL data associated with this field.",
                               flags, "Yes", "Cancel", null, null, {});

	    // If the user clicks Yes, remove the field name from the item type
	    // as well as remove all data (pertaining to that field name)
	    // from all items of that item type
	    if (button == 0) {
            // Get the true item type, its field names/types
	        var trueType = typeMap[type];
	        var fields = Zotero.ZotPie.DBHelper.getFieldName(trueType);
	        var types2 = Zotero.ZotPie.DBHelper.getFieldType(trueType);

	        var i = fields.indexOf(fieldName);

            // Find all items with that item type
	        var s = new Zotero.Search();
	        s.addCondition('itemType', 'is', trueType);
	        var results = s.search();

            // Remove field data from those items
	        for (j = 0; j < results.length; j++) {
                // Get the field data of the item
	            var fieldData = Zotero.ZotPie.DBHelper.getFieldData(results[j]);

	            if (fieldData === false) {
	                continue;
	            }

	            // Append the empty string until the lengths are equal
                // so that indices work properly
	            while (fieldData.length < fields.length) {
	                fieldData.push("");
	            }

	            // If we removed all the custom fields, then remove
                // all the field data as well (is this needed?)
	            if (fields[0] === undefined) {
	                fieldData = [];
	            } else {
	                // Remove the data from the item at a specific index
                    // equal to the index of the removed field
	                fieldData.splice(i, 1);
	            }

                // Set the field data of the item
	            Zotero.ZotPie.DBHelper.setFieldData(results[j], fieldData);
	        }

            // Remove the item from the field names/types
	        if (i > -1) {
	            fields.splice(i, 1);
	            types2.splice(i, 1);
	        }

            // Set the field names/types
	        Zotero.ZotPie.DBHelper.setFieldName(trueType, fields);
	        Zotero.ZotPie.DBHelper.setFieldType(trueType, types2);

            // Remove item from tree view
	        this.tree.view.getItemAtIndex(index).parentNode.removeChild(this.tree.view.getItemAtIndex(index));
	    }
    }
};
