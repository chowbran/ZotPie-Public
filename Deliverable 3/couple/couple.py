import sys
import os.path
import json
from pyzotero import zotero

uid = '2662347'
utype = 'user'
key = 'DBKmDBQRaQXSMwGB9UMroGJ3'

uidGroup = ''
utypeGroup = ''
keyGroup = ''

class CoupleDocuments:


	def __init__(self):
		pass


	def config(self, uid, key, utype='user'):
		''' sets the user_id, user_type, and API Key so that program can
			access the user's zotero library. Gives the groupid to access
			the different groupids this user bleongs to
	    '''
		self.uid = uid
		self.key = key
		self.zot = zotero.Zotero(uid, utype, key)


	def populateGroupCollections(self):
		'''populates all of groups associated with the user
		'''
		listofGroups = self.zot.groups()
		groupAccessName = []

		for group in listofGroups:
			groupAccessName.append(group['data']['name'] + ";" + group['data']['id'])

		return groupAccessName

	def populateGroupRecords(self, groupName):
		'''given a group, we return all record names that are associated
		   with that group
		'''
		groupAccess = zotero.Zotero(self.uid, 'group', self.key)
		recordNames = []

		for record in groupAccess.items():
			recordNames.append(record['data']['title'])

		return recordNames


	def jsonFileUpdater(self, key, documentList):
		'''takes in a key of an original document and a list of all documents
		   in groups to be coupled. Creates a json file if it doesn't exist
		   otherwise, searches through json to find the key to grab the list.
		   updates the list with new coupled documents if necessary. Returns
		   a list with the key.
		'''

		if (os.path.isfile('keys.json')):
			json_file = open('keys.json', 'r')
			json_str = json.read()
			json_dic = json.loads(json_str)[0]

			for itemkey, value in json_dic.iteritems():
				if itemkey == key:
					value = documentList

			json_file = open('keys.json', 'w')
		else:
			json_file = open('keys.json', 'w')
			json_dic = {key: documentList}


		json.dump(json_dic, json_file)


		return json_dic

	def jsonFileGetter(self, key):
		'''Given a key, goes through the json file to find the corresponding
			list of keys
		'''


		json_file = open('keys.json', 'r')

		json_str = json.read()
		json_dic = json.loads(json_str)[0]

		json_file.close()

		for itemkey, value in json_dic.iteritems():
			if itemkey == key:
				return value



	def updateCoupledDocuments(self, key):
		'''Given a key, and a dictionary of changes accesses the json file and updates the
		   coupled documents corresponding to the original in the zotero database. Returns
		   list of documents that don't have the right itemType
		'''

		rejects = []
		coupledDocuments = self.jsonFileGetter(key)

		#find the original document
		original = zot.item(key)

		#go through every document in coupleDocuments
		for document in coupleDocuments:
		#check their type is equal to original
			copy = zotgroup.item(document)
			if copy[0]['itemType'] == original[0]['itemType']:
				itemType = copy[0]['itemType']
				validFields = zot.item_type_fields(itemType)[0]
				#if so, change all the fields to be the same as the original
				for field in validFields:
					copy[0][field] = original[0][field]
				#update the copy
				zotgroup.update_item(copy[0])
			else:
			#if type is not equal, add it to a list to be sent back
				rejects.append(copy[0]['title'])

		return rejects

if __name__ == "__main__":

	test = CoupleDocuments()
	test.config('2662347',  'DBKmDBQRaQXSMwGB9UMroGJ3')
	test.populateGroupCollections()
