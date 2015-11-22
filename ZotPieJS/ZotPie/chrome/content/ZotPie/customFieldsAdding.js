Zotero.AddingFields = {

    onLoad : function () {
        //var type = window.arguments[0];

        this.doc = Zotero.ZotPie.addFieldDoc.document;
        this.parentDoc = Zotero.ZotPie.customFieldsDoc.document;

        var label = this.doc.getElementById("confirmquestion");

        var itemTypes = this.parentDoc.getElementById("itemtypes");
        var type = (itemTypes.selectedItem).getAttribute("label");
        label.setAttribute("value", "What field would you like to add to " + type + "?");
    },

    addField: function () {
        var itemTypes = this.doc.getElementById("addfieldtype");
        var type = (itemTypes.selectedItem).getAttribute("label");

        var field = this.doc.getElementById("addfieldname");
        var fieldName = field.value;

        Zotero.CustomFieldsEditor.getCustomFields();
    }
};
