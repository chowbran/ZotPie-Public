/**
 * Created by jason on 21/11/15.
 */
window.addEventListener('load', function(e) { Zotero.SyncCollection.init(); }, false);

Zotero.SyncCollection = {
    init: function () {
        this.DB = new Zotero.DBConnection('linkedDocuments');

        //no need for notification yet, might change when we want dynamic loading
    },
    
    onLoad: function () {
        this.doc = Zotero.ZotPie.createSync.document;
        Zotero.Couple.setCollections(this.doc.getElementById('zotpie_mastercollection'));
        Zotero.Couple.setGroups(this.doc.getElementById('group'));
    },
    
    createSyncedCollection: function () {
        var newCollectionName = this.doc.getElementById('zotpie-collectionname').value;
        var orgCollection = Zotero.Collections.get(this.doc.getElementById('zotpie_mastercollection').value);
        var group = Zotero.Groups.get(this.doc.getElementById('group').value) ;

        var records = orgCollection.getChildItems();
        var col = new Zotero.Collection;

        col.name = newCollectionName;

        col['_libraryID'] = group['_libraryID'];
        col.parent = null;
        col.save();

        for (i=0; i < records.length; i ++){
            Zotero.Items.add(records['_itemTypeID'],records[i].toJSON());
        }




    }


};