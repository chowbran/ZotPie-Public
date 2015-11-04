import os
import sys
from pyzotero import zotero
from pickler import pickler
import time

class BTool:
	''' A tool for backing up and restoring a zotero library 
		requires read/write permissions on local harddrive
		and enough space to backup your zotero library. Also
		needs data for accessing the user's library if first use.
	'''

	def __init__(self, uid='', utype='', apikey=''):
		''' intialize a new backup tool '''
		#the name of pickle file used to save user info
		self._user_pickle = "user_data"

		#get data for accesing Zotero library
		if len(uid) > 0 and len(utype) > 0 and len(apikey) > 0:
			self._userData = {"user_id": user_id, "user_type": user_type, "api_key": api_key}
		else:
			if validate_path("data\user_data.p"):
				p = Pickler(self._user_pickle)
				self._userData = p.load()
			else:
				print >> sys.stderr, 'usage: please provide a valid library id, type, and API key'

		#validate the users info, if invalid return error
		validate_credentials():

	def validate_credentials():
		''' checks that user has read/write access to library'''
		#initialize a connection to library
		try:
			zot = zotero.Zotero(self._userData['user_id'],
								self._userData['user_type'],
								self._userData['api_key'])
		except Exception, err:
			raise

		#test for permissions
		try:
			key_info = zot.key_info()['access']['user']
			if not 'files' in key_info:
				print >> sterr, "user does not have read access to library"
			elif not 'write' in key_info:
				print >> stderr, "user does not have write access to library"
			elif not 'library' in key_info:
				print >> sterr, "user does not have access to library"
		except Exception, err:
			#this should never happen, but just incase!
			raise

	def validate_path(self, path):
		''' returns true if path exists, false otherwise '''
		if os.path.exists(path):
			return True
		else:
			return False

	def savelog(self):
		'''(BTool)-> List of String
			returns the current list of backups on local machine, raises
			an exception if no saves exist
		'''
		p = Pickler("savelog")
		try:
			return p.load()
		except Exception, err:
			raise

	def update_savelog(self, mode, item):
		'''(BTool, string, string)-> NoneType
			updates the savelog, adds item if mode = 'add'
			and removes item if mode = 'remove'.
			*** should only be used my backup() and restore() methods in this 
			class to ensure save corruption doesn't occur. ***
		'''
		p = Pickler("savelog")

		try: 
			#add/remove item from the list of items
			data = p.load()
			if mode == "add":
				data.append(item)
			else:
				data.remove(item)
			p.save(data)
		except:
			#in this case there is no savelog, so make one containing item
			data = []
			data.append(item)
			p.save(data) 

	def backup(self):
		'''(BTool) -> NoneType
			saves the entire library to pickle
		'''
		#initialize connection
		zot = zotero.Zotero(self._userData['user_id'],
							self._userData['user_type'],
							self._userData['api_key'])

		#get the data to backup and name the save file
		#library_id + current (24 hour) time to allow for easy backing up
		data = zot.items()
		version = user_id + time.strftime("%H:%M:%S")
		p = Pickler(version)

		#save the data and update savelog
		p.save(data)
		p.update_savelog(data)


	def restore(self, version):
		'''(BTool, str)-> NoneType
		'''
		#backup current library
		self.backup()

		#delete all library data
		zot = zotero.Zotero(self._userData['user_id'],
							self._userData['user_type'],
							self._userData['api_key'])

		items = zot.items()

		for item in items:
			zot.delete(item)

		#add old library data
		p = Pickler(version)
		items = p.load()
		for item in items:
			zot.create_items(item)