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
        self.groupCollections = self.cDoc.getGroups()
        self.populateUserCollections()
        self.populateUserGroup()
        #self.cDoc.populateGroupCollections()
        self.eventHandlerSetup()


    def eventHandlerSetup(self):

        self.combo_Original.currentIndexChanged.connect(self.populateUserRecords)
        self.combo_Group.currentIndexChanged.connect(self.populateGroupCollections)

    def populateUserRecords(self):

        index = self.combo_Original.currentIndex()
        collectionName = (self.combo_Original.itemText(index))
        collection = self.userCollections
        collectionKey = ''

        for key in collection.keys():
            if self.userCollections[key] == collectionName:
                collectionKey = key

        recordsDic = self.cDoc.getRecords(collectionKey)
        recordTitles = []

        for key in recordsDic.keys():
            recordTitles += [recordsDic[key]]


        model = QtGui.QStandardItemModel(self.list_Original)

        for record in recordTitles:
            item = QtGui.QStandardItem(record)
            model.appendRow(item)

        self.list_Original.setModel(model)

    def populateGroupCollections(self):

        index = self.combo_Original.currentIndex()
        groupName = self.combo_Group.itemText(index)
        groupId 

        for

    def populateUserGroup(self):

        for key in self.groupCollections.keys():
            self.combo_Group.addItem(self.groupCollections[key])

    def populateUserCollections(self):

        for key in self.userCollections.keys():
            self.combo_Original.addItem(self.userCollections[key])





