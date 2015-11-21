// Initialize the utility
var ed_threshold = 3;
var changeSet = null;
Zotero.BatchEditor = {


	onLoad: function() {
		console.log('Init batchTagEditor');

		this._ALLITEMS = Zotero.Items.getAll(); 
		this.doc = Zotero.ZotPie.batchEditorDoc.document;
		this.editAction = this.doc.getElementById('combo_action').value;
		this.matchCase = false;
		this.currentCollID = -1;

		this.changeSet = [];

		var comboCollection = this.doc.getElementById('combo_collection');
		var comboScope = this.doc.getElementById('combo_scope');
		var listItems = this.doc.getElementById('list_items');
		var lblItems = this.doc.getElementById('lbl_items');
		var splitScreen = this.doc.getElementById('split_screen');
		var menuActionAdd = this.doc.getElementById('menu_actionAdd');

		if (Zotero.itemFilterSignal && Zotero.batchedItems) {
			// Change scope to be this list of items
			console.log(this._ALLITEMS);
			console.log(Zotero.batchedItems);
			this._ALLITEMS = this._ALLITEMS.filter(function(item) {
				// console.log(item.id);
				return Zotero.batchedItems.indexOf(item.id) >= 0;
			});
			console.log(this._ALLITEMS);



			comboCollection.disabled = true;
			comboScope.disabled = true;
			listItems.setAttribute('hidden', false);
			lblItems.setAttribute('hidden', false);		
			splitScreen.setAttribute('hidden', false);
			menuActionAdd.setAttribute('hidden', false);

			this._setupItems(this._ALLITEMS, listItems);

			if (changeSet) {
				this.changeSet = changeSet;
				changeSet = null;
			}

			// if global itemFilterSignal is true, set signal to false.
			// We then use a local flag to handle logic in the class.
			this.itemFilterFlag = true;
			Zotero.itemFilterSignal = false;
		} else {
			comboCollection.disabled = false;
			comboScope.disabled = false;
			listItems.setAttribute('hidden', true);
			lblItems.setAttribute('hidden', true);		
			splitScreen.setAttribute('hidden', true);
			menuActionAdd.setAttribute('hidden', true);
		}


		this._setupCollections();
		this._setupTags();
	},

	onBeforeUnLoad: function () {
		/* Keep the changeSet persistent if the user chooses to add
		 * with the window open
		 */
		if (this.changeSet) {
			changeSet = this.changeSet;
		}

		/* If this isn't an item filter instance, we 
		 * clear persistence changeSet
		 */
		if (changeSet && !this.itemFilterFlag) {
			changeSet = null;
		}
	},

	_setupItems: function(items, listItems) {
		if (!listItems) {
			listItems = this.doc.getElementById('list_items');
		}

		for (var item of items) {
			listItems.appendItem(item.getDisplayTitle(false), item.id);
		}
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
		this.resetTags(this.currentCollID);

		var changeList = this.doc.getElementById('list_change');
		console.log(this.changeSet);
		if (this.changeSet) {
			for (var tag of this.changeSet) {
				console.log(tag.name + tag.id);
				changeList.appendItem(tag.name, tag.id);
			}
		}

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

		if(!listbox) {
			return;
		}

		while (count--) {
			listbox.removeItemAt(count);
		}

		if (likeText) {
			var newTagSet = this.tagSet.filter(function (tag) {
				return (Zotero.Zotpie_Helpers.editDistance(likeText, tag.name) <= ed_threshold);
			});
		} else {
			var newTagSet = this.tagSet;
		}

		// Remove duplicates
		newTagSet = Zotero.Zotpie_Helpers.removeDuplicateItems(newTagSet);

		console.log (this.changeSet);

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

	/* Triggered when the user selects items from either tag list.
	 * Moves the selected item(s) from the current list to the other
	 * tag list.
	 * Currently supports muliselect but is currently unused since
	 * this triggers each listbox onselect event
	 */
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

			// Should we add it in?
			if (eID == 'list_tags' 
				|| !this.txtFind
				|| (Zotero.Zotpie_Helpers.editDistance(this.txtFind, label) 
					<= ed_threshold)) {
				// Where do we add it?
				var index = this.locationOfInListBox(
					label.toLowerCase(), lstTarget, this.stringComparator);
				lstTarget.insertItemAt(index+1, label, value);
			}


			// Update changeSet
			if (eID == 'list_tags') {
				this.changeSet.push(Zotero.Tags.get(value));
			} else {
				var res = this.changeSet.map(function (x) { return x.name} ).indexOf(label);
				if (res > -1) {
					this.changeSet.splice(res, 1);
				}
			}
		}
	},

	locationOfInListBox: function (element, lstbox, comparator, start, end) {
	    if (lstbox.itemCount === 0) {
	        return -1;
	    }

	    start = start || 0;
	    end = end || lstbox.itemCount;
	    var pivot = (start + end) >> 1;

	    var c = comparator(element, lstbox.getItemAtIndex(pivot).label.toLowerCase());
	    if (end - start <= 1) {
	    	return c == -1 ? pivot - 1 : pivot;
	    }

	    switch (c) {
	        case -1: 
	        	return this.locationOfInListBox(element, lstbox, comparator, start, pivot);
	        case 0: 
	        	return pivot;
	        case 1: 
	        	return this.locationOfInListBox(element, lstbox, comparator, pivot, end);
	    };
	},

	// sample for objects like {lastName: 'Miller', ...}
	stringComparator: function (a, b) {
	    if (a < b) return -1;
	    if (a > b) return 1;
	    return 0;
	},

	onFindChange: function() {
		this.txtFind = this.doc.getElementById('txt_find').value;

		this.updateTags(this.txtFind);
	},

	/* Resets the total tag set, relative to the current 
	 * collection with collection id collectionID.
	 */
	resetTags: function(collectionID) {
		this.tagSet = this._ALLITEMS.filter(function (item) {
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
		var lblReplace = this.doc.getElementById('lbl_replace');
		var lblChangedInfo = this.doc.getElementById('lbl_changed');
		this.editAction = this.doc.getElementById('combo_action').value;
		
		if (this.editAction == 'remove') {
			txtReplace.disabled = true;
		} else {
			txtReplace.disabled = false;
		}

		if (this.editAction == 'add') {
			lblChangedInfo.value = 'Tags to be Added:';
			lblReplace.value = "Add";
		} else {
			lblChangedInfo.value = 'Tags to be Changed:';
			lblReplace.value = "Replace";
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
			batchTagEdit(srcTags);
		} else if (this.editAction == 'add') {
			batchTagAdd(srcTags);
		}
	},

	// batchTagRemove: function (oldTags) {
	// 	var collStr = "hellos";
	// 	var items = [];
	// 	var collections = [];
	// 	var collectionID;
	// 	var allItems = [];
	// 	var oldTagIds = [];
 //        var ids = [];

 //        if (this.currentCollID > 0) {
 //        	var coll = Zotero.Collections.get(collectionID);
	// 		allItems = coll.getChildItems();
 //        } else {
	//   		allItems = this._ALLITEMS;//Zotero.Items.getAll();
 //        }

 //        oldTagIDs = oldTags.map(function (tag) { // slow?
 //        	return Zotero.Tags.getID(tag, 0);
 //        });

 //        // Filters the list of all items to a sublist where each element
 //        // contains one (or more) old tags
 //        items = allItems.filter(function(item) { // slow?
 //        	var result = item.hasTags(oldTagIDs);
 //        	return result;
 //        });

 //        for (var item of items) {
 //        	// Get the tags of the item to edit
 //        	var allTags = item.getTags(); 

 //        	// Swap to lower case
 //        	if (!this.matchCase) {
 //        		var temp = oldTags.map(tag => tag.toLowerCase());
 //        		oldTags = temp;
 //        	}

 //        	for (var tag of allTags) { //Slow?
 //        		if (!this.matchCase) {
	// 			    if (oldTags.indexOf(tag.name) != -1) {
	// 			    	ids.push(tag.id);
	// 			    }
 //        		} else {
	// 			    if (oldTags.indexOf(tag.name.toLowerCase()) != -1) {
	// 			    	ids.push(tag.id);
	// 			    }
 //        		}
	// 		}
	// 		ids.forEach(function(id) {
 //            	item.removeTag(id);
	// 		});
	// 		ids = [];
	// 	}
	// },

	batchTagEdit: function (oldTags, newTag) {
		var collStr = "hellos";
		var items = [];
		var collections = [];
		var collectionID;
		var allItems = [];
		var oldTagIds = [];
        var ids = [];

        // Get the scope of this modification
        if (this.currentCollID > 0) {
        	var coll = Zotero.Collections.get(collectionID);
			allItems = coll.getChildItems();
        } else {
	  		allItems = this._ALLITEMS;//Zotero.Items.getAll();
        }

        // Get ids of the tags to be modified
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

			if (newTag) {
            	item.addTag(newTag, 1);
        	}
			ids = [];
		}
	}
};
