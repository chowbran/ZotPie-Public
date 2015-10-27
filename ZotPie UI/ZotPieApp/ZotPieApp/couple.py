import sys
import os.path
import json
from pyzotero import zotero
from userData import UserData

uid = ''
utype = 'user'
key = ''

uidGroup = ''
utypeGroup = ''
keyGroup = ''

class CoupleDocuments:
	def __init__(self):
	    self.userData = UserData()

	def config(self):
		''' sets the user_id, user_type, and API Key so that program can
			access the user's zotero library. Gives the groupid to access
			the different groupids this user bleongs to
	    '''
		self.uid = self.userData.getValue('GENERAL', 'libraryid')
		self.key = self.userData.getValue('GENERAL', 'apikey')

		if not (os.path.isfile('keys.json')):
			jsonFile = open('keys.json', 'w')
			jsonFile.close()

		self.zot = zotero.Zotero(self.uid, utype, self.key)
		if utype !=	 'user':
			self.zotgroup = zotero.Zotero(self.uid, 'group', self.key)
			
	def populateUserRecords(self):
		'''populates all of the records of the user
		'''
		
		listofRecords = self.zot.items()
		namesofRecords = []
		
		
		
		for record in listofRecords:
			json_file = open('tester.json', 'w')
			json.dump(record, json_file)			
			namesofRecords.append([record['data']['title'], record['data']['key']])
			
		return namesofRecords	

	def populateGroupCollections(self):
		'''populates all of groups associated with the user
		'''
		listofGroups = self.zot.groups()
		groupAccessName = []

		for group in listofGroups:
			groupAccessName.append([group['data']['name'], group['data']['id']])

		return groupAccessName

	def populateGroupRecords(self, groupId):
		'''given a group, we return all record names that are associated
		   with that group
		'''

		recordNames = []
		groupAccess = zotero.Zotero(groupId, 'group', self.key)

		for record in groupAccess.items():
			recordNames.append(record['data']['title'])

		return recordNames


	def jsonFileUpdater(self, key, documentList):
		'''takes in a key of an original document and a list of dictionaries groups
		   and files to be coupled in those groups. Creates a json file if it doesn't exist
		   otherwise, searches through json to find the key to grab the list.
		   updates the list with new coupled documents. Returns
		   a list with the key.
		'''

		if (os.path.isfile('keys.json')):
			json_file = open('keys.json', 'r')
			json_str = json_file.read()
			json_dic = json.loads(json_str)


			#look for the record to be copied, if it exits, then we
			#update the list of dictionaries for that record
			for itemkey, value in json_dic.iteritems():
				if itemkey == key:
					value = documentList

			json_file = open('keys.json', 'w')
		


		json.dump(json_dic, json_file)


		return json_dic

	def jsonKeyGetter(self, key):
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



	def updateCoupledDocuments(self, key, documentsToChange):
		'''Given a key, and a dictionary of changes accesses the json file and updates the
		   coupled documents corresponding to the original in the zotero database. Returns
		   list of documents that don't have the right itemType
		'''
		
		jsonFileUpdater( key, documentsToChange)
		rejects = []
		coupledDocuments = self.jsonKeyGetter(key)

		#find the original document
		original = self.zot.item(key)

		#go through every document in coupleDocuments
		for document in coupleDocuments:
		#check their type is equal to original
			groupId = document.keys()[0]
			copy = self.groupAccess().item(document[document[groupId]])
			if copy[0]['itemType'] == original[0]['itemType']:
				itemType = copy[0]['itemType']
				validFields = self.zot.item_type_fields(itemType)[0]
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
	test.config()
	
	
	
	