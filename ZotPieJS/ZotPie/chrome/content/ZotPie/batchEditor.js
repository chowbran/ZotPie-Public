// Initialize the utility
var ed_threshold = 2;
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

		var itemFilterElements = this.doc.getElementsByClassName('item_filter_only');
		var nonItemFilterElements = this.doc.getElementsByClassName('item_filter_excluded');

		for (var el of itemFilterElements) { 
			el.setAttribute('hidden', !(Zotero.batchedItems.length > 0)); 
		}
		for (var el of nonItemFilterElements) { 
			el.disabled = !(Zotero.batchedItems.length > 0); 
		}

		if (Zotero.batchedItems.length > 0) {
			console.log('hello');
			this.doc.getElementById('itm_Items').disabled = false;
			this.doc.getElementById('combo_scope').value = "items";

			// Change scope to be this list of items
			this._SCOPEDITEMS = this._ALLITEMS.filter(function(item) {
				// console.log(item.id);
				return Zotero.batchedItems.indexOf(item.id) >= 0;
			});

			this._setupItems(this._SCOPEDITEMS);

			if (changeSet) {
				this.changeSet = changeSet;
				changeSet = null;
			}

			// if global itemFilterSignal is true, set signal to false.
			// We then use a local flag to handle logic in the class.
			this.itemFilterFlag = true;
		} else {
			this._SCOPEDITEMS = this._ALLITEMS;
		}

		this._setupCollections();
		this._setupTags();
	},

	scopeToItems: function() {
		// Change scope to be this list of items
		this._SCOPEDITEMS = this._ALLITEMS.filter(function(item) {
			// console.log(item.id);
			return Zotero.batchedItems.indexOf(item.id) >= 0;
		});

		// if global itemFilterSignal is true, set signal to false.
		// We then use a local flag to handle logic in the class.
		this.itemFilterFlag = true;
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

	_setupItems: function(items) {
		var listItems = this.doc.getElementById('list_items');

		// listItems.clear();
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
				return (Zotero.Utilities.levenshtein(likeText, tag.name) <= ed_threshold);

				// return (Zotero.Zotpie_Helpers.editDistance(likeText, tag.name) <= ed_threshold);
			});
		} else {
			var newTagSet = this.tagSet;
		}

		// Remove duplicates
		// newTagSet = Zotero.Zotpie_Helpers.removeDuplicateItems(newTagSet);

		console.log (this.changeSet);

		// Remove tags already staged
		newTagSet = Zotero.Utilities.arrayDiff(newTagSet, this.changeSet);

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

		this.updateTagHighlights();
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

			if (value == 'USER_ADDED') {
				continue;
			}

			// Should we add it in?
			if (eID == 'list_tags' 
				|| !this.txtFind
				|| (Zotero.Utilities.levenshtein(this.txtFind, label)
				// || (Zotero.Zotpie_Helpers.editDistance(this.txtFind, label) 
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

		this.updateTagCount();
		this.updateTagHighlights();

	},

	updateTagCount: function () {
		var lblChangeCount = this.doc.getElementById('lbl_change_count')
		var str = this.changeSet.length + " changes";
		lblChangeCount.setAttribute('value', str);
	},

	/* Highlights all tags specified by the selected item in list_items.
	 * This is the onselect event handler for list_items
	 */
	updateTagHighlights: function () {
		var lstbox = this.doc.getElementById('list_items');
		var lstSourceTags = this.doc.getElementById('list_tags');
		var lstChangeTags = this.doc.getElementById('list_change');

		var selected;

		// No item selected
		if (!(selected = lstbox.selectedItem)) {
			return;
		}
		selected = selected.value;

		var item = this._SCOPEDITEMS.find(function (x) {
			return x.id == selected; 
		}); 

		console.log (item);

		var tags = item.getTags();

		console.log (tags);

		var self = this;

		var changeTagNames = self.changeSet.map(y => y.name);

		var indexSourceTags = tags.map(function(x) {
			return changeTagNames.indexOf(x.name) >= 0 ? -1 : self.locationOfInListBox(
					x.name.toLowerCase(), lstSourceTags, self.stringComparator);
		}).filter(function (x) {
			return x >= 0;
		});

		console.log(this.changeSet);

		var indexChangeTags = tags.map(function(x) {
			return changeTagNames.indexOf(x.name) >= 0 ? self.locationOfInListBox(
					x.name.toLowerCase(), lstChangeTags, self.stringComparator) : -1;
		}).filter(function (x) {
			return x >= 0;
		});


		console.log(indexSourceTags);
		console.log(indexChangeTags);

		var count = lstSourceTags.itemCount;
		for (var i = 0; i < count; i++) {
			if (indexSourceTags.indexOf(i) >= 0) {
				lstSourceTags.getItemAtIndex(i).setAttribute('checked', true);
			} else {
				lstSourceTags.getItemAtIndex(i).setAttribute('checked', false);
			}
		}

		count = lstChangeTags.itemCount;
		for (var i = 0; i < count; i++) {
			if (indexChangeTags.indexOf(i) >= 0) {
				lstChangeTags.getItemAtIndex(i).setAttribute('checked', true);
			} else {
				lstChangeTags.getItemAtIndex(i).setAttribute('checked', false);
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

		var lbl = lstbox.getItemAtIndex(pivot).getAttribute('label').toLowerCase();

		var c = comparator(element, lbl);
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

	// sample for objects like {lastName: 'Miller', ...}
	integerComparator: function (a, b) {
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

		// if (collectionID>0) {
		// 	this.tagSet = this._SCOPEDITEMS.filter(function (item) {
		// 		return item.inCollection(collectionID);
		// 	}).map(function (item) {
		// 		return item.getTags();
		// 	});
		// } else {
		// 	var allTags = Zotero.Tags.getAll();
		// 	this.tagSet = this._SCOPEDITEMS.map(function (item) {
		// 		return item.getTags();
		// 	});
		// }

		// var allTags = Zotero.Tags.getAll();
		// var scopedItemIDS = this._SCOPEDITEMS.map(function (item) {
		// 					return item.id;
		// 				});
		if (collectionID>0) {
			// this.tagSet = this.allTags.map(function (tag) {
			// 	var itemIDs = tag.getLinkedItems(true);

			// })
			this.tagSet = this._SCOPEDITEMS.map(function (item) {
				return item.getTags();
			});
		} else {
			// this.tagSet = this.allTags.map(function (tag) {
			// 	var itemIDs = tag.getLinkedItems(true);

			// })
			this.tagSet = this._SCOPEDITEMS.map(function (item) {
				return item.getTags();
			});
		}

		// Flatten array
		this.tagSet = [].concat.apply([],this.tagSet);

		// Remove the duplicates
		this.tagSet = Zotero.Zotpie_Helpers.removeDuplicateItems(this.tagSet);
		// this.tagSet = this.removeDuplicateItems(this.tagSet);

		// Clear staged changes
		this.changeSet = [];

		this.clearChangeListBox();
		this.updateTags();
	},

	clearChangeListBox: function () {
		var lstbox = this.doc.getElementById('list_change');
		var count = lstbox.itemCount;

		while(count--) {
			lstbox.removeItemAt(0);
		}

		var lblChangeCount = this.doc.getElementById('lbl_change_count')
		lblChangeCount.setAttribute('value', '0 changes');

	},

	onActionChange: function() {
		var txtReplace = this.doc.getElementById('txt_replace');
		var lblReplace = this.doc.getElementById('lbl_replace');
		var lblChangedInfo = this.doc.getElementById('lbl_changed');
		this.editAction = this.doc.getElementById('combo_action').value;
		
		if (this.editAction === 'remove') {
			txtReplace.disabled = true;
		} else {
			txtReplace.disabled = false;
		}

		if (this.editAction === 'add') {
			lblChangedInfo.value = 'Tags to be Added:';
			lblReplace.value = "Add: ";
		} else {
			lblChangedInfo.value = 'Tags to be Changed:';
			lblReplace.value = "Replace: ";
		}

		var excludeOnAddAction = this.doc.getElementsByClassName('add_action_excluded');
		for (var el of excludeOnAddAction) { 
			el.setAttribute('hidden', this.editAction === 'add'); 
		}

		this.resetTags(this.currentCollID);
	},

	onScopeChange: function() {
		var cboScope = this.doc.getElementById('combo_scope');
		var cboColl = this.doc.getElementById('combo_collection');
		if (cboScope.value == "all") {
			this._SCOPEDITEMS = this._ALLITEMS;
			this.currentCollID = -1;
			cboColl.disabled = true;
		} else if (cboScope.value == "collection") {
			this.currentCollID = this.doc.getElementById('combo_collection').value;
			cboColl.disabled = false;
			this.onCollectionChange();
		} else if (cboScope.value == "items") {
			this.currentCollID = -1;
			cboColl.disabled = true;
			this.scopeToItems();
		}



		this.resetTags(this.currentCollID);
	},


	onCollectionChange: function() {
		console.log("Change collection");

		var selected = this.doc.getElementById('combo_collection').value;

		if (selected >= 0) {
	        var collection = Zotero.Collections.get(selected);
	        var itemIds = collection.getChildItems(true, false);

	        console.log (collection);
	        console.log (itemIds);

			this._SCOPEDITEMS = this._ALLITEMS.filter(function(x) {
				return (itemIds.indexOf(x.id) >= 0);
			});

		}

		this.resetTags(selected);
		this.currentCollID = selected;
	},


	onApply: function() {
 		var newTag = this.doc.getElementById('txt_replace').value;
		var srcTags = this.changeSet;

		if (this.editAction == 'modify') {
			this.batchTagEdit(srcTags, newTag);
		} else if (this.editAction == 'remove') {
			this.batchTagEdit(srcTags);
		} else if (this.editAction == 'add') {
			this.batchTagAdd(srcTags);
		}

		this.resetTags();
	},

	onEnterKey: function (aEvent) {
		if (this.editAction == 'add') { // Only used during the enter option
			if (aEvent.keyCode == 13) {
					var lstbox = this.doc.getElementById('list_change');
					var label = this.doc.getElementById('txt_replace').value;

				console.log (this.changeSet);
				console.log (label);
				if (this.changeSet.indexOf(label) < 0) {
					var index = this.locationOfInListBox(
						label.toLowerCase(), lstbox, this.stringComparator);

					lstbox.insertItemAt(index+1, label, 'USER_ADDED');

					this.changeSet.push(label);
				}
			}
		}
	},

	onItemDelete: function (aEvent) {
		if ((aEvent.target.id == 'list_items' 
				&& aEvent.keyCode === KeyEvent.VK_DELETE)
			|| aEvent.target.id == 'btn_remove_item') {
			console.log ('Delete event');

			var lstbox = this.doc.getElementById('list_items');
			var item = lstbox.selectedItem;
			var index = item.value;

			lstbox.removeItemAt(lstbox.getIndexOfItem(item));


			console.log(Zotero.batchedItems);
			var i = Zotero.Zotpie_Helpers.locationOf(index, Zotero.batchedItems, this.integerComparator);

			if (i > -1) {
			    Zotero.batchedItems.splice(i, 1);
			}

			console.log(Zotero.batchedItems);

			if (Zotero.batchedItems) {
				// Reload _ALLITEMS
				this._SCOPEDITEMS = this._SCOPEDITEMS.filter(function(item) {
					return Zotero.batchedItems.indexOf(item.id) >= 0;
				});
			} else {
				this._SCOPEDITEMS = [];
			}

			this.resetTags();

			if (lstbox.itemCount == 0) {
				this.doc.getElementById('itm_Items').disabled = true;
			}
		}
	},


	batchTagAdd: function(newTags) {
		console.log(newTags);
		for (var item of this._SCOPEDITEMS) {
			var missingTags = Zotero.Utilities.arrayDiff(newTags,
				item.getTags().map(x => x.name));
			item.addTags(missingTags, 1);
		}
	},

	batchTagEdit: function (oldTags, newTag) {
		var items = [];
		var allItems = [];
		var oldTagIds = [];
		var ids = [];
		var oldTagNames = [];

		allItems = this._SCOPEDITEMS;

		// // Get the scope of this modification
		// if (this.currentCollID > 0) {
		// 	var coll = Zotero.Collections.get(this.currentCollID);
		// 	allItems = coll.getChildItems();
		// } else {
		// 	allItems = this._SCOPEDITEMS;//Zotero.Items.getAll();
		// }

		console.log(oldTags);

		// Get ids of the tags to be modified
		oldTagIDs = oldTags.map(function (tag) { // slow?
			return tag.id;
			// return Zotero.Tags.getID(tag, 0);
		});

		// Get names of the tags to be modified
		// oldTagNames = oldTags.map(function (tag) { // slow?
		// 	return tag.name;
		// });

		// Filters the list of all items to a sublist where each element
		// contains one (or more) old tags
		items = allItems.filter(function(item) { // slow?
			return item.hasTags(oldTagIDs);
		});

		console.log(items);

		for (var item of items) {
			// Get the tags of the item to edit
			var allTags = item.getTags(); 

			// Swap to lower case
			if (!this.matchCase) {
				var temp = oldTagNames.map(tag => tag.toLowerCase() );
				oldTagNames = temp;
			}

			// // Loop through all tags in the item
			// for (var tag of allTags) { //Slow?
			// 	// If the tag.name exists in our oldTagsNames array, record it
			// 	if (!this.matchCase) {
			// 		if (oldTagNames.indexOf(tag.name.toLowerCase()) >= 0) {
			// 			ids.push(tag.id);
			// 		}
			// 	} else {
			// 		if (oldTagNames.indexOf(tag.name) >= 0) {
			// 			ids.push(tag.id);
			// 		}
			// 	}
			// }

			for (var id of oldTagIDs) {
				item.removeTag(id);
			}

			// ids.forEach(function(id) {
			// 	item.removeTag(id);
			// });

			if (newTag) {
				item.addTag(newTag, 1);
			}
			ids = [];
		}
	}
};
