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
        this.createTables();
        this.setCollections();
        this.setGroups();
        this.setGroupCollections();
        this.setRecords('user');
        this.setRecordOriginial();

        //loading the linked tab

    },

    setRecordOriginial: function () {

        var list = this.doc.getElementById('list_original_rem');
        this.clearListBox(list);
        var originalList = this.DB.query("SELECT original FROM linked");

        if (originalList !== false){
            for (var i =0; i < originalList.length; i ++){
                var original = Zotero.Items.get(originalList[i]['original']);
                list.appendItem(original.getDisplayTitle(), original['_id']);
            }
        }
    },

    setRecordCopy: function (){
        var tree = this.doc.getElementById('tree_linkeditems');

        while (tree.firstChild) {
            tree.removeChild(tree.firstChild);
        }

        var original = Zotero.Items.get(this.doc.getElementById('list_original_rem').value);
        var copiesId = this.DB.query('SELECT copies FROM linked WHERE original IN (?)', [original['_id']]);

        var copyArray = copiesId[0]['copies'].split(',');

        for (var i = 0; i < copyArray.length; i ++){
            var copy = Zotero.Items.get(copyArray[i]);
            var copyInfo = this.DB.query('SELECT * FROM grouplinked where id IN (?)', [copy['_id']]);
            var treeitem = document.createElement('treeitem');
            var treerow = document.createElement('treerow');

            var treecell_1 = document.createElement('treecell');
            var treecell_2 = document.createElement('treecell');
            var treecell_3 = document.createElement('treecell');

            treecell_1.setAttribute("label", copy.getField('title'));
            treecell_2.setAttribute("label", copyInfo[0]['groupId']);
            treecell_3.setAttribute("label",copyInfo[0]['collection']);

            treerow.appendChild(treecell_1);
            treerow.appendChild(treecell_2);
            treerow.appendChild(treecell_3);

            treeitem.appendChild(treerow);

            tree.appendChild(treeitem);
        }

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
        var copyList = this.doc.getElementById('list_copy');
        var originalId = this.doc.getElementById('list_original');
        var copyGroup = this.doc.getElementById('combo_copygroup').label;
        var copyCollection = this.doc.getElementById('combo_copycollection').label;


        var copySet = "";


        if (copyList.selectedCount !== 0 && originalId.selectedCount !== 0){

            var numOfCopies = 0;
            for(var i = 0; i < copyList.selectedCount; i ++){

                var copyId = copyList.getSelectedItem(i).value;
                var copy = Zotero.Items.get(copyId);
                var originalItem = Zotero.Items.get(originalId.value);

                var islinked = this.DB.query("SELECT id FROM grouplinked WHERE id=" + copyId);

                //check if the items to copy over, are same type as original and if it is already linked
                if ( islinked === false) {
                    var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                        .getService(Components.interfaces.nsIPromptService);
                    ps.alert(null, "", "already linked");
                }else if( originalItem['_itemTypeID'] === copy['_itemTypeID']){
                    var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                        .getService(Components.interfaces.nsIPromptService);
                    ps.alert(null, "", "itemtypes are different");
                }
                else{
                    numOfCopies ++;
                    copySet = copySet.concat(copyId + ',');
                    //insert the id of the linked sql if there is an id that is already there
                    this.DB.query("INSERT INTO grouplinked (id, groupId, collection) VALUES (?,?,?)", [copyId, copyGroup, copyCollection]);

                }
            }
            //check if there are any copies at all that are selected
            if (numOfCopies !== 0){
                //check if the original is linked
                var sql = "SELECT * FROM linked WHERE original IN (?)" ;

                var exist = this.DB.query(sql, [originalId.value]);


                if (exist === false){
                    sql = "INSERT INTO linked (original, copies) VALUES (? , ?)";
                    this.DB.query(sql,[originalId.value, copySet.substring(0, copySet.length-1)]);
                }else{
                    var prevLinked = exist[0]['copies'].split(',');

                    for (var j = 0; j < prevLinked.length; j ++){
                        copySet = copySet.concat(prevLinked[j] + ',');
                    }
                    sql = "UPDATE linked SET copies = ? WHERE original = ?;";
                    this.DB.query(sql, [copySet.substring(0, copySet.length-1), originalId.value]);

                }
            }
        }



    },

    createTables: function(){
        if (!this.DB.tableExists('grouplinked')){
            this.DB.query("CREATE TABLE grouplinked (id INT, groupId VARCHAR, collection VARCHAR)");
        }
        if (!this.DB.tableExists('linked')) {
            this.DB.query("CREATE TABLE linked (original INT, copies VARCHAR)");
        }
    },

    //sync: function(){
    //    var linkSet = this.DB.query("SELECT * FROM linked");
    //
    //    if(linkSet ? linkSet : []){
    //        for (i=0; i < linkSet.length; i ++){
    //
    //            var original = Zotero.Items.get(linkSet[i]['original']);
    //            var copyArray = linkSet[i]['copies'].split(',');
    //
    //
    //            //only go to range of array -1, since there's an extra comma at the end
    //            for (i = 0; i < copyArray.length - 1; i ++){
    //                //get the item to be copied, and all items that have the same item type ID
    //                var copy = Zotero.Items.get(copyArray[i]);
    //                var fields = Zotero.ItemFields.getItemTypeFields(copy['_itemTypeID'], true);
    //
    //
    //                //go through every single field and update accordingly
    //                for (j = 0; j < fields.length; j ++){
    //
    //                    var fieldName = Zotero.ItemFields.getName(fields[j]);
    //
    //
    //                    copy.setField(fieldName, original.getField(fieldName));
    //
    //                }
    //
    //                copy.save();
    //
    //            }
    //
    //        }
    //    }
    //},

    sync: function(linkSet){

        for (i=0; i < linkSet.length; i ++){

            var original = Zotero.Items.get(linkSet[i]['original']);
            var copyArray = linkSet[i]['copies'].split(',');


            //only go to range of array -1, since there's an extra comma at the end
            for (i = 0; i < copyArray.length; i ++){
                //get the item to be copied, and all items that have the same item type ID
                var copy = Zotero.Items.get(copyArray[i]);
                var fields = Zotero.ItemFields.getItemTypeFields(copy['_itemTypeID']);
                original['_changed'] = changed;

                //go through every single field and update accordingly
                for (j = 0; j < fields.length; j ++){

                    var fieldName = Zotero.ItemFields.getName(fields[j]);

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
                Zotero.Couple.createTables();
                // Increment a counter every time an item is changed
                if (event === 'add'){
                    console.log(extraData);
                }
                if (event === 'modify' && extraData){
                    //Loop through array of items and modify the corresponding group items if it is necessary
                    var sql = ("SELECT * FROM linked WHERE original IN (");
                    var queryParm = '';
                    for (var i = 0; i < ids.length; i ++){
                        queryParm = queryParm.concat(ids[i] + ',');

                    }
                    //get rid of last comma, and then form the query
                    sql = sql.concat(queryParm.substring(0,queryParm.length-1) + ")");

                    var linkset = Zotero.Couple.DB.query(sql);

                    Zotero.Couple.sync(linkset);
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

        }
    }

};
