import sys
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


	def config(uid, key, utype='user'):
		''' sets the user_id, user_type, and API Key so that program can
			access the user's zotero library.
	    '''
		self.zot = zotero.Zotero(uid, utype, key)
		self.zotgroup = zotero.Zotero(uidGroup, utypeGroup, keyGroup)


	def jsonFileUpdater(key, documentList):
		'''takes in a key of an original document and a list of all documents
		   in groups to be coupled. Creates a json file if it doesn't exist
		   otherwise, searches through json to find the key to grab the list.
		   updates the list with new coupled documents if necessary. Returns 
		   a list with the key.
		'''
 		try:
 			if (os.path.isfile('keys.json')):
 				json_file = open('keys.json', 'r')
 				json_str = json.read()
				json_dic = json.loads(json_str)[0]

				for itemkey, value in json_dic.iteritems():
					if itemkey == key:
						value = documentList

				json_file = open('keys,json', 'w')
 			else:
 				json_file = open('keys,json', 'w')
 				json_dic = {key: documentList}		

			
			json.dump(json_dic, json_file)		
			json.close()

			return json_dic


		except IOerror as e:
			print 'Unable to open file' #file does not exist 


	def jsonFileGetter(key):
		'''Given a key, goes through the json file to find the corresponding
		   list of keys
		'''

		try:
			json_file = open('keys.json', 'r')

			json_str = json.read()
			json_dic = json.loads(json_str)[0]

			json_file.close()

			for itemkey, value in json_dic.iteritems():
				if itemkey == key:
					return value


		except IOerror as e:
			print 'Unable to open file' #file does not exist 


	def updateCoupledDocuments(key):
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



	

		