
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

		console.log(this.editAction);

		this._setupCollections();

	},

	_setupCollections: function() {
		console.log("populating menu");
		var menu = this.doc.getElementById('combo_collection');
		collections = Zotero.getCollections();

		// Set up the menu collection name as label and collection id as value
		for (var coll of collections) {
			menu.appendItem(coll.getName(), coll.getID());
		}
		menu.selectedIndex = 0;
	},

	onFindChange: function() {
		this.txtFind = this.doc.getElementById('txt_find').value;

		// var tokenizer = new this.natural.WordTokenizer();
		console.log(this.editDistance(this.txtFind, "DoG"));
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
			cboColl.disabled = false;
		}
	},

	onCollectionChange: function() {
		console.log("Change collection");
		var selected = this.doc.getElementById('combo_collection').index;
		this.currentCollID = selected;
	},

	batchTagEditTest: function () {
		var collStr = "hellos";
		var items = [];
		var collections = [];
		var collectionID;
		var allItems = [];
		var oldTags = ['a','abc','d'];
		var oldTagIds = [];
		var newTag = 'sometesttag'
        var ids = [];

        if (this.currentCollID > 0) {
        	var coll = Zotero.Collections.get(collectionID);
			allItems = coll.getChildItems();
        } else {
	  		allItems = Zotero.Items.getAll();
        }

		// if (collStr!= '') {
		// 	collections = Zotero.getCollections();

		// 	// Get the collection with the same name as the one searched for
		// 	collections.forEach(function(coll) {
		// 		if (coll.getName() == collStr) {
		// 			collectionID = coll.getID();
		// 		}
		// 	});
        	
  //       	var coll = Zotero.Collections.get(collectionID);
		// 	allItems = coll.getChildItems();
  //       } else {
	 //  		allItems = Zotero.Items.getAll();
  //       }

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

	onApply: function() {
		var newTag = this.doc.getElementById('txt_replace').value;
		var srcTags = [];
		if (this.editAction == 'modify') {
			batchTagEdit(srcTags, newTag);
		} else if (this.editAction == 'remove') {
			batchTagRemove();
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
	editDistance: function(a, b){
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
