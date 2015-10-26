from PyQt4 import QtCore, QtGui
from preferences import Ui_PreferenceWindow

class PreferencesWin(QtGui.QMainWindow, Ui_PreferenceWindow):
    def __init__(self, parent=None):
        super(PreferencesWin, self).__init__(parent)
        self.setupUi(self)
    