#this batch editing file requires the pyzotero python plugin
#install it by typing pip install pyzotero in cmd line or terminal
#or see https://github.com/urschrei/pyzotero for instructions

import os
import sys
import argparse
from pyzotero import zotero
from pickler import Pickler

class BEditor:
	""" class used for batch editing"""

	def __init__(self, user_id='', user_type='', api_key=''):
		''' intialize a new batch editor '''
		#this is the file used to save user data
		self._pickle_save = 'user_data'

		#data for accessing zotero library
		self._userData = {"user_id": user_id, "user_type": user_type, "api_key": api_key}

		#check if we have a pickle that already contains user info
		#if so load that data from pickle
		if (self.chksave()):
			self._pickle = Pickler(self._pickle_save)
			self._userData = pickle.load()

		#initialize a connection to library and validate connection
		try:
			self._zot = zotero.Zotero(user_id, user_type, api_key)
		except Exception, err:
			raise
		self.test_config()

	def chksave(self):
		'''BEditor -> int
			checks for saved user data, returns 1 if data exists 0 otherwise
		'''
		pickle = Pickler(self._pickle_save)
		try:
			#if this succeeds then a save file exists
			pickle.load()
			return 1
		except:
			return 0

	def save_data():
		'''
			saves user data to pickle
		'''
		self._pickle.save(self._userData)

	def test_config(self):
		''' Attempts to access Zotero library with user's ID & TYPE & APIKEY
			raises error if invalid credentials
	    '''
		try: 
			self._zot.groups()
		except Exception, err:
			raise

	def batch_edit_tag(self, old_tag, new_tag):
		''' this takes all items with tag, old_tag and updates it so
		    that old_tag is replaced by new_tag
		'''
		items = self._zot.items()

		#for each item in the library access the list containing all of its tag information
		#in item['data']['tags'] which is a list of dicts of form {tag: tagname, type: value}
		for item in items:
			for tag in item['data']['tags']:
				#replace old tag with new tagname with new_tag if applicable
				if tag['tag'] == old_tag:
					tag['tag'] = new_tag
					self._zot.update_item(item)

	def library_raw(self):
		''' return entire library's raw data '''
		return self._zot.items();

	def batch_edit_collection(self, collection, old_tag, new_tag):
		''' replaces all tags with value old_tag with value new_tag in specified
			collection and updates the library
		'''
		pass

	def backup_library(self): #untested
		''' backup entire library, this overwrites any previous backup'''
		#initialize a pickle and save @lib_backup.p
		picklesave = 'lib_backup'
		pickle = Pickler(picklesave)
		pickle.save(self._zot.items())

	def restore_library(self): #untested
		''' restore entire library to its state before changes were made 
			this process can be slow
		'''
		#get data from pickle @lib_backup
		picklesave = 'lib_backup'
		pickle = Pickler(picklesave)
		data = pickle.load()

		#update each item
		for item in data:
			self._zot.update_item(item)

