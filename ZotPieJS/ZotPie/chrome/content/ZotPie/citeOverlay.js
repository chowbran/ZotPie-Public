var CiteOverlay = new function ()
{

  
	this.onLoad = function() {

        // Finds the textbox element within zotero
	    cslEditor = document.getElementById("zotero-csl-editor");
        // Hides the display of the textbox
	    cslEditor.style.display = 'none';
        // Get the list of csl styles and replaces its oncommand function
	    cslList = document.getElementById("zotero-csl-list");
	    cslList.setAttribute("oncommand", "refreshBox(event);");
        // Get the window on which csl editor is used
	    win = document.getElementById("csl-edit");
			
	    if (win) {
            // Create groupbox to hold controls
	        var grp = document.createElement("groupbox");
	        grp.setAttribute("id", "zotpie-groupbox");
            // Create caption label for groupbox
	        var caption = document.createElement("caption");
	        caption.setAttribute("label", "Controls");
	        grp.appendChild(caption);
	        win.appendChild(grp);

	        // Fill the groupbox
	        var hbox = document.createElement("box");
	        ClickableUI = document.createElement("arrowscrollbox");
	        cslEditor.parentNode.insertBefore(ClickableUI, cslEditor);
	        grp.appendChild(hbox);
            // Create button to get a new citation style
	        newcite = document.createElement("button");
	        newcite.setAttribute("id", "zotpie-new");
	        newcite.setAttribute("label", "Create New");
	        newcite.setAttribute("oncommand", "createNew();");

            // Create the menulist containing all the fields
	        fields = document.createElement("menulist");
	        fields.setAttribute("id", "zotpie-fields");


            // Create list of prefix
	        prefixlist = document.createElement("menulist");
	        prefixlist.setAttribute("id", "zotpie-prefix");

            // Create list of suffix
	        suffixlist = document.createElement("menulist");
	        suffixlist.setAttribute("id", "zotpie-prefix");

            // Create the menulist containing all the item types
 		    types = document.createElement("menulist");
	        types.setAttribute("id", "zotpie-types");
	        types.setAttribute("oncommand", "addItem();");
	
	        // Create a menulist containg citation and biblography
	        format = document.createElement("menulist");
	        format.setAttribute("id", "zotpie-format");
	        format.setAttribute("oncommand", "changeFormat();");

            // Create a checkbox to toggle textbox display
	        checkbox = document.createElement("checkbox");
	        checkbox.setAttribute("label", "Preview TextBox");
	        checkbox.setAttribute("checked", false);
	        checkbox.setAttribute("oncommand", "onToggle();");
	
            // Create a button to insert fields
	        insert = document.createElement("button");
	        insert.setAttribute("id", "zotpie-insert");
	        insert.setAttribute("label", "Insert");
	        insert.setAttribute("oncommand", "insertField();");

            // Create a button to remove current fields
	        remove = document.createElement("button");
	        remove.setAttribute("id", "zotpie-remove");
	        remove.setAttribute("label", "Remove");
	        remove.setAttribute("oncommand", "removeField();");

	        prefix = document.createElement("label");
	        prefix.setAttribute("id", "prefix");
	        prefix.innerHTML = 'Prefix';
	        prefix.style.align = "center";
	        prefix.style.fontSize = "14px";

	        suffix = document.createElement("label");
	        suffix.setAttribute("id", "suffix");
	        suffix.innerHTML = 'Suffix';
	        suffix.style.align = "center";
	        suffix.style.fontSize = "14px";
           

            // Add elements to the box
	        hbox.appendChild(checkbox);
	        hbox.appendChild(newcite);
	        hbox.appendChild(format);
		    hbox.appendChild(types);
		    hbox.appendChild(fields);
	        hbox.appendChild(insert);
	        hbox.appendChild(remove);
	        hbox.appendChild(prefix);
	        hbox.appendChild(prefixlist);
	        hbox.appendChild(suffix);
	        hbox.appendChild(suffixlist);

	        // Set default value of format
	        format.appendItem("--Select Format--", "selectformat");
	        format.appendItem("Citation", "citation");
	        format.appendItem("Bibliography", "bibliography");
	        format.selectedIndex = 0;
             
            // Set default value of fields
	        fields.appendItem("--Select Field--", "selectfield");
	        fields.selectedIndex = 0;

            // Set default values of item types
	        types.appendItem("--Select Type--", "selecttype");
	        types.selectedIndex = 0;

	        prefixlist.appendItem("--Select Prefix--", "selectprefix");
	        prefixlist.appendItem(":", "selectprefix");
	        prefixlist.appendItem(".", "selectprefix");
	        prefixlist.appendItem("/", "selectprefix");
	        prefixlist.appendItem(",", "selectprefix");
	        prefixlist.selectedIndex = 0;

	        suffixlist.appendItem("--Select Suffix--", "selectsuffix");
	        suffixlist.appendItem(":", "selectsuffix");
	        suffixlist.appendItem(".", "selectsuffix");
	        suffixlist.appendItem("/", "selectsuffix");
	        suffixlist.appendItem(",", "selectsuffix");
	        suffixlist.selectedIndex = 0;

            // Add all the item types to the list
		    itemTypes = Zotero.ItemTypes.getTypes();
		for(var i = 0; i < itemTypes.length; i++){
		    types.appendItem(Zotero.ItemTypes.getLocalizedString(itemTypes[i]['name']), itemTypes[i]['id']);
			}
		}
	}
	// Insert text, given a point and string variable
	insertAtPoint = function (text, pos) {
        // Finds the position in the textbox and adds the text
	    cslEditor.value = cslEditor.value.substr(0, pos) 
                            + text  + '\n' + cslEditor.value.substr(pos, cslEditor.textLength);
	    cslEditor.selectionStart = pos + text.length + 1;
	    cslEditor.selectionEnd = pos + text.length + 1;
	    cslEditor.focus();
	}
    // Upon selecting a new style refresh to defualt values
	refreshBox = function (value) {
        // Recall replaced oncommand function
	    Zotero_CSL_Editor.onStyleSelected(value.target.value);
        // Set all values to default
	    fields.removeAllItems();
	    fields.appendItem("--Select Field--", "selectfield");
	    fields.selectedIndex = 0;
	    ClickableUI.innerHTML = "";
	    types.selectedIndex = 0;
	    format.selectedIndex = 0;
	    selected = undefined;

	}
    // Add all fields that correspond to the chosen item type
	addItem = function () {
        // Remove all current fields and set to default
	    fields.removeAllItems();
	    fields.appendItem("--Select Field--", "selectfield");
	    fields.selectedIndex = 0;
        // Get the currently selected item type
	    var typename = (types.selectedItem).getAttribute("value");
        // Add the author field due to it not being a zotero type
	    fields.appendItem("Author", "author");
        // Get the all fields corresponding to the item type with item id
	    var field = Zotero.ItemFields.getItemTypeFields(typename);
        // Add them to the menulist
	    for (var i = 0; i < field.length; i++) {
	        fields.appendItem(Zotero.ItemFields.getLocalizedString(typename, Zotero.ItemFields.getName(field[i])), Zotero.ItemFields.getName(field[i]));
	    }
	    // Get the string name with the item type id
	    for (var i = 0; i < itemTypes.length; i++) {
	        if (itemTypes[i]['id'] == typename) {
	            typename = itemTypes[i]['name'];
	        }
	    }
        // Get all the custom fields
	    field = Zotero.ZotPie.DBHelper.getFieldName(typename);
        // Add custom fields to the 
	    for (var i = 0; i < field.length; i++) {
	        fields.appendItem(field[i], field[i]);
	    }
	    

	}
    // Toggle the textbox on and off
	onToggle = function () {
        // Show textbox
	    if (cslEditor.style.display== 'none') {
	        cslEditor.style.display = 'inherit';
	        ClickableUI.style.display = 'none';

	    }
        // Hide the textbox
	    else {
	        cslEditor.style.display = 'none';
	        ClickableUI.style.display = 'inherit';
	    }
	}

    // Create a blank citation style
	createNew = function () {
	    var res = confirm("Pressing ok will remove current style");
	    if (res) {
            // sets all values to default
	        fields.removeAllItems();
	        fields.appendItem("--Select Field--", "selectfield");
	        fields.selectedIndex = 0;
	        ClickableUI.innerHTML = "";
	        types.selectedIndex = 0;
	        format.selectedIndex = 0;
	        selected = undefined;
            // Get required values for custom style
	        var title = prompt('Please enter the title of your style', 'title');
	        var userid = prompt('Please enter the id of your style', 'http://www.zotero.org/styles/');
	        var now = new Date();
	        var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
            // Create blank citation style
	        cslEditor.value = '<?xml version="1.0" encoding="utf-8"?>\n';
	        cslEditor.value = cslEditor.value + '<style xmlns="http://purl.org/net/xbiblio/csl" class="in-text" version="1.0" >\n';
	        cslEditor.value = cslEditor.value + '\t<info>\n';
	        cslEditor.value = cslEditor.value + '\t\t<title>' + title + '</title>\n';
	        cslEditor.value = cslEditor.value + '\t\t<id>' + userid + '</id>\n';
	        cslEditor.value = cslEditor.value + '\t\t<updated>' + utc + '</updated>\n';
	        cslEditor.value = cslEditor.value + '\t</info>\n';
	        cslEditor.value = cslEditor.value + '\t<citation>\n';
	        cslEditor.value = cslEditor.value + '\t\t<layout>\n';
	        cslEditor.value = cslEditor.value + '\t\t</layout>\n';
	        cslEditor.value = cslEditor.value + '\t</citation>\n';
	        cslEditor.value = cslEditor.value + '\t<bibliography>\n';
	        cslEditor.value = cslEditor.value + '\t\t<layout>\n';
	        cslEditor.value = cslEditor.value + '\t\t</layout>\n';
	        cslEditor.value = cslEditor.value + '\t</bibliography>\n';
	        cslEditor.value = cslEditor.value + '</style>\n';
	        Zotero_CSL_Editor.onStyleModified();

	    }
	    else {
	        return;
	    }

	}

    // Selection of citation or biblography
	changeFormat = function () {
	    //layouts.removeAllItems();
	    var formatname = (format.selectedItem).getAttribute("value");
	    if (formatname == "citation" | formatname == "bibliography") {
	        ClickableUI.innerHTML = "";
            // get the position of the bib or citation in csl file
	        var start = cslEditor.value.indexOf("<" + formatname);
	        var end = cslEditor.value.indexOf("</"+ formatname);
	        var res = (cslEditor.value.substring(start, end));
	        res = res.split("\n");
            // for each variable within cit/bib create a button 
	        for (var i = 0; i < res.length; i++) {
	            if (res[i].indexOf("<text") > -1) {
	                start = res[i].indexOf('="') + 2;
	                end = (res[i].substring(start, res[i].length)).indexOf('"') + start;
	                var button = document.createElement("button");
	                button.setAttribute("id", res[i].trim());
	                button.setAttribute("label", res[i].substring(start, end));
	                button.setAttribute("oncommand", "selectField(event)");
	                ClickableUI.appendChild(button);

	            }
	        }
	        return;
	    }
	    else {
	        return;
	    }
	}
    // When a button is clicked it is chosen as selected
	selectField = function (value) {
	    selected = value.target.id;
	}
    // Insert a field into the text
	insertField = function () {
        // Some info are not mapped automatically
	    var fieldname = (fields.selectedItem).getAttribute("value");
	    switch (fieldname) {
	        case "websiteTitle":
	            fieldname = 'container-title';
	            break;
	        case "publicationTitle":
	            fieldname = 'container-title';
	            break;
	        case "url":
	            fieldname = 'URL';
	            break;
	        case 'place':
	            fieldname = 'publisher-place';
	            break;
	        case 'numPages':
	            fieldname = 'number-of-pages';
	            break;
	        case 'series':
	            fieldname = 'collection-title';
	            break;
	        case 'seriesNumber':
	            fieldname = 'collection-number';
	            break;
	        case 'university':
	            fieldname = 'publisher';
	            break;
	        case 'conferenceName':
	            fieldname = 'event';
	            break;
	        case 'numberOfVolumes':
	            fieldname = 'number-of-volumes';
	            break;

	    }
        // If a field has been selected from the list add otherwise do nothing
	    if (fieldname != "selectfield") {
            // Create string statement
	    	var input = '<text variable="' + fieldname;
	    	input = input + '"';
	    	if (fieldname == 'author' | fieldname == 'editor' | fieldname == 'translator') {
	    	    input = '<names variable="' + fieldname + '"';
	    	}
	    	if ((prefixlist.selectedItem).getAttribute("label") != '--Select Prefix--') {
	    	    input = input + ' prefix="' + (prefixlist.selectedItem).getAttribute("label") + '"';
	    	}
	    	if ((suffixlist.selectedItem).getAttribute("label") != '--Select Suffix--') {
	    	    input = input + ' suffix="' + (suffixlist.selectedItem).getAttribute("label") + '"';
	    	}
	    	input = input + '/>';
            // Create a button
	    	var button = document.createElement("button");
	    	button.setAttribute("id", input);
	    	button.setAttribute("label", fieldname);
	    	button.setAttribute("oncommand", "selectField(event)");

            // If a field button is selected then insert after that
	    	if (selected) {
	    	    pos = cslEditor.value.indexOf(selected);
	    	    insertAtPoint(input, pos);
	    	    ClickableUI.insertBefore(button, document.getElementById(selected).nextSibling);
	    	    Zotero_CSL_Editor.onStyleModified();
	    	}
	    	else {
                // If a field button is not selected then insert at the beginning
	    	    var formatname = (format.selectedItem).getAttribute("value");
	    	    temp = "<" + formatname;
	    	    temp2 = "</" + formatname;
	    	    var start = cslEditor.value.indexOf(temp);
	    	    var end = cslEditor.value.indexOf(temp2);
	    	    res = (cslEditor.value.substring(start, end));
	    	    pos = start;
	    	    start = res.indexOf("<layout");
	    	    end = res.indexOf("</layout");
	    	    res = (res.substring(start, end));
	    	    pos = pos + start + res.indexOf(">") + 1;
	    	    insertAtPoint(input, pos);
	    	    ClickableUI.insertBefore(button, ClickableUI.firstChild);
	    	    Zotero_CSL_Editor.onStyleModified();
	    	}
	    	
	    }
	    else {
	        Zotero_CSL_Editor.onStyleModified();
		    return;
	    }
	    
	    
        // Do something depending on field
	}

    // Remove fields
	removeField = function () {
        // get the button/field
	    var element = document.getElementById(selected);
	    if (element) {
            // Find the string within the text and remove it
	        var formatname = (format.selectedItem).getAttribute("value");
	        cslEditor.value.replace(selected, '');
	        var start = cslEditor.value.indexOf("<" + formatname);
	        var end = cslEditor.value.indexOf("</" + formatname);
	        res = cslEditor.value.substring(start, end);
	        res = res.replace(selected, "");
	        cslEditor.value = cslEditor.value.substring(0, start) + res + cslEditor.value.substring(end, cslEditor.length);
            // Remove the button from the preview
	        element.parentNode.removeChild(element);
	        selected = undefined;
	        Zotero_CSL_Editor.onStyleModified();
	    }

	}


	this.onUnload = function() {

	}
	
	this.onBeforeUnload = function() {

	}
}

window.addEventListener("load", function(e) { CiteOverlay.onLoad(e); }, false);
window.addEventListener("unload", function(e) { CiteOverlay.onUnload(e); }, false);
window.addEventListener("beforeunload", function(e) { CiteOverlay.onBeforeUnload(e); }, false);
