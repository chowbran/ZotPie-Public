from PyQt4 import QtCore, QtGui
from batchEditor import Ui_BatchEditorWindow

class BatchEditorWin(QtGui.QMainWindow, Ui_BatchEditorWindow):   #or whatever Q*class it is
    def __init__(self, parent=None):
        super(BatchEditorWin, self).__init__(parent)
        self.setupUi(self)
    def create_child(self):
        print("f")

#etc.