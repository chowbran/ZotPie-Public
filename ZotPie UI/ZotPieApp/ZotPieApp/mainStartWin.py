﻿from PyQt4 import QtCore, QtGui
from mainStart import Ui_StartWindow
from batchEditorWin import BatchEditorWin
from citationEditorWin import CitationEditorWin
#from coupleDocumentsWin import CoupleDocumentsWin
from preferencesWin import PreferencesWin
from userData import UserData

import sys

class MainStartWin(QtGui.QMainWindow, Ui_StartWindow):
    def __init__(self, parent=None):
        super(MainStartWin, self).__init__(parent)
        self.setupUi(self)
        self.eventHandlerSetup()
        self.userData = UserData()
        self.userData.setKeyValue("GENERAL", 'apikey2', '1111222221122')

    def eventHandlerSetup(self):
        self.btn_OpenBatchEditor.clicked.connect(lambda: self.openWindow(BatchEditorWin(self)))
        self.btn_OpenCitationEditor.clicked.connect(lambda: self.openWindow(CitationEditorWin(self)))
        #self.btn_OpenCoupleDocuments.clicked.connect(lambda: self.openWindow(CoupleDocumentsWin()))
        #self.btn_OpenCoupleDocuments.clicked.connect(lambda: self.testuserdata())
        self.btn_Prefs.clicked.connect(lambda: self.openWindow(PreferencesWin(self)))
        self.btn_Quit.clicked.connect(lambda: sys.exit(0))

    def openWindow(self, window):
        window.show()




    