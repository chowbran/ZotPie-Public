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
	},

	batchTagEditTest: function () {
		var items = [];
		var collections = [];
		var collectionID;
		var allItems = [];
		var oldTags = ['a','abc','d'];
		var oldTagIds = ['a','abc','d'];
		var collection = 'Hellos'
		var newTag = 'sometesttag'

		if (collection != '') {
			collections = Zotero.getCollections();
			collections.forEach(function(coll) {
				if (coll.getName() == collection) {
					collectionID = coll.getID();
				}
			});
			allItems = Zotero.Collections.get(collectionID).getChildItems();
        } else {
	  		allItems = Zotero.Items.getAll();
        }


        console.log(Zotero.Tags.getID(oldTags[0], 0));
        console.log(Zotero.Tags.getID(oldTags[1], 0));
        console.log(Zotero.Tags.getID(oldTags[2], 0));
        oldTagIDs = oldTags.map(function (tag) {
        	return Zotero.Tags.getID(tag, 0);
        });

        console.log(oldTagIDs);

        // Filters the list of all items to a sublist where each element
        // contains one (or more) old tags
        items = allItems.filter(function(item) {
        	return item.hasTags(oldTags);
        });

        var ids = [];

        for (var i in items) {
        	var allTags = allItems[i].getTags();
        	tags = oldTags.map(tag => tag.toLowerCase());
        	for (var id in allTags) {
			    if (tags.indexOf(allTags[id].name.toLowerCase()) != -1) {
			      ids.push(allTags[id].id);
			    }
			}
			console.log(ids);
			ids.forEach(function(id) {
            	allItems[i].removeTag(id);
			});
            // allItems[i].Tags.erase(ids);
            allItems[i].addTag(newTag, 1);
			ids = [];
            // self._zot.update_item(item)

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

// Initialize the utility
window.addEventListener('load', function(e) { Zotero.BatchEditor.init(); }, false);
