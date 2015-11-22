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

		var itemFilterElements = this.doc.getElementsByClassName('item_filter_only');
		var nonItemFilterElements = this.doc.getElementsByClassName('item_filter_excluded');

		for (var el of itemFilterElements) { 
			el.setAttribute('hidden', !Zotero.itemFilterSignal); 
		}
		for (var el of nonItemFilterElements) { 
			el.disabled = Zotero.itemFilterSignal; 
		}

		if (Zotero.itemFilterSignal && Zotero.batchedItems) {
			// Change scope to be this list of items
			this._ALLITEMS = this._ALLITEMS.filter(function(item) {
				// console.log(item.id);
				return Zotero.batchedItems.indexOf(item.id) >= 0;
			});

			this._setupItems(this._ALLITEMS);

			if (changeSet) {
				this.changeSet = changeSet;
				changeSet = null;
			}

			// if global itemFilterSignal is true, set signal to false.
			// We then use a local flag to handle logic in the class.
			this.itemFilterFlag = true;
			Zotero.itemFilterSignal = false;
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

	_setupItems: function(items) {
		var listItems = this.doc.getElementById('list_items');

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

		var item = this._ALLITEMS.find(function (x) {
			return x.id == selected; 
		}); 

		console.log (item);

		var tags = item.getTags();

		console.log (tags);

		var self = this;

		var indexSourceTags = tags.map(function(x) {
			return self.locationOfInListBox(
					x.name.toLowerCase(), lstSourceTags, self.stringComparator);
		}).filter(function (x) {
			return x >= 0;
		});

		var indexChangeTags = tags.map(function(x) {
			return self.locationOfInListBox(
					x.name.toLowerCase(), lstChangeTags, self.stringComparator);
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
		var cboColl = this.doc.getElementById('combo_collection')
		if (cboScope.value == "all") {
			this.currentCollID = -1;
			cboColl.disabled = true;
		} else if (cboScope.value == "collection") {
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
				this._ALLITEMS = this._ALLITEMS.filter(function(item) {
					return Zotero.batchedItems.indexOf(item.id) >= 0;
				});
			} else {
				this._ALLITEMS = [];
			}

			this.resetTags();
		}
	},

	batchTagAdd: function(newTags) {
		console.log(newTags);
		for (var item of this._ALLITEMS) {
			var missingTags = Zotero.Zotpie_Helpers.diff(newTags,
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

		// Get the scope of this modification
		if (this.currentCollID > 0) {
			var coll = Zotero.Collections.get(this.currentCollID);
			allItems = coll.getChildItems();
		} else {
			allItems = this._ALLITEMS;//Zotero.Items.getAll();
		}

		console.log(oldTags);

		// Get ids of the tags to be modified
		oldTagIDs = oldTags.map(function (tag) { // slow?
			return tag.id;
			// return Zotero.Tags.getID(tag, 0);
		});

		// Get ids of the tags to be modified
		oldTagNames = oldTags.map(function (tag) { // slow?
			return tag.name;
		});

		console.log(oldTagIDs);
		console.log(allItems);

		// Filters the list of all items to a sublist where each element
		// contains one (or more) old tags
		items = allItems.filter(function(item) { // slow?
			return item.hasTags(oldTagIDs);
		});

		console.log(items);

		for (var item of items) {
			// Get the tags of the item to edit
			var allTags = item.getTags(); 

			console.log(oldTagNames);

			// Swap to lower case
			if (!this.matchCase) {
				var temp = oldTagNames.map(tag => tag.toLowerCase() );
				oldTagNames = temp;
			}

			console.log(allTags);
			console.log(oldTagNames);

			for (var tag of allTags) { //Slow?
				// console.log(tag.id);
				if (!this.matchCase) {
					if (oldTagNames.indexOf(tag.name.toLowerCase()) >= 0) {
						ids.push(tag.id);
					}
				} else {
					if (oldTagNames.indexOf(tag.name) >= 0) {
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
