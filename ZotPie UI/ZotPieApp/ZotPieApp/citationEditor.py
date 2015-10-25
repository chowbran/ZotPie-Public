# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'citationEditor.ui'
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

class Ui_CitationEditorWindow(object):
    def setupUi(self, CitationEditorWindow):
        CitationEditorWindow.setObjectName(_fromUtf8("CitationEditorWindow"))
        CitationEditorWindow.resize(762, 436)
        self.centralwidget = QtGui.QWidget(CitationEditorWindow)
        self.centralwidget.setObjectName(_fromUtf8("centralwidget"))
        self.grp_Parameters = QtGui.QGroupBox(self.centralwidget)
        self.grp_Parameters.setGeometry(QtCore.QRect(130, 190, 511, 131))
        self.grp_Parameters.setObjectName(_fromUtf8("grp_Parameters"))
        self.combo_Fields = QtGui.QComboBox(self.grp_Parameters)
        self.combo_Fields.setGeometry(QtCore.QRect(60, 80, 171, 22))
        self.combo_Fields.setObjectName(_fromUtf8("combo_Fields"))
        self.combo_Record = QtGui.QComboBox(self.grp_Parameters)
        self.combo_Record.setGeometry(QtCore.QRect(60, 40, 171, 22))
        self.combo_Record.setObjectName(_fromUtf8("combo_Record"))
        self.lbl_Fields = QtGui.QLabel(self.grp_Parameters)
        self.lbl_Fields.setGeometry(QtCore.QRect(30, 80, 31, 16))
        self.lbl_Fields.setObjectName(_fromUtf8("lbl_Fields"))
        self.lbl_Record = QtGui.QLabel(self.grp_Parameters)
        self.lbl_Record.setGeometry(QtCore.QRect(20, 40, 46, 13))
        self.lbl_Record.setObjectName(_fromUtf8("lbl_Record"))
        self.btn_Add = QtGui.QPushButton(self.grp_Parameters)
        self.btn_Add.setGeometry(QtCore.QRect(280, 40, 75, 23))
        self.btn_Add.setObjectName(_fromUtf8("btn_Add"))
        self.btn_Remove = QtGui.QPushButton(self.grp_Parameters)
        self.btn_Remove.setGeometry(QtCore.QRect(380, 40, 75, 23))
        self.btn_Remove.setObjectName(_fromUtf8("btn_Remove"))
        self.btn_Generate = QtGui.QPushButton(self.centralwidget)
        self.btn_Generate.setGeometry(QtCore.QRect(670, 360, 75, 23))
        self.btn_Generate.setObjectName(_fromUtf8("btn_Generate"))
        self.btn_Preview = QtGui.QPushButton(self.centralwidget)
        self.btn_Preview.setGeometry(QtCore.QRect(580, 360, 75, 23))
        self.btn_Preview.setObjectName(_fromUtf8("btn_Preview"))
        self.grp_Citation = QtGui.QGroupBox(self.centralwidget)
        self.grp_Citation.setGeometry(QtCore.QRect(130, 40, 511, 121))
        self.grp_Citation.setObjectName(_fromUtf8("grp_Citation"))
        CitationEditorWindow.setCentralWidget(self.centralwidget)
        self.menubar = QtGui.QMenuBar(CitationEditorWindow)
        self.menubar.setGeometry(QtCore.QRect(0, 0, 762, 21))
        self.menubar.setObjectName(_fromUtf8("menubar"))
        CitationEditorWindow.setMenuBar(self.menubar)
        self.statusbar = QtGui.QStatusBar(CitationEditorWindow)
        self.statusbar.setObjectName(_fromUtf8("statusbar"))
        CitationEditorWindow.setStatusBar(self.statusbar)

        self.retranslateUi(CitationEditorWindow)
        QtCore.QMetaObject.connectSlotsByName(CitationEditorWindow)

    def retranslateUi(self, CitationEditorWindow):
        CitationEditorWindow.setWindowTitle(_translate("CitationEditorWindow", "Citation Editor", None))
        self.grp_Parameters.setTitle(_translate("CitationEditorWindow", "Citation Parameters", None))
        self.lbl_Fields.setText(_translate("CitationEditorWindow", "Field:", None))
        self.lbl_Record.setText(_translate("CitationEditorWindow", "Record:", None))
        self.btn_Add.setText(_translate("CitationEditorWindow", "Add", None))
        self.btn_Remove.setText(_translate("CitationEditorWindow", "Remove", None))
        self.btn_Generate.setText(_translate("CitationEditorWindow", "Add", None))
        self.btn_Preview.setText(_translate("CitationEditorWindow", "Preview", None))
        self.grp_Citation.setTitle(_translate("CitationEditorWindow", "Citation", None))


if __name__ == "__main__":
    import sys
    app = QtGui.QApplication(sys.argv)
    CitationEditorWindow = QtGui.QMainWindow()
    ui = Ui_CitationEditorWindow()
    ui.setupUi(CitationEditorWindow)
    CitationEditorWindow.show()
    sys.exit(app.exec_())
