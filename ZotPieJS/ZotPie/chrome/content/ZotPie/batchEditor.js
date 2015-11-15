
// var Zotero = Components.classes["@zotero.org/Zotero;1"]
// 				.getService(Components.interfaces.nsISupports)
// 				.wrappedJSObject;


// Initialize the utility
window.addEventListener('load', function(e) { Zotero.BatchEditor.init(); }, false);

Zotero.BatchEditor = {
	DB: null,
	
	init: function () {
		// Connect to (and create, if necessary) helloworld.sqlite in the Zotero directory
		this.DB = new Zotero.DBConnection('zotero');

		if (!this.DB.tableExists('changes')) {
			this.DB.query("CREATE TABLE changes (num INT)");
			this.DB.query("INSERT INTO changes VALUES (0)");
		}

		// Register the callback in Zotero as an item observer
		var notifierID = Zotero.Notifier.registerObserver(this.notifierCallback, ['item']);
		
		// Unregister callback when the window closes (important to avoid a memory leak)
		window.addEventListener('unload', function(e) {
				Zotero.Notifier.unregisterObserver(notifierID);
		}, false);


		// Our stuffs
		console.log("Init");
		this.matchCase = false;
		this.currentCollID = -1;
		this.editAction = document.getElementById("combo_action");
		this.txtFind = " fsdf";
		this._setupCollections();
	},

	_setupCollections: function() {
		console.log("populating menu");
		var menu = document.getElementById("combo_collection");
		collections = Zotero.getCollections();

		// Set up the menu collection name as label and collection id as value
		for (var coll in collections) {
			menu.appendItem(coll.getName(), coll.getID());
		}
		// collections.forEach(function(coll) {
		// 	menu.appendItem(coll.getName(), coll.getName());
		// 	if (coll.getName() == collStr) {
		// 		collectionID = coll.getID();
		// 	}
		// });
		menu.selectedIndex = 0;
	},

	onFindChange: function() {
		this.txtFind = document.getElementById("txt_find").value;
	},

	onActionChange: function() {

	},

	onScopeChange: function() {
		console.log("Change scope");
		console.log(this.txtFind);
		var cboScope = document.getElementById("combo_scope");
		if (cboScope.label == "All") {
			this.currentCollID = -1;
			cboScope.disabled = true;
		} else if (cboScope.label = "Collection") {
			cboScope.disabled = false;
			// onCollectionChange();
		}
	},

	onCollectionChange: function() {
		console.log("Change collection");
		var selected = document.getElementById("combo_collection").index;
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

		if (collStr!= '') {
			collections = Zotero.getCollections();

			// Get the collection with the same name as the one searched for
			collections.forEach(function(coll) {
				if (coll.getName() == collStr) {
					collectionID = coll.getID();
				}
			});
        	
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


        for (var i in items) {
        	// Get the tags of the item to edit
        	var allTags = items[i].getTags(); 

        	// Swap to lower case
        	if (!this.matchCase) {
        		var temp = oldTags.map(tag => tag.toLowerCase());
        		oldTags = temp;
        	}

        	for (var j in allTags) { //Slow?
        		console.log(j);
        		console.log(allTags[j].id);
        		if (!this.matchCase) {
				    if (oldTags.indexOf(allTags[j].name) != -1) {
				    	ids.push(allTags[j].id);
				    }
        		} else {
				    if (oldTags.indexOf(allTags[j].name.toLowerCase()) != -1) {
				    	ids.push(allTags[j].id);
				    }
        		}
			}
			console.log(ids);
			ids.forEach(function(id) {
            	items[i].removeTag(id);
			});
            items[i].addTag(newTag, 1);
			ids = [];
        }
	},

	batchTagEdit: function (oldTags, newTag, collection='') {
		var items = [];
		var collections = [];
		var collectionID;
		var allItems = [];

		// if (collection != '') {
  //           collections = self._zot.collections();

  //           // Default collection
  //           collectionID = collections[0]['data']['key']

  //           // Find the collectionID of collection collection
  //           for coll in collections:
  //               if coll['data']['name'] == collection:
  //                   collectionID = coll['data']['key']
            
  //           allItems = self._zot.collection_items(collectionID);
  //       } else {
  //           allItems = self._zot.items()
  //       }

		oldTags.forEach(function(tag) {
				items.push(Zotero.Item.getElementsByTagName(tag));
			}	
		);

		console.log(items);
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
