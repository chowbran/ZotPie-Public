/**
 * Created by jason on 15/11/15.
 */
window.addEventListener('load', function(e) { Zotero.Couple.init(); }, false);

Zotero.Couple = {


    init:function(){
        this.DB = new Zotero.DBConnection('linkedDocuments');
        this.ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
            .getService(Components.interfaces.nsIPromptService);

        // Register the callback in Zotero as an item observer
        var notifierID = Zotero.Notifier.registerObserver(this.notifierCallback, ['item']);

        window.addEventListener("DOMContentLoaded", function(e) {this.onLoad}, true);

        // Unregister callback when the window closes (important to avoid a memory leak)
        window.addEventListener('unload', function(e) {
            Zotero.Notifier.unregisterObserver(notifierID);
        }, false);
    },

    /**
     * called when window is open to populate all of the tabs and their information
     */
    onLoad: function(){
        this.doc = Zotero.ZotPie.coupleDoc.document;
        this.createTables();
        this.setCollections();
        this.setGroups();
        this.setGroupCollections();
        this.setRecords('user');
        this.setRecordOriginial();

    },

    /**
     * sets/refreshes all records in the unlink tab
     */
    setRecordOriginial: function () {

        var list = this.doc.getElementById('list_original_rem');
        this.clearListBox(list);
        var originalList = this.DB.query("SELECT DISTINCT original FROM grouplinked");

        if (originalList !== false){
            for (var i =0; i < originalList.length; i ++){

                var original = Zotero.Items.get(originalList[i]['original']);

                list.appendItem(original.getDisplayTitle(), original['_id']);
            }
        }
    },

    /**
     * sets/refereshs all copies that are related to select original
     */
    setRecordCopy: function (){
        var tree = this.doc.getElementById('tree_linkeditems');

        while (tree.firstChild) {
            tree.removeChild(tree.firstChild);
        }

        var original = Zotero.Items.get(this.doc.getElementById('list_original_rem').selectedItem.value);


        var copyArray = this.DB.query('SELECT id FROM grouplinked WHERE original IN (?)', [original['_id']]);

        for (var i = 0; i < copyArray.length; i ++){
            var copy = Zotero.Items.get(copyArray[i]['id']);
            var copyInfo = this.DB.query('SELECT * FROM grouplinked where id IN (?)', [copy['_id']]);
            var treeitem = document.createElement('treeitem');
            var treerow = document.createElement('treerow');

            var treecell_1 = document.createElement('treecell');
            var treecell_2 = document.createElement('treecell');
            var treecell_3 = document.createElement('treecell');

            treecell_1.setAttribute("label", copy.getField('title'));
            treecell_1.setAttribute("value", copyInfo[0]['id']);
            treecell_2.setAttribute("label", copyInfo[0]['groupId']);
            treecell_3.setAttribute("label",copyInfo[0]['collection']);

            treerow.appendChild(treecell_1);
            treerow.appendChild(treecell_2);
            treerow.appendChild(treecell_3);

            treeitem.appendChild(treerow);

            tree.appendChild(treeitem);
        }

    },

    /**
     * unlinks selected original and copy ONLY ALLOWS SINGLE SELECT
     * too dangerous to multi deselect link
     */
    unlinkDocumentManual: function(){
        var tree = this.doc.getElementById('tree_linked');
        var originalId = this.doc.getElementById('list_original_rem').selectedItem.value;
        var copyId = tree.view.getCellValue(tree.currentIndex, tree.columns.getColumnAt(0));

        this.unlinkDocument(copyId, originalId, false);

        tree.view.getItemAtIndex(this.currentIndex).parentNode.removeChild(tree.view.getItemAtIndex(this.currentIndex));

        this.setRecordOriginial();
    },


    /**
     * helper function to unlink a record given a copy and it's original id, if all is set
     * to true, then remove all copies that are linked to a given original id.
     * @param copyId the id of the record to be removed
     * @param originalId the id of the original record the copy is linked to
     * @param all BOOLEAN, true or false to delete all
     */
    unlinkDocument: function(copyId, originalId, all){

        var copyArray = this.DB.query('SELECT id FROM grouplinked WHERE original IN (?)', originalId);

        if (all){
            for (var i=0; i < copyArray.length; i ++){
                copyArray.splice(i, 1);
                this.DB.query('DELETE FROM grouplinked WHERE original=' + originalId);
            }

        }else{
            for (var i=0; i < copyArray.length; i ++){
                console.log(copyArray[i]['id']);
                if (copyArray[i]['id'].toString() === copyId){
                    copyArray.splice(i, 1);
                    this.DB.query('DELETE FROM grouplinked WHERE id='+ copyId );
                }
            }
        }
    },


    /**
     * sets the User's collections in link tab
     */
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

    /**
     * sets the user's groups in link tab
     */
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

    /**
     * sets the groups when a certain collection is chosen
     */
    setGroups: function () {

        var menu = this.doc.getElementById('combo_copygroup');
        menu.removeAllItems();
        var groups = Zotero.Groups.getAll();

        for ( i=0; i < groups.length; i ++) {
            menu.appendItem(groups[i]['_name'], groups[i]['_id']);
        }

        menu.selectedIndex = 0;
    },

    /**
     * sets the records for either the user's collection, or a group's collection
     * based on the pass in parameter type
     * @param type either group or user, sets the list of records for selected collection
     */
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

    /**
     * helper function to remove all the values in records list
     * @param list  list document element
     */
    clearListBox: function(list){

        var count = list.itemCount;
        if (count > 0){
            while(count-- > 0){
                list.removeItemAt(0);
            }
        }

    },

    /**
     * Takes all of the selected group records, and a selected user record,
     * and links the set in the database
     */
    updateLink: function () {
        var copyList = this.doc.getElementById('list_copy');
        var originalId = this.doc.getElementById('list_original');
        var copyGroup = this.doc.getElementById('combo_copygroup').label;
        var copyCollection = this.doc.getElementById('combo_copycollection').label;

        if (copyList.selectedCount !== 0 && originalId.selectedCount !== 0){
            //var numOfCopies = 0;
            for(var i = 0; i < copyList.selectedCount; i ++){

                var copyId = copyList.getSelectedItem(i).value;
                var copy = Zotero.Items.get(copyId);
                var originalItem = Zotero.Items.get(originalId.value);
                var islinked = this.DB.query("SELECT id FROM grouplinked WHERE id=" + copyId);

                //check if the items to copy over, are same type as original and if it is already linked
                if ( islinked !== false) {
                    this.ps.alert(null, "", "already linked");
                }else if( originalItem['_itemTypeID'] !== copy['_itemTypeID']){
                    this.ps.alert(null, "", "itemtypes are different");
                }
                else{
                    //var copySet = "";
                    //numOfCopies ++;
                    //copySet = copySet.concat(copyId + ',');
                    this.DB.query("INSERT INTO grouplinked (original, id, groupId, collection) VALUES (?,?,?,?)",
                        [originalId.value, copyId, copyGroup, copyCollection]);
                    this.setRecordOriginial();
                }
            }
        }

    },

    /**
     * helper function for create tables
     */
    createTables: function(){
        if (!this.DB.tableExists('grouplinked')){
            this.DB.query("CREATE TABLE grouplinked (original INT, id INT, groupId VARCHAR, collection VARCHAR)");
        }
    },

    /**
     * Whenever an record is augmented, this function is called to
     * propogate the changes to the linked documents
     * @param linkSet an array with each element having an originalid and copyid value.
     */
    sync: function(linkSet){

        for (var i=0; i < linkSet.length; i ++){
            //loops through every items that corresponds to original in linkset

            var original = Zotero.Items.get(linkSet[i]['original']);
            var copy = linkSet[i]['id'];

            //get the item to be copied, and all items that have the same item type ID
            copy = Zotero.Items.get(copy);
            var fields = Zotero.ItemFields.getItemTypeFields(copy['_itemTypeID']);

            //go through every single field and update accordingly
            for (var j = 0; j < fields.length; j ++){
                var fieldName = Zotero.ItemFields.getName(fields[j]);
                copy.setField(fieldName, original.getField(fieldName));
            }

            //check for the creators if there is any added. If not, simply update all of them
            var originalCreators = original.getCreators();
            var copyCreators = copy.getCreators();



            for (var t = 0; t < originalCreators.length; t ++){
                if (t < copyCreators.length){
                    var fields = {
                        firstName: originalCreators[t].ref['_firstName'],
                        lastName: originalCreators[t].ref['_lastName'],
                        fieldMode: originalCreators[t].ref['_fieldMode'],
                        birthYear: originalCreators[t].ref['_birthYear']
                    };
                    copyCreators[t].ref.setFields(fields);
                    copyCreators[t].ref.save();
                }
                if (t > copyCreators.length || t === copyCreators.length){
                    var fields = {
                        firstName: originalCreators[t].ref['_firstName'],
                        lastName: originalCreators[t].ref['_lastName'],
                        fieldMode: originalCreators[t].ref['_fieldMode'],
                        birthYear: originalCreators[t].ref['_birthYear']
                    };
                    var newCreator = new Zotero.Creator;
                    newCreator.setFields(fields);
                    newCreator['_libraryID'] = copy['_libraryID'];
                    newCreator.save();

                    copy.setCreator(copyCreators.length, newCreator);
                }
            }
            copy.save();
        }
    },

    // Callback implementing the notify() method to pass to the Notifier
    notifierCallback: {
        notify: function(event, type, ids, extraData) {
            if (event == 'add' || event == 'modify' || event == 'delete') {

                Zotero.Couple.createTables();
                // Increment a counter every time an item is changed

                if (event === 'delete'){

                    var sql = ("SELECT * FROM grouplinked WHERE original IN (?)");
                    var queryParm = '';
                    for (var i = 0; i < ids.length; i ++){
                        queryParm = queryParm.concat(ids[i] + ',');
                    }

                    var original = Zotero.Couple.DB.query(sql,queryParm.substring(0,queryParm.length-1) );

                    //call unlink documents for original, if so call unlink for all copies pertaining to documents
                    if (original !== false){
                        for (i = 0; i < ids.length; i ++){
                            Zotero.Couple.unlinkDocument('', original[0]['original'], true);
                        }
                    //check if deleted item is copy, if so call unlink for single copy
                    }else{
                        sql = ("SELECT * FROM groupLinked WHERE id IN (?)");
                        var copy = Zotero.Couple.DB.query(sql,queryParm.substring(0,queryParm.length-1) );
                        if (copy === false){
                            Zotero.Couple.unlinkDocument(copy[0]['id'], copy[0]['original'], false);
                        }
                    }
                }

                if (event === 'modify'){
                    //Loop through array of items and modify the corresponding group items if it is necessary
                    var sql = ("SELECT * FROM grouplinked WHERE original IN (?)");
                    var queryParm = '';
                    for (var i = 0; i < ids.length; i ++){
                        queryParm = queryParm.concat(ids[i] + ',');
                    }
                    //get rid of last comma, and then form the query
                    var linkset = Zotero.Couple.DB.query(sql,queryParm.substring(0,queryParm.length-1) );
                    if (linkset !== false){
                        Zotero.Couple.sync(linkset);
                    }
                }
            }

        }
    }

};
