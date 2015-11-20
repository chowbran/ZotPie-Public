
// var Zotero = Components.classes["@zotero.org/Zotero;1"]
// 				.getService(Components.interfaces.nsISupports)
// 				.wrappedJSObject;


// Initialize the utility
window.addEventListener('load', function(e) { Zotero.BatchEditor.init(); }, false);

Zotero.BatchEditor = {
	DB: null,
	// natural: require('natural'),
	
	init: function () {
		// this.batchEditorInit();

		window.addEventListener("DOMContentLoaded", function(e) {this.onLoad}, true);
	},

	onLoad: function() {
		console.log("Init batchTagEditor");
		this.doc = Zotero.ZotPie.batchEditorDoc.document;
		this.editAction = this.doc.getElementById('combo_action').value;
		this.matchCase = false;
		this.currentCollID = -1;

		this._setupCollections();
		this._setupTags();
	},

	_setupCollections: function() {
		var menu = this.doc.getElementById('combo_collection');
		collections = Zotero.getCollections();

		// Set up the menu collection name as label and collection id as value
		for (var coll of collections) {
			menu.appendItem(coll.getName(), coll.getID());
		}
		menu.selectedIndex = 0;

	},

	_setupTags: function() {
		this.ALLITEMS = Zotero.Items.getAll(); 
		this.changeSet = [];
		this.resetTags(this.currentCollID);

		// this.tagSet = Zotero.Tags.getAll();
	},

	/* Updates the listbox of tags that are in the unchanged list.
	 * Triggered each time the search box is edited.
	 */
	updateTags: function(likeText) {
		var self = this;

		// Clear listbox
		var listbox = this.doc.getElementById('list_tags');
		var count = listbox.itemCount;
		console.log(count);

		while (count--) {
			listbox.removeItemAt(count);
		}

		if (!likeText || likeText.length == 0) {
			return;
		}

		var newTagSet = this.tagSet.filter(function (tag) {
			return (Zotero.Zotpie_Helpers.editDistance(likeText, tag.name) <= 3);
		});

		// Remove duplicates
		newTagSet = Zotero.Zotpie_Helpers.removeDuplicateItems(newTagSet);

		// Remove tags already staged
		newTagSet = Zotero.Zotpie_Helpers.diff(newTagSet, this.changeSet);

		console.log(newTagSet);

		newTagSet.sort(function(a, b) {
			var titleA = a.name.toLowerCase();
			var titleB = b.name.toLowerCase();
			if (titleA < titleB) //sort string ascending
				return -1;
			if (titleA > titleB)
				return 1;
			return 0; //default return value (no sorting)
		});

		for (var tag of newTagSet) {
			listbox.appendItem(tag.name, tag.id);
		}
	},

	onSelect: function(element) {
		var eID = element.getAttribute('id');
		var lstSource = this.doc.getElementById(eID);
		var lstTarget;

		if (eID == 'list_tags') {
			lstTarget = this.doc.getElementById('list_change');
		} else {
			lstTarget = this.doc.getElementById('list_tags');
		}

		var count = lstSource.selectedCount;
		while (count--) {
			var item = lstSource.selectedItems[0];
			lstSource.removeItemAt(lstSource.getIndexOfItem(item));

			var label = item.getAttribute('label');
			var value = item.getAttribute('value');

			lstTarget.appendItem(label, value);

			if (eID == 'list_tags') {
				this.changeSet.push(Zotero.Tags.get(value));
			} else {
				this.changeSet.splice(this.changeSet.indexOf(Zotero.Tags.get(value)), 1);
				this.changeSet.remove(Zotero.Tags.get(value));
				lstTarget = this.doc.getElementById('list_tags');
			}
		}
	},

	onFindChange: function() {
		this.txtFind = this.doc.getElementById('txt_find').value;

		this.updateTags(this.txtFind);
	},

	/* Resets the total tag set, relative to the current 
	 * collection with collection id collectionID.
	 */
	resetTags: function(collectionID) {
		this.tagSet = this.ALLITEMS.filter(function (item) {
			return collectionID > 0 ? item.inCollection(collectionID) : item;
		}).map(function (item) {
			return item.getTags();
		});

		// Flatten array
		this.tagSet = [].concat.apply([],this.tagSet);

		// Remove the duplicates
		this.tagSet = Zotero.Zotpie_Helpers.removeDuplicateItems(this.tagSet);
		// this.tagSet = this.removeDuplicateItems(this.tagSet);

		this.updateTags();
	},

	onActionChange: function() {
		var txtReplace = this.doc.getElementById('txt_replace');

		this.editAction = this.doc.getElementById('combo_action').value;

		if (this.editAction == 'modify') {
			txtReplace.disabled = false;
		} else if (this.editAction == 'remove') {
			txtReplace.disabled = true;
		}
	},

	onScopeChange: function() {
		var cboScope = this.doc.getElementById('combo_scope');
		var cboColl = this.doc.getElementById('combo_collection')
		if (cboScope.value == "all") {
			this.currentCollID = -1;
			cboColl.disabled = true;
		} else if (cboScope.value = "collection") {
			this.currentCollID = this.doc.getElementById('combo_collection').value;
			cboColl.disabled = false;
		}

		this.resetTags(this.currentCollID);
	},

	onCollectionChange: function() {
		console.log("Change collection");
		var selected = this.doc.getElementById('combo_collection').value;
		this.currentCollID = selected;

		this.resetTags(this.currentCollID);
	},


	onApply: function() {
		var newTag = this.doc.getElementById('txt_replace').value;
		var srcTags = [];
		if (this.editAction == 'modify') {
			batchTagEdit(srcTags, newTag);
		} else if (this.editAction == 'remove') {
			batchTagRemove(srcTags);
		}
	},

	batchTagRemove: function (oldTags) {
		var collStr = "hellos";
		var items = [];
		var collections = [];
		var collectionID;
		var allItems = [];
		var oldTagIds = [];
        var ids = [];

        if (this.currentCollID > 0) {
        	var coll = Zotero.Collections.get(collectionID);
			allItems = coll.getChildItems();
        } else {
	  		allItems = Zotero.Items.getAll();
        }

        oldTagIDs = oldTags.map(function (tag) { // slow?
        	return Zotero.Tags.getID(tag, 0);
        });

        // Filters the list of all items to a sublist where each element
        // contains one (or more) old tags
        items = allItems.filter(function(item) { // slow?
        	var result = item.hasTags(oldTagIDs);
        	return result;
        });

        for (var item of items) {
        	// Get the tags of the item to edit
        	var allTags = item.getTags(); 

        	// Swap to lower case
        	if (!this.matchCase) {
        		var temp = oldTags.map(tag => tag.toLowerCase());
        		oldTags = temp;
        	}

        	for (var tag of allTags) { //Slow?
        		if (!this.matchCase) {
				    if (oldTags.indexOf(tag.name) != -1) {
				    	ids.push(tag.id);
				    }
        		} else {
				    if (oldTags.indexOf(tag.name.toLowerCase()) != -1) {
				    	ids.push(tag.id);
				    }
        		}
			}
			ids.forEach(function(id) {
            	item.removeTag(id);
			});
			ids = [];
		}
	},

	batchTagEdit: function (oldTags, newTag) {
		var collStr = "hellos";
		var items = [];
		var collections = [];
		var collectionID;
		var allItems = [];
		var oldTagIds = [];
        var ids = [];

        if (this.currentCollID > 0) {
        	var coll = Zotero.Collections.get(collectionID);
			allItems = coll.getChildItems();
        } else {
	  		allItems = Zotero.Items.getAll();
        }

        oldTagIDs = oldTags.map(function (tag) { // slow?
        	return Zotero.Tags.getID(tag, 0);
        });

        console.log(oldTagIDs);
        console.log(allItems);

        // Filters the list of all items to a sublist where each element
        // contains one (or more) old tags
        items = allItems.filter(function(item) { // slow?
        	var result = item.hasTags(oldTagIDs);
        	return result;
        });

        console.log(items);


        for (var item of items) {
        	// Get the tags of the item to edit
        	var allTags = item.getTags(); 

        	// Swap to lower case
        	if (!this.matchCase) {
        		var temp = oldTags.map(tag => tag.toLowerCase());
        		oldTags = temp;
        	}

        	for (var tag of allTags) { //Slow?
        		console.log(j);
        		console.log(tag.id);
        		if (!this.matchCase) {
				    if (oldTags.indexOf(tag.name) != -1) {
				    	ids.push(tag.id);
				    }
        		} else {
				    if (oldTags.indexOf(tag.name.toLowerCase()) != -1) {
				    	ids.push(tag.id);
				    }
        		}
			}
			console.log(ids);
			ids.forEach(function(id) {
            	item.removeTag(id);
			});
            item.addTag(newTag, 1);
			ids = [];
		}
	},
	


};
