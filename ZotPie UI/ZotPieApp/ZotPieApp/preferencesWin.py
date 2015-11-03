from PyQt4 import QtCore, QtGui
from preferences import Ui_PreferenceWindow
from userData import UserData

class PreferencesWin(QtGui.QMainWindow, Ui_PreferenceWindow):
    def __init__(self, parent=None):
        super(PreferencesWin, self).__init__(parent)
        self.setupUi(self)
        self.userData = UserData()
        self.txt_apiKey.setText(self.userData.getValue('GENERAL', 'apikey'))
        self.txt_LibraryID.setText(self.userData.getValue('GENERAL', 'libraryid'))
        self.eventHandlerSetup()

    def eventHandlerSetup(self):
        self.btn_cancel.clicked.connect(lambda: self.close())
        self.btn_ok.clicked.connect(lambda: self.saveData())
    
    def saveData(self):
        self.userData.setKeyValue('GENERAL', 'apikey', str(self.txt_apiKey.text()))
        self.userData.setKeyValue('GENERAL', 'libraryid', str(self.txt_LibraryID.text()))
        self.close()    



    