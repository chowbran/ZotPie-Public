from PyQt4 import QtCore, QtGui
from coupleDocuments import Ui_CoupleDocumentsWindow
from pyzotero import zotero

zot = zotero.Zotero('2720485', 'user', 'amxUEQbOcgQShX0Xd0zuQDvR')

class CoupleDocumentsWin(QtGui.QMainWindow, Ui_CoupleDocumentsWindow):
    def __init__(self, parent=None):
        super(CitationEditorWin, self).__init__(parent)
        self.setupUi(self)
        self.eventHandlerSetup()

    def eventHandlerSetup(self):
        pass
    


