from PyQt4 import QtCore, QtGui
from coupleDocuments import Ui_CoupleDocumentsWindow
from couple import CoupleDocuments

class CoupleDocumentsWin(QtGui.QMainWindow, Ui_CoupleDocumentsWindow):
    def __init__(self, parent=None):
        super(CoupleDocumentsWin, self).__init__(parent)
        self.setupUi(self)
        self.cDoc = CoupleDocuments()
        self.cDoc.config()
        self.userCollections = self.cDoc.getCollections()
        self.groups = self.cDoc.getGroups()
        self.groupCollections = None

        self.populateUserCollections()
        self.populateUserGroup()
        #self.cDoc.populateGroupCollections()
        self.eventHandlerSetup()

        self.curGroupId = ''


    def eventHandlerSetup(self):

        self.combo_Original.currentIndexChanged.connect(self.populateUserRecords)
        self.combo_Group.currentIndexChanged.connect(self.populateGroupCollections)
        self.combo_Copy.currentIndexChanged.connect(self.populateGroupRecords)

    def populateUserRecords(self):
        self.list_Original.clear()
        index = self.combo_Original.currentIndex()
        collectionName = self.combo_Original.itemText(index)

        collectionKey = ''

        for key in self.userCollections.keys():
            if self.userCollections[key] == collectionName:
                collectionKey = key

        recordsDic = self.cDoc.getRecords(collectionKey)
        
        for value in recordsDic.values():
            self.list_Original.addItem(value)
    
    def populateGroupRecords(self):
        self.list_Copy.clear()
        index = self.combo_Copy.currentIndex()
        collectionName = self.combo_Copy.itemText(index)
        collectionKey = ''

        for key, value in self.groupCollections.iteritems():
            if (value == collectionName):
                collectionKey = key
                break

        recordsDic = self.cDoc.getRecords(collectionKey, self.curGroupId)

        for value in recordsDic.values():
            self.list_Copy.addItem(value)

    def populateGroupCollections(self):
        self.combo_Copy.clear()
        index = self.combo_Group.currentIndex()
        groupName = self.combo_Group.itemText(index)

        for key, value in self.groups.iteritems():
            if (value == groupName):
                self.curGroupId = key
                break

        self.groupCollections = self.cDoc.getCollections(self.curGroupId)

        for value in self.groupCollections.values():
            self.combo_Copy.addItem(value)

    def populateUserGroup(self):

        for key in self.groups.keys():
            self.combo_Group.addItem(self.groups[key])

    def populateUserCollections(self):

        for key in self.userCollections.keys():
            self.combo_Original.addItem(self.userCollections[key])

        self.userCollections['n/a'] = 'no collection'

        print(self.userCollections)

        self.combo_Original.addItem('no collection')





