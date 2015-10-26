from PyQt4 import QtGui
from mainStartWin import MainStartWin

if __name__ == '__main__':
    app = QtGui.QApplication([])
    window = MainStartWin()
    window.show()
    app.exec_()