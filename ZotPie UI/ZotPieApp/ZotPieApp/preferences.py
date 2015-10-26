# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'preferences.ui'
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

class Ui_PreferenceWindow(object):
    def setupUi(self, PreferenceWindow):
        PreferenceWindow.setObjectName(_fromUtf8("PreferenceWindow"))
        PreferenceWindow.resize(389, 224)
        self.centralwidget = QtGui.QWidget(PreferenceWindow)
        self.centralwidget.setObjectName(_fromUtf8("centralwidget"))
        self.gridLayout = QtGui.QGridLayout(self.centralwidget)
        self.gridLayout.setObjectName(_fromUtf8("gridLayout"))
        self.horizontalLayout_2 = QtGui.QHBoxLayout()
        self.horizontalLayout_2.setObjectName(_fromUtf8("horizontalLayout_2"))
        spacerItem = QtGui.QSpacerItem(40, 20, QtGui.QSizePolicy.Expanding, QtGui.QSizePolicy.Minimum)
        self.horizontalLayout_2.addItem(spacerItem)
        self.btn_ok = QtGui.QPushButton(self.centralwidget)
        self.btn_ok.setObjectName(_fromUtf8("btn_ok"))
        self.horizontalLayout_2.addWidget(self.btn_ok)
        self.btn_cancel = QtGui.QPushButton(self.centralwidget)
        self.btn_cancel.setObjectName(_fromUtf8("btn_cancel"))
        self.horizontalLayout_2.addWidget(self.btn_cancel)
        self.gridLayout.addLayout(self.horizontalLayout_2, 1, 0, 1, 1)
        self.tabWidget = QtGui.QTabWidget(self.centralwidget)
        self.tabWidget.setObjectName(_fromUtf8("tabWidget"))
        self.tab = QtGui.QWidget()
        self.tab.setObjectName(_fromUtf8("tab"))
        self.gridLayout_3 = QtGui.QGridLayout(self.tab)
        self.gridLayout_3.setObjectName(_fromUtf8("gridLayout_3"))
        self.horizontalLayout = QtGui.QHBoxLayout()
        self.horizontalLayout.setObjectName(_fromUtf8("horizontalLayout"))
        self.group_Keys = QtGui.QGroupBox(self.tab)
        self.group_Keys.setObjectName(_fromUtf8("group_Keys"))
        self.verticalLayout = QtGui.QVBoxLayout(self.group_Keys)
        self.verticalLayout.setObjectName(_fromUtf8("verticalLayout"))
        self.formLayout = QtGui.QFormLayout()
        self.formLayout.setFieldGrowthPolicy(QtGui.QFormLayout.AllNonFixedFieldsGrow)
        self.formLayout.setObjectName(_fromUtf8("formLayout"))
        self.lbl_apiKey = QtGui.QLabel(self.group_Keys)
        self.lbl_apiKey.setObjectName(_fromUtf8("lbl_apiKey"))
        self.formLayout.setWidget(0, QtGui.QFormLayout.LabelRole, self.lbl_apiKey)
        self.txt_apiKey = QtGui.QLineEdit(self.group_Keys)
        self.txt_apiKey.setObjectName(_fromUtf8("txt_apiKey"))
        self.formLayout.setWidget(0, QtGui.QFormLayout.FieldRole, self.txt_apiKey)
        self.lbl_LibraryID = QtGui.QLabel(self.group_Keys)
        self.lbl_LibraryID.setObjectName(_fromUtf8("lbl_LibraryID"))
        self.formLayout.setWidget(1, QtGui.QFormLayout.LabelRole, self.lbl_LibraryID)
        self.txt_LibraryID = QtGui.QLineEdit(self.group_Keys)
        self.txt_LibraryID.setObjectName(_fromUtf8("txt_LibraryID"))
        self.formLayout.setWidget(1, QtGui.QFormLayout.FieldRole, self.txt_LibraryID)
        self.verticalLayout.addLayout(self.formLayout)
        self.horizontalLayout.addWidget(self.group_Keys)
        spacerItem1 = QtGui.QSpacerItem(40, 20, QtGui.QSizePolicy.Expanding, QtGui.QSizePolicy.Minimum)
        self.horizontalLayout.addItem(spacerItem1)
        self.gridLayout_3.addLayout(self.horizontalLayout, 0, 0, 1, 1)
        self.tabWidget.addTab(self.tab, _fromUtf8(""))
        self.tab_2 = QtGui.QWidget()
        self.tab_2.setObjectName(_fromUtf8("tab_2"))
        self.tabWidget.addTab(self.tab_2, _fromUtf8(""))
        self.gridLayout.addWidget(self.tabWidget, 0, 0, 1, 1)
        spacerItem2 = QtGui.QSpacerItem(20, 40, QtGui.QSizePolicy.Minimum, QtGui.QSizePolicy.Expanding)
        self.gridLayout.addItem(spacerItem2, 2, 0, 1, 1)
        PreferenceWindow.setCentralWidget(self.centralwidget)
        self.menubar = QtGui.QMenuBar(PreferenceWindow)
        self.menubar.setGeometry(QtCore.QRect(0, 0, 389, 21))
        self.menubar.setObjectName(_fromUtf8("menubar"))
        PreferenceWindow.setMenuBar(self.menubar)
        self.statusbar = QtGui.QStatusBar(PreferenceWindow)
        self.statusbar.setObjectName(_fromUtf8("statusbar"))
        PreferenceWindow.setStatusBar(self.statusbar)

        self.retranslateUi(PreferenceWindow)
        self.tabWidget.setCurrentIndex(0)
        QtCore.QMetaObject.connectSlotsByName(PreferenceWindow)

    def retranslateUi(self, PreferenceWindow):
        PreferenceWindow.setWindowTitle(_translate("PreferenceWindow", "Preferences", None))
        self.btn_ok.setText(_translate("PreferenceWindow", "OK", None))
        self.btn_cancel.setText(_translate("PreferenceWindow", "Cancel", None))
        self.group_Keys.setTitle(_translate("PreferenceWindow", "Zotero Keys", None))
        self.lbl_apiKey.setText(_translate("PreferenceWindow", "API Key:", None))
        self.lbl_LibraryID.setText(_translate("PreferenceWindow", "Library ID:", None))
        self.tabWidget.setTabText(self.tabWidget.indexOf(self.tab), _translate("PreferenceWindow", "Settings", None))
        self.tabWidget.setTabText(self.tabWidget.indexOf(self.tab_2), _translate("PreferenceWindow", "PLACEHOLDER", None))


if __name__ == "__main__":
    import sys
    app = QtGui.QApplication(sys.argv)
    PreferenceWindow = QtGui.QMainWindow()
    ui = Ui_PreferenceWindow()
    ui.setupUi(PreferenceWindow)
    PreferenceWindow.show()
    sys.exit(app.exec_())

