/**
 * Created by jason on 15/11/15.
 */
window.addEventListener('load', function(e) { Zotero.Couple.init(); }, false);

Zotero.Couple = {


    init:function(){
        this.DBzotero = new Zotero.DBConnection('zotero');
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
        this.createTables();
        this.setCollections();
        this.setGroups();
        this.setGroupCollections();
        this.setRecords('user');

        //loading the linked tab

    },

    getLink: function() {
        var linkSet = this.DB.query("SELECT * FROM linked");
        if(linkSet ? linkSet : []){
            var original = Zotero.Items.get((linkSet[i])['original']);
            var returnSet = {};
            returnSet[original] = [];

            var copyArray = linkSet[i]['copies'].split(',');
            for (i = 0; i < copyArray.length - 1; i ++){
                var copy = Zotero.Items.get(copyArray[i]);
                returnSet[original].append(copy);
                console.log(returnSet[original]);
            }
        }
    },

    setCopyCollections: function(linkSet) {
        var menu = this.doc.getElementById('combo_original_rem');
        menu.removeAllItems();
        

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
    //TODO CLEANUP THE WAY FUNCTIONS ARE HANDLED, ATROCIOUS
    updateLink: function () {
        copyList = this.doc.getElementById('list_copy');
        original = this.doc.getElementById('list_original');


        copySet = "";

        var count = copyList.selectedCount;
        var count2 = original.selectedCount;
        if (count !== 0 && count2 !== 0){
            original = original.value;
            var numOfCopies = 0;
            for(i = 0; i < count; i ++){

                var copy = Zotero.Items.get(copyList.getSelectedItem(i).value);
                var originalItem = Zotero.Items.get(original);

                var islinked = this.DB.query("SELECT id FROM grouplinked WHERE id=" + id);
                var linked = islinked.length === 0;
                //check if the items to copy over, are same type as original and if it is already linked

                if (originalItem['_itemTypeID'] === copy['_itemTypeID'] && linked === false) {
                    numOfCopies ++;
                    copySet = copySet.concat(copyList.getSelectedItem(i).value + ',');
                    //insert the id of the linked sql if there is an id that is already there
                    this.DB.query("INSERT INTO grouplinked (id) VALUES ('" + id + ")")
                }
            }
            //check if there are any copies at all that are selected
            if (numOfCopies !== 0){



                var sql = "SELECT original FROM linked WHERE original IN (" + original + ")";
                var exist = this.DB.rowQuery(sql);

                if (exist === undefined){
                    this.DB.query('INSERT INTO linked (original, copies) VALUES (' + original + ' , \"' + copySet + "\")");
                }else{
                    this.DB.query('UPDATE linked SET copies = \"' + copySet + '\" WHERE original = ' + original + ';');
                }
            }
        }



    },

    createTables: function(){
        if (!this.DB.tableExists('grouplinked')){
            this.DB.query("CREATE TABLE grouplinked (id INT)");
        }
        if (!this.DB.tableExists('linked')) {
            this.DB.query("CREATE TABLE linked (original INT, copies VARCHAR)");
        }
    },

    sync: function(){
        var linkSet = this.DB.query("SELECT * FROM linked");

        if(linkSet ? linkSet : []){
            for (i=0; i < linkSet.length; i ++){

                var original = Zotero.Items.get(linkSet[i]['original']);
                var copyArray = linkSet[i]['copies'].split(',');


                //only go to range of array -1, since there's an extra comma at the end
                for (i = 0; i < copyArray.length - 1; i ++){
                    //get the item to be copied, and all items that have the same item type ID
                    var copy = Zotero.Items.get(copyArray[i]);
                    var fields = Zotero.ItemFields.getItemTypeFields(copy['_itemTypeID'], true);


                    //go through every single field and update accordingly
                    for (j = 0; j < fields.length; j ++){

                        var fieldName = Zotero.ItemFields.getName(fields[j]);
                        console.log(fieldName);
                        if (fieldName !== "title"){
                            copy.setField(fieldName, original.getField(fieldName));
                        }
                    }

                    copy.save();

                }

            }
        }
    },

    syncv2: function(linkSet){

        for (i=0; i < linkSet.length; i ++){

            var original = Zotero.Items.get(linkSet[i]['original']);
            var copyArray = linkSet[i]['copies'].split(',');


            //only go to range of array -1, since there's an extra comma at the end
            for (i = 0; i < copyArray.length - 1; i ++){
                //get the item to be copied, and all items that have the same item type ID
                var copy = Zotero.Items.get(copyArray[i]);
                var fields = Zotero.ItemFields.getItemTypeFields(copy['_itemTypeID'], true);


                //go through every single field and update accordingly
                for (j = 0; j < fields.length; j ++){

                    var fieldName = Zotero.ItemFields.getName(fields[j]);
                    console.log(fieldName);
                    if (fieldName !== "title"){
                        copy.setField(fieldName, original.getField(fieldName));
                    }
                }

                copy.save();

            }

        }
    },

    // Callback implementing the notify() method to pass to the Notifier
    notifierCallback: {
        notify: function(event, type, ids, extraData) {
            if (event == 'add' || event == 'modify' || event == 'delete') {
                // Increment a counter every time an item is changed

                if (event === 'modify'){
                    //Loop through array of items and modify the corresponding group items if it is necessary
                    var sql = ("SELECT original FROM linked WHERE original IN (");
                    var queryParm = '';
                    for (var i = 0; i < ids.length; i ++){
                        queryParm.concat(ids[i] + ',');
                    }
                    //get rid of last comma, and then form the query
                    sql = sql.concat(queryParm.substring(0,queryParm.length-1) + ")");
                    var linkset = this.DB.query(sql);
                    this.syncv2(linkset);
                }
            }


            //    if (event != 'delete') {
            //        // Retrieve the added/modified items as Item objects
            //        var items = Zotero.Items.get(ids);
            //    }
            //    else {
            //        var items = extraData;
            //    }
            //
            //    // Loop through array of items and grab titles
            //    var titles = [];
            //    for each(var item in items) {
            //        // For deleted items, get title from passed data
            //        if (event == 'delete') {
            //            titles.push(item.old.title ? item.old.title : '[No title]');
            //        }
            //        else {
            //            titles.push(item.getField('title'));
            //        }
            //    }
            //
            //    if (!titles.length) {
            //        return;
            //    }
            //
            //    // Get the localized string for the notification message and
            //    // append the titles of the changed items
            //    var stringName = 'notification.item' + (titles.length==1 ? '' : 's');
            //    switch (event) {
            //        case 'add':
            //            stringName += "Added";
            //            break;
            //
            //        case 'modify':
            //            stringName += "Modified";
            //            break;
            //
            //        case 'delete':
            //            stringName += "Deleted";
            //            break;
            //    }
            //
            //    var str = document.getElementById('zotpie-zotero-strings').
            //            getFormattedString(stringName, [titles.length]) + ":\n\n" +
            //        titles.join("\n");
            //}
            //
            //var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
            //    .getService(Components.interfaces.nsIPromptService);
            //ps.alert(null, "", str);
        }
    }

};

