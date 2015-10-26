from PyQt4 import QtCore, QtGui
from coupleDocuments import Ui_CoupleDocumentsWindow
from pyzotero import zotero
from couple import CoupleDocuments

zot = zotero.Zotero('2720485', 'user', 'amxUEQbOcgQShX0Xd0zuQDvR')

class CoupleDocumentsWin(QtGui.QMainWindow, Ui_CoupleDocumentsWindow):
    def __init__(self, parent=None):
        super(CitationEditorWin, self).__init__(parent)
        self.setupUi(self)
        self.cDoc = CoupleDocuments()
        self.cDoc.config()
        self.cDoc.populateGroupCollections()
        self.eventHandlerSetup()

    def eventHandlerSetup(self):
        pass
    


