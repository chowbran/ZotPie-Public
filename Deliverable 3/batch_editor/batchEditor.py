#this batch editing file requires the pyzotero python plugin
#install it by typing pip install pyzotero in cmd line or terminal
#or see https://github.com/urschrei/pyzotero for instructions

import sys
from pyzotero import zotero

user_id = '2704725';
user_type = 'user';
api_key = 'Zt1Q6xrcy28OOc4zRNszKbZL';

def config():
	''' sets the user_id, user_type, and API Key so that program can
		access the user's zotero library.
    '''
	pass


def batch_editor(old_tag, new_tag):
	''' this takes all items with tag, old_tag and updates it so
	    that old_tag is replaced by new_tag
	'''
	items = zot.items();

	#for each item in the library access the list containing all of its tag information
	#in item['data']['tags'] which is a list of dicts of form {tag: tagname, type: value}
	for item in items:
		for tag in item['data']['tags']:
			#replace old tag with new tagname with new_tag if applicable
			if tag['tag'] == old_tag:
				tag['tag'] = new_tag
				zot.update_item(item)


def batch_edit_collection(collection, old_tag, new_tag):
	''' replaces all tags with value old_tag with value new_tag in specified
		collection and updates the library
	'''
	pass

def backup_library(): #optional
	''' backup entire library before making changes '''
	#will need write permissions?
	pass

def restore_library(): #optional
	''' restore entire library to its state before changes were made'''
	pass

#create a zotero instance with params user-id, user-type, API Key
zot = zotero.Zotero(user_id, user_type, api_key)

#takes command line args as inputs or you can just change the parameters in
#the else statement see @batch_editor method for usage
#the format for command line args are as follow: python batchEditor.py old_tag new_tag
if (len(sys.argv) == 3):
	batch_editor(sys.argv[1], sys.argv[2])
else:
	batch_editor('test', '__test')

#implement using argparse