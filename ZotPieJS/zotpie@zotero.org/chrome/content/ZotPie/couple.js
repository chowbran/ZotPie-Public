/**
 * Created by jason on 15/11/15.
 */
window.addEventListener('load', function(e) { Zotero.Couple.init(); }, false);

Zotero.Couple = {


    init:function(){

        this.DB = new Zotero.DBConnection('zotero');

        // Register the callback in Zotero as an item observer
        var notifierID = Zotero.Notifier.registerObserver(this.notifierCallback, ['item']);

        window.addEventListener("DOMContentLoaded", function(e) {this.onLoad}, true);

        // Unregister callback when the window closes (important to avoid a memory leak)
        window.addEventListener('unload', function(e) {
            Zotero.Notifier.unregisterObserver(notifierID);
        }, false);
    },

    onLoad: function(){
        this.doc = Zotero.ZotPie.coupleDoc.document;
        this.setupCollections();
        this.setupGroups();
        this.setupGroupCollections();
        this.setupRecords('group');
        this.setupRecords('user');

    },

    setupCollections: function() {

        var menu = this.doc.getElementById('combo_original');
        var collections = Zotero.getCollections();


        // Set up the menu collection name as label and collection id as value
        for ( i=0; i < collections.length; i ++) {
            menu.appendItem(collections[i]['_name'], collections[i]['_id']);
        }

        menu.selectedIndex = 0;
    },

    setupGroupCollections: function(){

        var menu = this.doc.getElementById('combo_copycollection');
        var curGroupId = this.doc.getElementById('combo_copygroup').value;
        var curGroup = Zotero.Groups.get(curGroupId);
        var collections = curGroup.getCollections();

        for ( i=0; i < collections.length; i ++) {
            menu.appendItem(collections[i]['_name'], collections[i]['_id']);

        }

        menu.selectedIndex = 0;
    },

    setupGroups: function () {
        var menu = this.doc.getElementById('combo_copygroup');
        var groups = Zotero.Groups.getAll();

        for ( i=0; i < groups.length; i ++) {
            menu.appendItem(groups[i]['_name'], groups[i]['_id']);
        }

        menu.selectedIndex = 0;
    },

    setupRecords: function(type){

        if (type === 'group'){
            var curCollectionId = this.doc.getElementById('combo_copycollection').value;
            var menu = this.doc.getElementById('list_copy');
        }else{
            var curCollectionId = this.doc.getElementById('combo_original').value;
            var menu = this.doc.getElementById('list_original');
        }
        var collection = Zotero.Collections.get(curCollectionId);
        var records = collection.getChildItems();

        for (i=0; i < records.length; i ++){
            console.log(records[i]);
            menu.appendItem(records[i].getDisplayTitle(), records[i]['_id']);
        }


    },

    onCollectionChange: function(group){

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

