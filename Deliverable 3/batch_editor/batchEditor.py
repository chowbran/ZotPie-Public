#this batch editing file requires the pyzotero python plugin
#install it by typing pip install pyzotero in cmd line or terminal
#or see https://github.com/urschrei/pyzotero for instructions

import os
import sys
import argparse
from pyzotero import zotero

class BEditor:

	def __init__(self, user_id='', user_type='', api_key=''):

		path = 'data/user_data'

		#data for accessing zotero library
		self._user_id = user_id;
		self._user_type = user_type;
		self._api_key = api_key;

		if os.path.exists(path):
			#get the user's library data from file
			user_data = [line.rstrip('\n') for line in open(path)]
		if len(user_data) == 3:
			self._user_key = user_data[0];
			self._user_type = user_data[1];
			self._api_key = user_data[2]; 

		else:
			if (len(user_id) and len(user_type) and len(api_key)):
				#no data exists, create file and directory to store user's data
				if not os.path.exists(os.path.dirname(path)):
					os.makedirs(os.path.dirname(path))

				f = open(path, 'w')
				f.write(user_id + '\n');
				f.write(user_type + '\n');
				f.write(api_key + '\n');
				f.close()

		#initialize a connection to library and validate connection
		try:
			self._zot = zotero.Zotero(user_id, user_type, api_key)
		except Exception, err:
			raise
		self.test_config()

	def test_config(self):
		''' Attempts to access Zotero library with user's ID & TYPE & APIKEY
			raises error if invalid credentials
	    '''
		try: 
			self._zot.groups()
		except Exception, err:
			raise

	def batch_edit(self, old_tag, new_tag):
		''' this takes all items with tag, old_tag and updates it so
		    that old_tag is replaced by new_tag
		'''
		items = self._zot.items();

		#for each item in the library access the list containing all of its tag information
		#in item['data']['tags'] which is a list of dicts of form {tag: tagname, type: value}
		for item in items:
			for tag in item['data']['tags']:
				#replace old tag with new tagname with new_tag if applicable
				if tag['tag'] == old_tag:
					tag['tag'] = new_tag
					self._zot.update_item(item)


	def batch_edit_collection(self, collection, old_tag, new_tag):
		''' replaces all tags with value old_tag with value new_tag in specified
			collection and updates the library
		'''
		pass

	def backup_library(self): #optional
		''' backup entire library before making changes '''
		#will need write permissions?
		pass

	def restore_library(self): #optional
		''' restore entire library to its state before changes were made'''
		pass
