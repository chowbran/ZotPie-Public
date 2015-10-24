from PyQt4 import QtCore, QtGui
from citationEditor import Ui_CitationEditorWindow

class CitationEditorWin(QtGui.QMainWindow, Ui_CitationEditorWindow):   #or whatever Q*class it is
    def __init__(self, parent=None):
        super(CitationEditorWin, self).__init__(parent)
        self.setupUi(self)
    def create_child(self):
        print("f")
