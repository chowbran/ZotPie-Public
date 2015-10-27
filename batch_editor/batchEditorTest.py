import unittest
from BEditor import BEditor
from pyzotero import zotero


class TestBatchEdit(unittest.TestCase):
	api_key = 'jxIEnHTfXW5guwz6X8q5upsv'
	user_type = 'user'
	user_id = '2710002'


	tags = ['initTag', 'tagBatchEdit1', 'tagBatchEdit2', 'tagBatchEdit3']
	zot = zotero.Zotero(user_id, user_type, api_key)
	editor = BEditor(user_id, user_type, api_key)

	n = 10 #Number of items to create
	items = []

	@classmethod
	def setUpClass(self):

		templates = []

		# Place 10b book items labelled batchEditorTest_i
		for i in range(0, self.n):
			template = self.zot.item_template('book')
			template['title'] = 'batchEditorTest_' + str(i)
			template['tags'] = [{u'tag': self.tags[0], u'type': 1}]

			# Store all created books in a list
			templates += [template] 


		# Create all the items
		resp = self.zot.create_items(templates)
		self.items = resp['success']

	@classmethod
	def tearDownClass(self):
		for itemID in self.items.values():
			item = self.zot.item(itemID)
			self.zot.delete_item(item)

	def testSingleBatch1(self):
		newTags = []
		k = 1
		newTag = self.tags[k]

		for i in range(0, k):
			self.editor.batch_edit_tag(self.tags[i], self.tags[i+1])

		# self.currentTag = self.tags[1]

		for itemID in self.items.values():
			newTags += self.zot.item_tags(itemID)

		# print newTags
		# print [unicode(newTag, "utf-8")]*self.n

		self.assertEqual(newTags, [unicode(newTag, "utf-8")]*self.n, "Edit Single Batch " + str(k))

	def testSingleBatch2(self):
		newTags = []
		k = 2
		newTag = self.tags[k]

		for i in range(0, k):
			self.editor.batch_edit_tag(self.tags[i], self.tags[i+1])

		# self.currentTag = self.tags[1]

		for itemID in self.items.values():
			newTags += self.zot.item_tags(itemID)

		# print newTags
		# print [unicode(newTag, "utf-8")]*self.n

		self.assertEqual(newTags, [unicode(newTag, "utf-8")]*self.n, "Edit Single Batch " + str(k))

	def testSingleBatch3(self):
		newTags = []
		k = 3
		newTag = self.tags[k]

		for i in range(0, k):
			self.editor.batch_edit_tag(self.tags[i], self.tags[i+1])

		# self.currentTag = self.tags[1]

		for itemID in self.items.values():
			newTags += self.zot.item_tags(itemID)

		# print newTags
		# print [unicode(newTag, "utf-8")]*self.n

		self.assertEqual(newTags, [unicode(newTag, "utf-8")]*self.n, "Edit Single Batch " + str(k))

class TestBatchCollectionEdit(unittest.TestCase):
	api_key = 'jxIEnHTfXW5guwz6X8q5upsv'
	user_type = 'user'
	user_id = '2710002'


	tags = ['initTag', 'tagBatchEdit1', 'tagBatchEdit2', 'tagBatchEdit3']
	zot = zotero.Zotero(user_id, user_type, api_key)
	editor = BEditor(user_id, user_type, api_key)

	n = 5 #Number of items to create
	items = []

	@classmethod
	def setUpClass(self):

		templates = []

		# Place 10b book items labelled batchEditorTest_i
		for i in range(0, self.n):
			template = self.zot.item_template('book')
			template['title'] = 'batchEditorTest_' + str(i)
			template['tags'] = [{u'tag': self.tags[0], u'type': 1}]

			# Store all created books in a list
			templates += [template] 


		# Create all the items
		resp = self.zot.create_items(templates)
		self.items = resp['success']

	@classmethod
	def tearDownClass(self):
		for itemID in self.items.values():
			item = self.zot.item(itemID)
			self.zot.delete_item(item)

	def testSingleBatch1(self):
		newTags = []
		k = 1
		newTag = self.tags[k]

		for i in range(0, k):
			self.editor.batch_edit_tag(self.tags[i], self.tags[i+1])

		# self.currentTag = self.tags[1]

		for itemID in self.items.values():
			newTags += self.zot.item_tags(itemID)

		# print newTags
		# print [unicode(newTag, "utf-8")]*self.n

		self.assertEqual(newTags, [unicode(newTag, "utf-8")]*self.n, "Edit Single Batch " + str(k))

	def testSingleBatch2(self):
		newTags = []
		k = 2
		newTag = self.tags[k]

		for i in range(0, k):
			self.editor.batch_edit_tag(self.tags[i], self.tags[i+1])

		# self.currentTag = self.tags[1]

		for itemID in self.items.values():
			newTags += self.zot.item_tags(itemID)

		# print newTags
		# print [unicode(newTag, "utf-8")]*self.n

		self.assertEqual(newTags, [unicode(newTag, "utf-8")]*self.n, "Edit Single Batch " + str(k))

	def testSingleBatch3(self):
		newTags = []
		k = 3
		newTag = self.tags[k]

		for i in range(0, k):
			self.editor.batch_edit_tag(self.tags[i], self.tags[i+1])

		# self.currentTag = self.tags[1]

		for itemID in self.items.values():
			newTags += self.zot.item_tags(itemID)

		# print newTags
		# print [unicode(newTag, "utf-8")]*self.n

		self.assertEqual(newTags, [unicode(newTag, "utf-8")]*self.n, "Edit Single Batch " + str(k))


if __name__ == '__main__':
	unittest.main()
