from PyQt4 import QtGui
from batchEditorWin import BatchEditorWin
from citationEditorWin import CitationEditorWin

if __name__ == '__main__':
    app = QtGui.QApplication([])
    window = CitationEditorWin()
    window.show()
    app.exec_()