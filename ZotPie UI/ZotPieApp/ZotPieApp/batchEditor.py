# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'batchEditor.ui'
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

class Ui_BatchEditorWindow(object):
    def setupUi(self, BatchEditorWindow):
        BatchEditorWindow.setObjectName(_fromUtf8("BatchEditorWindow"))
        BatchEditorWindow.resize(427, 265)
        self.centralwidget = QtGui.QWidget(BatchEditorWindow)
        self.centralwidget.setObjectName(_fromUtf8("centralwidget"))
        self.grp_Parameters = QtGui.QGroupBox(self.centralwidget)
        self.grp_Parameters.setGeometry(QtCore.QRect(30, 20, 171, 191))
        self.grp_Parameters.setObjectName(_fromUtf8("grp_Parameters"))
        self.combo_Type = QtGui.QComboBox(self.grp_Parameters)
        self.combo_Type.setGeometry(QtCore.QRect(70, 30, 71, 22))
        self.combo_Type.setObjectName(_fromUtf8("combo_Type"))
        self.combo_Type.addItem(_fromUtf8(""))
        self.combo_Modify = QtGui.QComboBox(self.grp_Parameters)
        self.combo_Modify.setGeometry(QtCore.QRect(70, 80, 71, 22))
        self.combo_Modify.setObjectName(_fromUtf8("combo_Modify"))
        self.combo_Modify.addItem(_fromUtf8(""))
        self.combo_Modify.addItem(_fromUtf8(""))
        self.combo_Scope = QtGui.QComboBox(self.grp_Parameters)
        self.combo_Scope.setGeometry(QtCore.QRect(70, 130, 71, 22))
        self.combo_Scope.setObjectName(_fromUtf8("combo_Scope"))
        self.combo_Scope.addItem(_fromUtf8(""))
        self.combo_Scope.addItem(_fromUtf8(""))
        self.lbl_Type = QtGui.QLabel(self.grp_Parameters)
        self.lbl_Type.setGeometry(QtCore.QRect(30, 30, 31, 16))
        self.lbl_Type.setObjectName(_fromUtf8("lbl_Type"))
        self.lbl_Action = QtGui.QLabel(self.grp_Parameters)
        self.lbl_Action.setGeometry(QtCore.QRect(30, 80, 41, 16))
        self.lbl_Action.setObjectName(_fromUtf8("lbl_Action"))
        self.lbl_Scope = QtGui.QLabel(self.grp_Parameters)
        self.lbl_Scope.setGeometry(QtCore.QRect(30, 130, 41, 16))
        self.lbl_Scope.setObjectName(_fromUtf8("lbl_Scope"))
        self.txt_OldValue = QtGui.QLineEdit(self.centralwidget)
        self.txt_OldValue.setGeometry(QtCore.QRect(285, 70, 113, 20))
        self.txt_OldValue.setObjectName(_fromUtf8("txt_OldValue"))
        self.lbl_Old = QtGui.QLabel(self.centralwidget)
        self.lbl_Old.setGeometry(QtCore.QRect(235, 70, 46, 13))
        self.lbl_Old.setObjectName(_fromUtf8("lbl_Old"))
        self.txt_NewValue = QtGui.QLineEdit(self.centralwidget)
        self.txt_NewValue.setGeometry(QtCore.QRect(285, 110, 113, 20))
        self.txt_NewValue.setObjectName(_fromUtf8("txt_NewValue"))
        self.lbl_New = QtGui.QLabel(self.centralwidget)
        self.lbl_New.setGeometry(QtCore.QRect(230, 110, 51, 20))
        self.lbl_New.setObjectName(_fromUtf8("lbl_New"))
        self.btn_Apply = QtGui.QPushButton(self.centralwidget)
        self.btn_Apply.setGeometry(QtCore.QRect(320, 140, 75, 23))
        self.btn_Apply.setObjectName(_fromUtf8("btn_Apply"))
        BatchEditorWindow.setCentralWidget(self.centralwidget)
        self.menubar = QtGui.QMenuBar(BatchEditorWindow)
        self.menubar.setGeometry(QtCore.QRect(0, 0, 427, 21))
        self.menubar.setObjectName(_fromUtf8("menubar"))
        self.menu_Settings = QtGui.QMenu(self.menubar)
        self.menu_Settings.setObjectName(_fromUtf8("menu_Settings"))
        BatchEditorWindow.setMenuBar(self.menubar)
        self.statusbar = QtGui.QStatusBar(BatchEditorWindow)
        self.statusbar.setObjectName(_fromUtf8("statusbar"))
        BatchEditorWindow.setStatusBar(self.statusbar)
        self.actionConfigure = QtGui.QAction(BatchEditorWindow)
        self.actionConfigure.setObjectName(_fromUtf8("actionConfigure"))
        self.menu_Settings.addAction(self.actionConfigure)
        self.menubar.addAction(self.menu_Settings.menuAction())

        self.retranslateUi(BatchEditorWindow)
        QtCore.QMetaObject.connectSlotsByName(BatchEditorWindow)

    def retranslateUi(self, BatchEditorWindow):
        BatchEditorWindow.setWindowTitle(_translate("BatchEditorWindow", "Batch Editor", None))
        self.grp_Parameters.setTitle(_translate("BatchEditorWindow", "Parameters", None))
        self.combo_Type.setItemText(0, _translate("BatchEditorWindow", "Tag", None))
        self.combo_Modify.setItemText(0, _translate("BatchEditorWindow", "Modify", None))
        self.combo_Modify.setItemText(1, _translate("BatchEditorWindow", "Remove", None))
        self.combo_Scope.setItemText(0, _translate("BatchEditorWindow", "All", None))
        self.combo_Scope.setItemText(1, _translate("BatchEditorWindow", "Collection", None))
        self.lbl_Type.setText(_translate("BatchEditorWindow", "Type:", None))
        self.lbl_Action.setText(_translate("BatchEditorWindow", "Action:", None))
        self.lbl_Scope.setText(_translate("BatchEditorWindow", "Scope:", None))
        self.lbl_Old.setText(_translate("BatchEditorWindow", "Old Value:", None))
        self.lbl_New.setText(_translate("BatchEditorWindow", "New Value:", None))
        self.btn_Apply.setText(_translate("BatchEditorWindow", "Apply", None))
        self.menu_Settings.setTitle(_translate("BatchEditorWindow", "&Settings", None))
        self.actionConfigure.setText(_translate("BatchEditorWindow", "Configure...", None))


if __name__ == "__main__":
    import sys
    app = QtGui.QApplication(sys.argv)
    BatchEditorWindow = QtGui.QMainWindow()
    ui = Ui_BatchEditorWindow()
    ui.setupUi(BatchEditorWindow)
    BatchEditorWindow.show()
    sys.exit(app.exec_())

