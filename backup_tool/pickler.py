import pickle
import os

class Pickler:
	''' 
	This class is used to save and load data to be used by a program 
	** this program read and write permissions in the current directory **
	'''

	def __init__(self, _pickle):
		''' 
		Initialize a pickler, data pickled to and retrieve from _pickle 
		'''
		#this will be the path for this save
		self._pickle = "/data/" + _pickle

		#make sure theres a saves directory or the pickle save will fail to create
		try:
			os.stat("/data")
		except:
			os.mkdir("/data")

	def save(self, data):
		'''(Pickler, data) -> NoneType
		serializes data for retreival later from savefile
		'''
		pickle.dump(data, open(self._pickle, "wb"))

	def load(self):
		''' (Pickler) -> data
		loads data from pickle file
		'''
		data = pickle.load(open(self._pickle, "rb"))
		return data
