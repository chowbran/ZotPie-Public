# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'mainStart.ui'
#
# Created by: PyQt4 UI code generator 4.11.4
#
# WARNING! All changes made in this file will be lost!

from PyQt4 import QtCore, QtGui

try:
    _fromUtf8 = QtCore.QString.fromUtf8
except AttributeError:
    def _fromUtf8(s):
        return s

try:
    _encoding = QtGui.QApplication.UnicodeUTF8
    def _translate(context, text, disambig):
        return QtGui.QApplication.translate(context, text, disambig, _encoding)
except AttributeError:
    def _translate(context, text, disambig):
        return QtGui.QApplication.translate(context, text, disambig)

class Ui_StartWindow(object):
    def setupUi(self, StartWindow):
        StartWindow.setObjectName(_fromUtf8("StartWindow"))
        StartWindow.resize(614, 361)
        self.centralwidget = QtGui.QWidget(StartWindow)
        self.centralwidget.setObjectName(_fromUtf8("centralwidget"))
        self.horizontalLayout = QtGui.QHBoxLayout(self.centralwidget)
        self.horizontalLayout.setObjectName(_fromUtf8("horizontalLayout"))
        self.verticalLayout = QtGui.QVBoxLayout()
        self.verticalLayout.setObjectName(_fromUtf8("verticalLayout"))
        self.label = QtGui.QLabel(self.centralwidget)
        font = QtGui.QFont()
        font.setPointSize(22)
        self.label.setFont(font)
        self.label.setObjectName(_fromUtf8("label"))
        self.verticalLayout.addWidget(self.label)
        self.textEdit = QtGui.QTextEdit(self.centralwidget)
        self.textEdit.setEnabled(True)
        self.textEdit.setObjectName(_fromUtf8("textEdit"))
        self.verticalLayout.addWidget(self.textEdit)
        self.horizontalLayout.addLayout(self.verticalLayout)
        self.verticalLayout_2 = QtGui.QVBoxLayout()
        self.verticalLayout_2.setObjectName(_fromUtf8("verticalLayout_2"))
        self.btn_OpenBatchEditor = QtGui.QPushButton(self.centralwidget)
        self.btn_OpenBatchEditor.setObjectName(_fromUtf8("btn_OpenBatchEditor"))
        self.verticalLayout_2.addWidget(self.btn_OpenBatchEditor)
        self.btn_OpenCitationEditor = QtGui.QPushButton(self.centralwidget)
        self.btn_OpenCitationEditor.setObjectName(_fromUtf8("btn_OpenCitationEditor"))
        self.verticalLayout_2.addWidget(self.btn_OpenCitationEditor)
        self.btn_OpenCoupleDocuments = QtGui.QPushButton(self.centralwidget)
        self.btn_OpenCoupleDocuments.setObjectName(_fromUtf8("btn_OpenCoupleDocuments"))
        self.verticalLayout_2.addWidget(self.btn_OpenCoupleDocuments)
        spacerItem = QtGui.QSpacerItem(20, 40, QtGui.QSizePolicy.Minimum, QtGui.QSizePolicy.Expanding)
        self.verticalLayout_2.addItem(spacerItem)
        spacerItem1 = QtGui.QSpacerItem(40, 20, QtGui.QSizePolicy.Expanding, QtGui.QSizePolicy.Minimum)
        self.verticalLayout_2.addItem(spacerItem1)
        self.btn_Prefs = QtGui.QPushButton(self.centralwidget)
        self.btn_Prefs.setObjectName(_fromUtf8("btn_Prefs"))
        self.verticalLayout_2.addWidget(self.btn_Prefs)
        self.btn_Quit = QtGui.QPushButton(self.centralwidget)
        self.btn_Quit.setObjectName(_fromUtf8("btn_Quit"))
        self.verticalLayout_2.addWidget(self.btn_Quit)
        self.horizontalLayout.addLayout(self.verticalLayout_2)
        StartWindow.setCentralWidget(self.centralwidget)
        self.menubar = QtGui.QMenuBar(StartWindow)
        self.menubar.setGeometry(QtCore.QRect(0, 0, 614, 21))
        self.menubar.setObjectName(_fromUtf8("menubar"))
        self.menu_Tools = QtGui.QMenu(self.menubar)
        self.menu_Tools.setObjectName(_fromUtf8("menu_Tools"))
        StartWindow.setMenuBar(self.menubar)
        self.statusbar = QtGui.QStatusBar(StartWindow)
        self.statusbar.setObjectName(_fromUtf8("statusbar"))
        StartWindow.setStatusBar(self.statusbar)
        self.actionPreferences = QtGui.QAction(StartWindow)
        self.actionPreferences.setObjectName(_fromUtf8("actionPreferences"))
        self.menu_Tools.addAction(self.actionPreferences)
        self.menubar.addAction(self.menu_Tools.menuAction())

        self.retranslateUi(StartWindow)
        QtCore.QMetaObject.connectSlotsByName(StartWindow)

    def retranslateUi(self, StartWindow):
        StartWindow.setWindowTitle(_translate("StartWindow", "ZotPie", None))
        self.label.setText(_translate("StartWindow", "Welcome to ZotPie!", None))
        self.textEdit.setHtml(_translate("StartWindow", "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.0//EN\" \"http://www.w3.org/TR/REC-html40/strict.dtd\">\n"
"<html><head><meta name=\"qrichtext\" content=\"1\" /><style type=\"text/css\">\n"
"p, li { white-space: pre-wrap; }\n"
"</style></head><body style=\" font-family:\'MS Shell Dlg 2\'; font-size:8.25pt; font-weight:400; font-style:normal;\">\n"
"<p style=\" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;\"><span style=\" font-size:8pt;\">Here you will find many useful tools to speed up your Zotero workflow!</span></p>\n"
"<p style=\"-qt-paragraph-type:empty; margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px; font-size:8pt;\"><br /></p>\n"
"<p style=\" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;\"><span style=\" font-size:8pt;\">If this is your first time using ZotPie, please enter your API key and library ID in &quot;Preferences&quot;.</span></p>\n"
"<p style=\"-qt-paragraph-type:empty; margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px; font-size:8pt;\"><br /></p>\n"
"<p style=\" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;\"><span style=\" font-size:8pt;\">Your personal library ID can be found here: </span><a href=\"https://www.zotero.org/settings/keys\"><span style=\" font-size:8pt; text-decoration: underline; color:#0000ff;\">Library ID</span></a></p>\n"
"<p style=\" margin-top:0px; margin-bottom:0px; margin-left:0px; margin-right:0px; -qt-block-indent:0; text-indent:0px;\"><span style=\" font-size:8pt;\">Your API key can be found here: </span><a href=\"https://www.zotero.org/user/login\"><span style=\" font-size:8pt; text-decoration: underline; color:#0000ff;\">API Key</span></a></p></body></html>", None))
        self.btn_OpenBatchEditor.setText(_translate("StartWindow", "Tag Batch Editor", None))
        self.btn_OpenCitationEditor.setText(_translate("StartWindow", "Citation Editor", None))
        self.btn_OpenCoupleDocuments.setText(_translate("StartWindow", "Couple Documents", None))
        self.btn_Prefs.setText(_translate("StartWindow", "Preferences", None))
        self.btn_Quit.setText(_translate("StartWindow", "Quit", None))
        self.menu_Tools.setTitle(_translate("StartWindow", "&Tools", None))
        self.actionPreferences.setText(_translate("StartWindow", "Preferences", None))


if __name__ == "__main__":
    import sys
    app = QtGui.QApplication(sys.argv)
    StartWindow = QtGui.QMainWindow()
    ui = Ui_StartWindow()
    ui.setupUi(StartWindow)
    StartWindow.show()
    sys.exit(app.exec_())

