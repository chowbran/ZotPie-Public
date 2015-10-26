README


*** UPDATE for Deliverable 3 *************

DO NOT DELETE __init__.py it is used to tell python that it's ok to import files in this directory to other files
in this directory.

pickler.py will be used to save files to pickle files which will be more secure and will make for a better design.

see pickler_example.py for an example of how to call and use the pickler class or simply look at the pickler.py source code,
however I didn't comment it too much so see @daniel for more info.

see batchEditor_example.py for example of how to initialize and use the batch editor backend

see sektch.png for a sketch of the GUI component that is now located in /team15-course-project/ZotPie

it's probably safe to ignore .pyc files, however I included it just incase, .gitignore them if you can confirm

opttest.py is a test for a removed feature, ignore for now - will be removed when linking GUI component 
*****************************************





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


** if you dont like the command line you can also manually add parameters in the batchEditor file and then run it in your IDE of choice or on the command line without parameters **
