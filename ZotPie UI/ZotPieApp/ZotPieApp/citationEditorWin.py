from PyQt4 import QtCore, QtGui
from citationEditor import Ui_CitationEditorWindow

class CitationEditorWin(QtGui.QMainWindow, Ui_CitationEditorWindow):
    def __init__(self, parent=None):
        super(CitationEditorWin, self).__init__(parent)
        self.setupUi(self)
        self.eventHandlerSetup()
    
    def eventHandlerSetup(self):
        self.btn_Add.clicked.connect(self.test)

    def test(self):
       self.btn_Remove.setText("ASDAD")
