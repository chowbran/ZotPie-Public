/**
 * Created by jason on 15/11/15.
 */
window.addEventListener('load', function(e) { Zotero.Couple.init(); }, false);

Zotero.Couple = {


    init:function(){

        this.DB = new Zotero.DBConnection('linkedDocuments');

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
        this.setCollections();
        this.setGroups();
        this.setGroupCollections();
        this.setRecords('user');

    },

    setCollections: function() {

        var menu = this.doc.getElementById('combo_original');
        menu.removeAllItems();
        var collections = Zotero.getCollections();


        // Set up the menu collection name as label and collection id as value
        for ( i=0; i < collections.length; i ++) {
            menu.appendItem(collections[i]['_name'], collections[i]['_id']);
        }

        menu.selectedIndex = 0;

    },

    setGroupCollections: function(){

        var menu = this.doc.getElementById('combo_copycollection');
        menu.removeAllItems();
        var curGroupId = this.doc.getElementById('combo_copygroup').value;
        var curGroup = Zotero.Groups.get(curGroupId);
        var collections = curGroup.getCollections();

        for ( i=0; i < collections.length; i ++) {
            menu.appendItem(collections[i]['_name'], collections[i]['_id']);

        }

        menu.selectedIndex = 0;

        this.setRecords('group');
    },

    setGroups: function () {
        var menu = this.doc.getElementById('combo_copygroup');
        menu.removeAllItems();
        var groups = Zotero.Groups.getAll();

        for ( i=0; i < groups.length; i ++) {
            menu.appendItem(groups[i]['_name'], groups[i]['_id']);
        }

        menu.selectedIndex = 0;
    },

    setRecords: function(type){

        if (type === 'group'){
            var curCollectionId = this.doc.getElementById('combo_copycollection').value;
            var list = this.doc.getElementById('list_copy');
            this.clearListBox(list);
        }else{
            var curCollectionId = this.doc.getElementById('combo_original').value;
            var list = this.doc.getElementById('list_original');
            this.clearListBox(list);
        }
        var collection = Zotero.Collections.get(curCollectionId);
        var records = collection.getChildItems();

        for (i=0; i < records.length; i ++){

            list.appendItem(records[i].getDisplayTitle(), records[i]['_id']);
        }
    },

    clearListBox: function(list){

        var count = list.itemCount;
        while(count-- > 0){
            list.removeItemAt(0);
        }
    },

    updateLink: function () {
        copyList = this.doc.getElementById('list_copy');
        original = this.doc.getElementById('list_original');


        copySet = "";

        var count = copyList.selectedCount;
        var count2 = original.selectedCount;
        if (count !== 0 && count2 !== 0){
            original = original.value;
            for(i = 0; i < count; i ++){
                copySet = copySet.concat(copyList.getSelectedItem(i).value + ',');
            }

            
            if (!this.DB.tableExists('linked')) {
                this.DB.query("CREATE TABLE linked (original INT, copies VARCHAR)");
            }else{
                var sql = "SELECT original FROM linked WHERE original IN (" + original + ")";
                var exist = this.DB.rowQuery(sql);
                console.log(exist);
                if (exist === undefined){
                    this.DB.query('INSERT INTO linked (original, copies) VALUES (' + original + ' , \"' + copySet + "\")");
                }else{
                    this.DB.query('UPDATE linked SET copies = \"' + copySet + '\" WHERE original = ' + original + ';');

                }
            }
        }



    },

    sync: function(){
        var linkSet = this.DB.query("SELECT * FROM linked");
        if(linkSet ? linkSet : []){
            for (i=0; i < linkSet.length; i ++){
                console.log(linkSet[i]);
            }
        }
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

