REAME

This folder contains a python Batch tag Editor for Zotero

REQUIREMENTS:
Python 2.7 (recommended 2.7.10 since you'll need PIP)

Installation:
1) clone batchEditor.py or the entire folder
2) pip install pyzotero
3) open the batchEditor.py file and add your user-id, type, and API key on line #9
	@see the pyzotero quickstart guide as it has a similar example (https://github.com/urschrei/pyzotero)
4) run the file on command line or terminal as follows:
	python batchEditor.py old_tag new_tag
	
 where old tag is the tag in your zotero library you want replaced by new tag
 * changes are applied to all items in your zotero library *

5) re-sync your library to see the changes.
