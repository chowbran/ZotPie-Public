from PyQt4 import QtCore, QtGui
from coupleDocuments import Ui_CoupleDocumentsWindow
from couple import CoupleDocuments

class CoupleDocumentsWin(QtGui.QMainWindow, Ui_CoupleDocumentsWindow):
    def __init__(self, parent=None):
        super(CitationEditorWin, self).__init__(parent)
        self.setupUi(self)
        #self.cDoc = CoupleDocuments()
        #self.cDoc.config()
        #self.cDoc.populateGroupCollections()
        #self.eventHandlerSetup()
        self.PopulateUserCollections()

    def eventHandlerSetup(self):
        pass
        
    def PopulateUserCollections(self):
        self.combo_Original.addItem("TREST")