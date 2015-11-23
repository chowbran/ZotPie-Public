Zotero.AddingFields = {

    onLoad : function () {
        //var type = window.arguments[0];

        this.doc = Zotero.ZotPie.addFieldDoc.document;
        this.parentDoc = Zotero.ZotPie.customFieldsDoc.document;

        var label = this.doc.getElementById("confirmquestion");

        var itemTypes = this.parentDoc.getElementById("itemtypes");
        var type = (itemTypes.selectedItem).getAttribute("label");
        label.setAttribute("value", "What field would you like to add to " + type + "?");

        this.trueType = Zotero.CustomFieldsEditor.getTrueType(type);
        console.log(this.trueType);
    },

    addField: function () {
        console.log(this.trueType);
        var itemTypes = this.doc.getElementById("addfieldtype");
        var fieldType = (itemTypes.selectedItem).getAttribute("label");

        var field = this.doc.getElementById("addfieldname");
        var fieldName = field.value;

        var dbFieldName = Zotero.ZotPie.DBHelper.getFieldName(this.trueType);
        var dbFieldType = Zotero.ZotPie.DBHelper.getFieldType(this.trueType);
        
        if (dbFieldName === false) {
            var arr1 = [fieldName];
            Zotero.ZotPie.DBHelper.setFieldName(this.trueType, arr1);
        } else {
            if (dbFieldName[0] === "") {
                dbFieldName[0] = fieldName;
            } else {
                dbFieldName.push(fieldName);
            }
            Zotero.ZotPie.DBHelper.setFieldName(this.trueType, dbFieldName);
        }

        if (dbFieldType === false) {
            var arr2 = [fieldType];
            Zotero.ZotPie.DBHelper.setFieldType(this.trueType, arr2);
        } else {
            if (dbFieldType[0] === "") {
                dbFieldType[0] = fieldType;
            } else {
                dbFieldType.push(fieldType);
            }

            Zotero.ZotPie.DBHelper.setFieldType(this.trueType, dbFieldType);
        }

        Zotero.CustomFieldsEditor.getCustomFields();
    }
};
