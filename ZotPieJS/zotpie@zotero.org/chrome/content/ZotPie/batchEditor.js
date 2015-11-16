
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

		// Connect to (and create, if necessary) helloworld.sqlite in the Zotero directory
		this.DB = new Zotero.DBConnection('zotero');

		if (!this.DB.tableExists('changes')) {
			this.DB.query("CREATE TABLE changes (num INT)");
			this.DB.query("INSERT INTO changes VALUES (0)");
		}

		// Register the callback in Zotero as an item observer
		var notifierID = Zotero.Notifier.registerObserver(this.notifierCallback, ['item']);
		
		window.addEventListener("DOMContentLoaded", function(e) {this.onLoad}, true);

		// Unregister callback when the window closes (important to avoid a memory leak)
		window.addEventListener('unload', function(e) {
				Zotero.Notifier.unregisterObserver(notifierID);
		}, false);

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
			return (self.editDistance(likeText, tag.name) <= 3);
		});

		newTagSet = this.removeDuplicateItems(newTagSet);

		console.log (newTagSet);
		console.log (this.changeSet);
		newTagSet = this.diff(newTagSet, this.changeSet);
		console.log (newTagSet);

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
		this.tagSet = this.removeDuplicateItems(this.tagSet);

		this.updateTags();
	},

	// b - a
	// slow?
	diff: function(b, a) {
    	return b.filter(function(i) {return !(i in a); });
	},

	// http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array
	// slow?
	removeDuplicateItems: function(items) {
	    var seen = {};
	    var out = [];
	    var len = items.length;
	    var j = 0;

	    for(var i = 0; i < len; i++) {
	         var item = items[i];
	         if(seen[item.id] !== 1) {
	               seen[item.id] = 1;
	               out[j++] = item;
	         }
	    }
	    return out;
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
	
	/*
	Copyright (c) 2011 Andrei Mackenzie
	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	*/

	// Compute the edit distance between the two given strings
	editDistance: function(a, b) {
	  if(a.length == 0) return b.length; 
	  if(b.length == 0) return a.length; 

	  var matrix = [];

	  // increment along the first column of each row
	  var i;
	  for(i = 0; i <= b.length; i++){
	    matrix[i] = [i];
	  }

	  // increment each column in the first row
	  var j;
	  for(j = 0; j <= a.length; j++){
	    matrix[0][j] = j;
	  }

	  // Fill in the rest of the matrix
	  for(i = 1; i <= b.length; i++){
	    for(j = 1; j <= a.length; j++){
	      if(b.charAt(i-1) == a.charAt(j-1)){
	        matrix[i][j] = matrix[i-1][j-1];
	      } else {
	        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
	                                Math.min(matrix[i][j-1] + 1, // insertion
	                                         matrix[i-1][j] + 1)); // deletion
	      }
	    }
	  }

	  return matrix[b.length][a.length];
	},


	insertHello: function() {
		var data = {
			title: "Zotero",
			company: "Center for History and New Media",
			creators: [
				['Dan', 'Stillman', 'programmer'],
				['Simon', 'Kornblith', 'programmer']
			],
			version: '1.0.1',
			company: 'Center for History and New Media',
			place: 'Fairfax, VA',
			url: 'http://www.zotero.org'
		};
		Zotero.Items.add('computerProgram', data); // returns a Zotero.Item instance
	},
	
	// Callback implementing the notify() method to pass to the Notifier
	notifierCallback: {
		notify: function(event, type, ids, extraData) {
			if (event == 'add' || event == 'modify' || event == 'delete') {
				// Increment a counter every time an item is changed
				Zotero.BatchEditor.DB.query("UPDATE changes SET num = num + 1");
				
				if (event != 'delete') {
					// Retrieve the added/modified items as Item objects
					var items = Zotero.Items.get(ids);
				}
				else {
					var items = extraData;
				}
				
				// Loop through array of items and grab titles
				var titles = [];
				for each(var item in items) {
					// For deleted items, get title from passed data
					if (event == 'delete') {
						titles.push(item.old.title ? item.old.title : '[No title]');
					}
					else {
						titles.push(item.getField('title'));
					}
				}
				
				if (!titles.length) {
					return;
				}
				
				// Get the localized string for the notification message and
				// append the titles of the changed items
				var stringName = 'notification.item' + (titles.length==1 ? '' : 's');
				switch (event) {
					case 'add':
						stringName += "Added";
						break;
						
					case 'modify':
						stringName += "Modified";
						break;
						
					case 'delete':
						stringName += "Deleted";
						break;
				}
				
				var str = document.getElementById('zotpie-zotero-strings').
					getFormattedString(stringName, [titles.length]) + ":\n\n" +
					titles.join("\n");
			}
			
			var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
				.getService(Components.interfaces.nsIPromptService);
			ps.alert(null, "", str);
		}
	}
};
