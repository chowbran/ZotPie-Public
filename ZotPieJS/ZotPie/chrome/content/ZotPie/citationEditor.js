window.addEventListener('load', function(e) { Zotero.CitationEditor.init(); }, false);

Zotero.CitationEditor = {


	init: function(){

	},

	addfield: function(){
				
	},

	loadfile: function(){
		var nsIFilePicker = Components.interfaces.nsIFilePicker;
  		var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);

  		fp.init(window, "Open File", nsIFilePicker.modeOpen);
  		fp.appendFilter('CSL Styles' , '*.csl');
  
 		var res = fp.show();
  		if (res == nsIFilePicker.returnOK) {
    			var thefile = fp.file;
			var name = thefile.leafName;
   			alert(name);
			thefile.copyTo(null,'temp.xml');
		}
		
  		
	}
};