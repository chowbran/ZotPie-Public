/**
 * Created by jason on 21/11/15.
 */
// Initialize the utility

Zotero.CustomDB = {
    DB: null,

    init: function () {
        // Connect to (and create, if necessary) helloworld.sqlite in the Zotero directory
        this.DB = new Zotero.DBConnection('customfields');

        if (!this.DB.tableExists('customfield')) {
            this.DB.query("CREATE TABLE customfield (itemtype VARCHAR CONSTRAINT prime PRIMARY KEY, fieldname VARCHAR, fieldtype VARCHAR)");
        }

        if (!this.DB.tableExists('customdata')) {
            this.DB.query("CREATE TABLE customdata (itemid INT CONSTRAINT prime PRIMARY KEY, fielddata VARCHAR)");
        }

    },

    arrayToStr: function(array) {

        var str = '';
        for (var i =0; i < array.length; i++){
            str = str.concat(array[i] + ',');
        }
        return str.substring(0, str.length-1);
    },

    strToArray: function(str){
        return str.split(',');
    },

    getFieldName: function(itemType) {
        var fieldNameStr = this.DB.query("SELECT fieldname FROM customfield WHERE itemtype=?", [itemType]);
        if (fieldNameStr !== false){
            return this.strToArray(fieldNameStr[0]['fieldname']);
        }
        return fieldNameStr;
    },

    setFieldName: function(itemType, array){
        var fieldNameStr = this.arrayToStr(array);

        var strUpdate = "UPDATE customfield SET fieldname=? WHERE itemtype=? ";
        var strInsert = "INSERT OR IGNORE INTO customfield (itemtype, fieldname, fieldtype) VALUES (?, ?, '') ";
        this.DB.query(strUpdate, [fieldNameStr, itemType]);
        this.DB.query(strInsert, [itemType, fieldNameStr]);
    },

    getFieldType: function(itemType){
        var fieldtypeStr = this.DB.query("SELECT fieldtype FROM customfield WHERE itemtype=?", [itemType]);
        if (fieldtypeStr !== false){
            return this.strToArray(fieldtypeStr[0]['fieldtype']);
        }
        return fieldtypeStr;
    },

    setFieldType: function (itemType, array) {
        var fieldtypeStr = this.arrayToStr(array);
        var strUpdate = "UPDATE customfield SET fieldtype=? WHERE itemtype=? ";
        var strInsert = "INSERT OR IGNORE INTO customfield (itemtype, fieldname, fieldtype) VALUES (?, '', ?) ";
        this.DB.query(strUpdate, [fieldtypeStr, itemType]);
        this.DB.query(strInsert, [itemType, fieldtypeStr]);
    },

    getFieldData: function (itemId){
        var fielddataStr = this.DB.query("SELECT fielddata FROM customdata WHERE itemid=?", [itemId]);
        if (fielddataStr !== false){
            return this.strToArray(fielddataStr[0]['fielddata']);
        }
        return fielddataStr;
    },

    setFieldData: function (itemId, array){
        var fielddataStr = this.arrayToStr(array);
        var strUpdate = "UPDATE customdata SET fielddata=? WHERE itemid=? ";
        var strInsert = "INSERT OR IGNORE INTO customdata (itemid, fielddata) VALUES (?, ?) ";
        this.DB.query(strUpdate, [fielddataStr, itemId]);
        this.DB.query(strInsert, [itemId, fielddataStr]);
    }


};

