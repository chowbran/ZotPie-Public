from PyQt4 import QtCore, QtGui
from coupleDocuments import Ui_CoupleDocumentsWindow
from couple import CoupleDocuments

class CoupleDocumentsWin(QtGui.QMainWindow, Ui_CoupleDocumentsWindow):
    def __init__(self, parent=None):
        super(CoupleDocumentsWin, self).__init__(parent)
        self.setupUi(self)
        self.cDoc = CoupleDocuments()
        self.cDoc.config()
        self.cDoc.populateGroupCollections()
        self.eventHandlerSetup()

    def eventHandlerSetup(self):
        pass
    


