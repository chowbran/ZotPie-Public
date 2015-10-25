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
        CoupleDocumentsWindow.resize(800, 560)
        self.centralwidget = QtGui.QWidget(CoupleDocumentsWindow)
        self.centralwidget.setObjectName(_fromUtf8("centralwidget"))
        self.tabWidget = QtGui.QTabWidget(self.centralwidget)
        self.tabWidget.setGeometry(QtCore.QRect(20, 10, 761, 481))
        self.tabWidget.setObjectName(_fromUtf8("tabWidget"))
        self.tab = QtGui.QWidget()
        self.tab.setObjectName(_fromUtf8("tab"))
        self.btn_Sync = QtGui.QPushButton(self.tab)
        self.btn_Sync.setGeometry(QtCore.QRect(660, 420, 75, 23))
        self.btn_Sync.setObjectName(_fromUtf8("btn_Sync"))
        self.list_Original = QtGui.QListView(self.tab)
        self.list_Original.setGeometry(QtCore.QRect(20, 120, 321, 261))
        self.list_Original.setObjectName(_fromUtf8("list_Original"))
        self.lbl_Copy = QtGui.QLabel(self.tab)
        self.lbl_Copy.setGeometry(QtCore.QRect(410, 70, 106, 21))
        self.lbl_Copy.setObjectName(_fromUtf8("lbl_Copy"))
        self.combo_Copy = QtGui.QComboBox(self.tab)
        self.combo_Copy.setGeometry(QtCore.QRect(410, 90, 171, 21))
        self.combo_Copy.setObjectName(_fromUtf8("combo_Copy"))
        self.list_Copy = QtGui.QListView(self.tab)
        self.list_Copy.setGeometry(QtCore.QRect(410, 120, 321, 261))
        self.list_Copy.setObjectName(_fromUtf8("list_Copy"))
        self.lbl_Original = QtGui.QLabel(self.tab)
        self.lbl_Original.setGeometry(QtCore.QRect(20, 70, 106, 20))
        self.lbl_Original.setObjectName(_fromUtf8("lbl_Original"))
        self.combo_Original = QtGui.QComboBox(self.tab)
        self.combo_Original.setGeometry(QtCore.QRect(20, 90, 171, 21))
        self.combo_Original.setObjectName(_fromUtf8("combo_Original"))
        self.tabWidget.addTab(self.tab, _fromUtf8(""))
        self.tab_2 = QtGui.QWidget()
        self.tab_2.setObjectName(_fromUtf8("tab_2"))
        self.combo_Original_Rem = QtGui.QComboBox(self.tab_2)
        self.combo_Original_Rem.setGeometry(QtCore.QRect(20, 90, 171, 21))
        self.combo_Original_Rem.setObjectName(_fromUtf8("combo_Original_Rem"))
        self.lbl_Original_Rem = QtGui.QLabel(self.tab_2)
        self.lbl_Original_Rem.setGeometry(QtCore.QRect(20, 70, 106, 20))
        self.lbl_Original_Rem.setObjectName(_fromUtf8("lbl_Original_Rem"))
        self.list_Original_Rem = QtGui.QListView(self.tab_2)
        self.list_Original_Rem.setGeometry(QtCore.QRect(20, 120, 321, 261))
        self.list_Original_Rem.setObjectName(_fromUtf8("list_Original_Rem"))
        self.list_Copy_Rem = QtGui.QListView(self.tab_2)
        self.list_Copy_Rem.setGeometry(QtCore.QRect(410, 120, 321, 261))
        self.list_Copy_Rem.setObjectName(_fromUtf8("list_Copy_Rem"))
        self.btn_Uncouple = QtGui.QPushButton(self.tab_2)
        self.btn_Uncouple.setGeometry(QtCore.QRect(660, 420, 75, 23))
        self.btn_Uncouple.setObjectName(_fromUtf8("btn_Uncouple"))
        self.tabWidget.addTab(self.tab_2, _fromUtf8(""))
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
        self.btn_Sync.setText(_translate("CoupleDocumentsWindow", "Sync", None))
        self.lbl_Copy.setText(_translate("CoupleDocumentsWindow", "Copy Location:", None))
        self.lbl_Original.setText(_translate("CoupleDocumentsWindow", "Original Location:", None))
        self.tabWidget.setTabText(self.tabWidget.indexOf(self.tab), _translate("CoupleDocumentsWindow", "Couple Records", None))
        self.lbl_Original_Rem.setText(_translate("CoupleDocumentsWindow", "Original Location:", None))
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

