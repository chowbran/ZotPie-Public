# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'coupleDocuments.ui'
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

class Ui_CoupleDocumentsWindow(object):
    def setupUi(self, CoupleDocumentsWindow):
        CoupleDocumentsWindow.setObjectName(_fromUtf8("CoupleDocumentsWindow"))
        CoupleDocumentsWindow.resize(800, 423)
        self.centralwidget = QtGui.QWidget(CoupleDocumentsWindow)
        self.centralwidget.setObjectName(_fromUtf8("centralwidget"))
        self.gridLayout_2 = QtGui.QGridLayout(self.centralwidget)
        self.gridLayout_2.setObjectName(_fromUtf8("gridLayout_2"))
        self.tabWidget = QtGui.QTabWidget(self.centralwidget)
        self.tabWidget.setObjectName(_fromUtf8("tabWidget"))
        self.tab = QtGui.QWidget()
        self.tab.setObjectName(_fromUtf8("tab"))
        self.gridLayout = QtGui.QGridLayout(self.tab)
        self.gridLayout.setObjectName(_fromUtf8("gridLayout"))
        self.combo_Original = QtGui.QComboBox(self.tab)
        self.combo_Original.setObjectName(_fromUtf8("combo_Original"))
        self.gridLayout.addWidget(self.combo_Original, 1, 0, 1, 1)
        self.list_Copy = QtGui.QListView(self.tab)
        self.list_Copy.setObjectName(_fromUtf8("list_Copy"))
        self.gridLayout.addWidget(self.list_Copy, 2, 2, 1, 2)
        self.lbl_Original = QtGui.QLabel(self.tab)
        self.lbl_Original.setObjectName(_fromUtf8("lbl_Original"))
        self.gridLayout.addWidget(self.lbl_Original, 0, 0, 1, 1)
        self.combo_Copy = QtGui.QComboBox(self.tab)
        self.combo_Copy.setObjectName(_fromUtf8("combo_Copy"))
        self.gridLayout.addWidget(self.combo_Copy, 1, 3, 1, 1)
        self.combo_Group = QtGui.QComboBox(self.tab)
        self.combo_Group.setObjectName(_fromUtf8("combo_Group"))
        self.gridLayout.addWidget(self.combo_Group, 1, 2, 1, 1)
        self.lbl_Copy = QtGui.QLabel(self.tab)
        self.lbl_Copy.setObjectName(_fromUtf8("lbl_Copy"))
        self.gridLayout.addWidget(self.lbl_Copy, 0, 3, 1, 1)
        self.lbl_Group = QtGui.QLabel(self.tab)
        self.lbl_Group.setObjectName(_fromUtf8("lbl_Group"))
        self.gridLayout.addWidget(self.lbl_Group, 0, 2, 1, 1)
        spacerItem = QtGui.QSpacerItem(40, 20, QtGui.QSizePolicy.Preferred, QtGui.QSizePolicy.Minimum)
        self.gridLayout.addItem(spacerItem, 1, 1, 1, 1)
        self.list_Original = QtGui.QListView(self.tab)
        self.list_Original.setObjectName(_fromUtf8("list_Original"))
        self.gridLayout.addWidget(self.list_Original, 2, 0, 1, 2)
        self.btn_Sync = QtGui.QPushButton(self.tab)
        self.btn_Sync.setObjectName(_fromUtf8("btn_Sync"))
        self.gridLayout.addWidget(self.btn_Sync, 3, 3, 1, 1)
        self.tabWidget.addTab(self.tab, _fromUtf8(""))
        self.tab_2 = QtGui.QWidget()
        self.tab_2.setObjectName(_fromUtf8("tab_2"))
        self.gridLayout_3 = QtGui.QGridLayout(self.tab_2)
        self.gridLayout_3.setObjectName(_fromUtf8("gridLayout_3"))
        self.list_Copy_Rem = QtGui.QListView(self.tab_2)
        self.list_Copy_Rem.setObjectName(_fromUtf8("list_Copy_Rem"))
        self.gridLayout_3.addWidget(self.list_Copy_Rem, 3, 1, 1, 1)
        self.list_Original_Rem = QtGui.QListView(self.tab_2)
        self.list_Original_Rem.setObjectName(_fromUtf8("list_Original_Rem"))
        self.gridLayout_3.addWidget(self.list_Original_Rem, 3, 0, 1, 1)
        spacerItem1 = QtGui.QSpacerItem(40, 20, QtGui.QSizePolicy.Expanding, QtGui.QSizePolicy.Minimum)
        self.gridLayout_3.addItem(spacerItem1, 4, 0, 1, 1)
        self.lbl_Original_Rem = QtGui.QLabel(self.tab_2)
        self.lbl_Original_Rem.setObjectName(_fromUtf8("lbl_Original_Rem"))
        self.gridLayout_3.addWidget(self.lbl_Original_Rem, 0, 0, 1, 1)
        self.lbl_Coupled = QtGui.QLabel(self.tab_2)
        self.lbl_Coupled.setObjectName(_fromUtf8("lbl_Coupled"))
        self.gridLayout_3.addWidget(self.lbl_Coupled, 1, 1, 1, 1)
        self.horizontalLayout_4 = QtGui.QHBoxLayout()
        self.horizontalLayout_4.setObjectName(_fromUtf8("horizontalLayout_4"))
        self.combo_Original_Rem = QtGui.QComboBox(self.tab_2)
        self.combo_Original_Rem.setObjectName(_fromUtf8("combo_Original_Rem"))
        self.horizontalLayout_4.addWidget(self.combo_Original_Rem)
        spacerItem2 = QtGui.QSpacerItem(40, 20, QtGui.QSizePolicy.Preferred, QtGui.QSizePolicy.Minimum)
        self.horizontalLayout_4.addItem(spacerItem2)
        self.gridLayout_3.addLayout(self.horizontalLayout_4, 1, 0, 1, 1)
        self.btn_Uncouple = QtGui.QPushButton(self.tab_2)
        self.btn_Uncouple.setObjectName(_fromUtf8("btn_Uncouple"))
        self.gridLayout_3.addWidget(self.btn_Uncouple, 4, 1, 1, 1)
        self.tabWidget.addTab(self.tab_2, _fromUtf8(""))
        self.gridLayout_2.addWidget(self.tabWidget, 0, 0, 1, 1)
        CoupleDocumentsWindow.setCentralWidget(self.centralwidget)
        self.menubar = QtGui.QMenuBar(CoupleDocumentsWindow)
        self.menubar.setGeometry(QtCore.QRect(0, 0, 800, 21))
        self.menubar.setObjectName(_fromUtf8("menubar"))
        CoupleDocumentsWindow.setMenuBar(self.menubar)
        self.statusbar = QtGui.QStatusBar(CoupleDocumentsWindow)
        self.statusbar.setObjectName(_fromUtf8("statusbar"))
        CoupleDocumentsWindow.setStatusBar(self.statusbar)

        self.retranslateUi(CoupleDocumentsWindow)
        self.tabWidget.setCurrentIndex(0)
        QtCore.QMetaObject.connectSlotsByName(CoupleDocumentsWindow)

    def retranslateUi(self, CoupleDocumentsWindow):
        CoupleDocumentsWindow.setWindowTitle(_translate("CoupleDocumentsWindow", "Couple Documents", None))
        self.lbl_Original.setText(_translate("CoupleDocumentsWindow", "Collection of Original:", None))
        self.lbl_Copy.setText(_translate("CoupleDocumentsWindow", "Collection of Copy:", None))
        self.lbl_Group.setText(_translate("CoupleDocumentsWindow", "Group of Copy:", None))
        self.btn_Sync.setText(_translate("CoupleDocumentsWindow", "Sync", None))
        self.tabWidget.setTabText(self.tabWidget.indexOf(self.tab), _translate("CoupleDocumentsWindow", "Couple Records", None))
        self.lbl_Original_Rem.setText(_translate("CoupleDocumentsWindow", "Collection:", None))
        self.lbl_Coupled.setText(_translate("CoupleDocumentsWindow", "Coupled Records:", None))
        self.btn_Uncouple.setText(_translate("CoupleDocumentsWindow", "Un-couple", None))
        self.tabWidget.setTabText(self.tabWidget.indexOf(self.tab_2), _translate("CoupleDocumentsWindow", "Un-couple Records", None))


if __name__ == "__main__":
    import sys
    app = QtGui.QApplication(sys.argv)
    CoupleDocumentsWindow = QtGui.QMainWindow()
    ui = Ui_CoupleDocumentsWindow()
    ui.setupUi(CoupleDocumentsWindow)
    CoupleDocumentsWindow.show()
    sys.exit(app.exec_())

