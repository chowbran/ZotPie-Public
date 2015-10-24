from PyQt4 import QtGui
from batchEditorWin import BatchEditorWin

if __name__ == '__main__':
    app = QtGui.QApplication([])
    window = BatchEditorWin()
    window.show()
    app.exec_()