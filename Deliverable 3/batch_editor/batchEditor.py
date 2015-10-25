import sys
import time
import argparse
from pyzotero import zotero

user_id = '2710002';
user_type = 'user';
api_key = 'jxIEnHTfXW5guwz6X8q5upsv';

class BatchConfig:
	def __init__(self):
		pass


	def config(uid, key, utype='user'):
		''' sets the user_id, user_type, and API Key so that program can
			access the user's zotero library.
	    '''
		self.zot = zotero.Zotero(uid, utype, key)



	def batch_editor(old_tag, new_tag):
		''' this takes all items with tag, old_tag and updates it so
		    that old_tag is replaced by new_tag
		'''
		items = self.zot.items();

		#for each item in the library access the list containing all of its tag information
		#in item['data']['tags'] which is a list of dicts of form {tag: tagname, type: value}
		for item in items:
			for tag in item['data']['tags']:
				#replace old tag with new tagname with new_tag if applicable
				if tag['tag'] == old_tag:
					tag['tag'] = new_tag
					self.zot.update_item(item)

	def batch_edit_collection(collection, old_tag, new_tag):
		''' replaces all tags with value old_tag with value new_tag in specified
			collection and updates the library
		'''


		collections = self.zot.collections();
		collectionID = collections[0]['data']['key']

		# Find the collectionID of collection collection
		for coll in collections:
			if coll['data']['name'] == collection:
				collectionID = coll['data']['key']

		# Edit the tags old_tag in the collection identified by collectionID
		for item in self.zot.collection_items(collectionID):#[1]['data']['tags']
			for tag in item['data']['tags']:
				if tag['tag'] == old_tag:
					tag['tag'] = new_tag
					self.zot.update_item(item)

	def backup_library(): #optional
		''' backup entire library before making changes '''
		#will need write permissions?
		pass

	def restore_library(): #optional
		''' restore entire library to its state before changes were made'''
		pass

#deprecated or some shit
# #takes command line args as inputs or you can just change the parameters in
# #the else statement see @batch_editor method for usage
# #the format for command line args are as follow: python batchEditor.py old_tag new_tag
# if (len(sys.argv) == 3):
# 	batch_editor(sys.argv[1], sys.argv[2])
# else:
# 	batch_editor('test', '__test')

#implement using argparse
# if __name__ == "__main__":
# 	parser = argparse.ArgumentParser(description='Process some integers.')
# 	parser.add_argument("-user", nargs='?', default="2704725", help='Entry for user id')
# 	parser.add_argument("-apikey", nargs='?', default="Zt1Q6xrcy28OOc4zRNszKbZL", help='Entry for api key')
# 	parser.add_argument("func", default="batch_editor", help='Entry for api key')
# 	parser.add_argument("argv", nargs='*', default="Zt1Q6xrcy28OOc4zRNszKbZL", help='Entry for api key')

# 	args = parser.parse_args()

# 	print args.user
# 	print args.apikey
# 	print args.func
# 	print args.argv

# 	func = args.func;
# 	batch = BatchConfig()
# 	batch.config(args.user, args.apikey)
# 	argv = args.argv

# 	if func == "batch_editor":
# 		batch_editor()
