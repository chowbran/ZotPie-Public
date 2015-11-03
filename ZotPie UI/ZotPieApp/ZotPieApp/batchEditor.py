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
        BatchEditorWindow.resize(696, 565)
        self.centralwidget = QtGui.QWidget(BatchEditorWindow)
        self.centralwidget.setObjectName(_fromUtf8("centralwidget"))
        self.gridLayout = QtGui.QGridLayout(self.centralwidget)
        self.gridLayout.setObjectName(_fromUtf8("gridLayout"))
        self.lbl_Filter = QtGui.QLabel(self.centralwidget)
        self.lbl_Filter.setAlignment(QtCore.Qt.AlignRight|QtCore.Qt.AlignTrailing|QtCore.Qt.AlignVCenter)
        self.lbl_Filter.setObjectName(_fromUtf8("lbl_Filter"))
        self.gridLayout.addWidget(self.lbl_Filter, 0, 1, 1, 1)
        self.txt_Filter = QtGui.QLineEdit(self.centralwidget)
        self.txt_Filter.setObjectName(_fromUtf8("txt_Filter"))
        self.gridLayout.addWidget(self.txt_Filter, 0, 2, 1, 1)
        self.horizontalLayout_2 = QtGui.QHBoxLayout()
        self.horizontalLayout_2.setObjectName(_fromUtf8("horizontalLayout_2"))
        self.progressBar = QtGui.QProgressBar(self.centralwidget)
        self.progressBar.setProperty("value", 0)
        self.progressBar.setObjectName(_fromUtf8("progressBar"))
        self.horizontalLayout_2.addWidget(self.progressBar)
        self.btn_Apply = QtGui.QPushButton(self.centralwidget)
        self.btn_Apply.setEnabled(True)
        self.btn_Apply.setObjectName(_fromUtf8("btn_Apply"))
        self.horizontalLayout_2.addWidget(self.btn_Apply)
        self.gridLayout.addLayout(self.horizontalLayout_2, 5, 1, 1, 2)
        self.grp_Parameters = QtGui.QGroupBox(self.centralwidget)
        self.grp_Parameters.setObjectName(_fromUtf8("grp_Parameters"))
        self.verticalLayout_5 = QtGui.QVBoxLayout(self.grp_Parameters)
        self.verticalLayout_5.setObjectName(_fromUtf8("verticalLayout_5"))
        self.horizontalLayout = QtGui.QHBoxLayout()
        self.horizontalLayout.setObjectName(_fromUtf8("horizontalLayout"))
        self.verticalLayout = QtGui.QVBoxLayout()
        self.verticalLayout.setObjectName(_fromUtf8("verticalLayout"))
        self.lbl_Type = QtGui.QLabel(self.grp_Parameters)
        self.lbl_Type.setObjectName(_fromUtf8("lbl_Type"))
        self.verticalLayout.addWidget(self.lbl_Type)
        self.combo_Type = QtGui.QComboBox(self.grp_Parameters)
        self.combo_Type.setObjectName(_fromUtf8("combo_Type"))
        self.combo_Type.addItem(_fromUtf8(""))
        self.verticalLayout.addWidget(self.combo_Type)
        self.horizontalLayout.addLayout(self.verticalLayout)
        self.verticalLayout_2 = QtGui.QVBoxLayout()
        self.verticalLayout_2.setObjectName(_fromUtf8("verticalLayout_2"))
        self.lbl_Action = QtGui.QLabel(self.grp_Parameters)
        self.lbl_Action.setObjectName(_fromUtf8("lbl_Action"))
        self.verticalLayout_2.addWidget(self.lbl_Action)
        self.combo_Modify = QtGui.QComboBox(self.grp_Parameters)
        self.combo_Modify.setObjectName(_fromUtf8("combo_Modify"))
        self.combo_Modify.addItem(_fromUtf8(""))
        self.combo_Modify.addItem(_fromUtf8(""))
        self.verticalLayout_2.addWidget(self.combo_Modify)
        self.horizontalLayout.addLayout(self.verticalLayout_2)
        self.verticalLayout_3 = QtGui.QVBoxLayout()
        self.verticalLayout_3.setObjectName(_fromUtf8("verticalLayout_3"))
        self.lbl_Scope = QtGui.QLabel(self.grp_Parameters)
        self.lbl_Scope.setObjectName(_fromUtf8("lbl_Scope"))
        self.verticalLayout_3.addWidget(self.lbl_Scope)
        self.combo_Scope = QtGui.QComboBox(self.grp_Parameters)
        self.combo_Scope.setObjectName(_fromUtf8("combo_Scope"))
        self.combo_Scope.addItem(_fromUtf8(""))
        self.combo_Scope.addItem(_fromUtf8(""))
        self.verticalLayout_3.addWidget(self.combo_Scope)
        self.horizontalLayout.addLayout(self.verticalLayout_3)
        self.verticalLayout_4 = QtGui.QVBoxLayout()
        self.verticalLayout_4.setObjectName(_fromUtf8("verticalLayout_4"))
        self.lbl_Collection = QtGui.QLabel(self.grp_Parameters)
        self.lbl_Collection.setEnabled(True)
        self.lbl_Collection.setObjectName(_fromUtf8("lbl_Collection"))
        self.verticalLayout_4.addWidget(self.lbl_Collection)
        self.combo_Collection = QtGui.QComboBox(self.grp_Parameters)
        self.combo_Collection.setEnabled(True)
        self.combo_Collection.setObjectName(_fromUtf8("combo_Collection"))
        self.verticalLayout_4.addWidget(self.combo_Collection)
        self.horizontalLayout.addLayout(self.verticalLayout_4)
        self.verticalLayout_5.addLayout(self.horizontalLayout)
        self.gridLayout.addWidget(self.grp_Parameters, 3, 1, 1, 2)
        self.lbl_Quaggan = QtGui.QLabel(self.centralwidget)
        self.lbl_Quaggan.setText(_fromUtf8(""))
        self.lbl_Quaggan.setPixmap(QtGui.QPixmap(_fromUtf8("Images/Box_quaggan_icon.png")))
        self.lbl_Quaggan.setObjectName(_fromUtf8("lbl_Quaggan"))
        self.gridLayout.addWidget(self.lbl_Quaggan, 2, 3, 2, 1)
        self.listWidget = QtGui.QListWidget(self.centralwidget)
        self.listWidget.setObjectName(_fromUtf8("listWidget"))
        self.gridLayout.addWidget(self.listWidget, 2, 1, 1, 2)
        self.txt_Replace = QtGui.QLineEdit(self.centralwidget)
        self.txt_Replace.setObjectName(_fromUtf8("txt_Replace"))
        self.gridLayout.addWidget(self.txt_Replace, 1, 2, 1, 1)
        self.lbl_Replace = QtGui.QLabel(self.centralwidget)
        self.lbl_Replace.setAlignment(QtCore.Qt.AlignRight|QtCore.Qt.AlignTrailing|QtCore.Qt.AlignVCenter)
        self.lbl_Replace.setObjectName(_fromUtf8("lbl_Replace"))
        self.gridLayout.addWidget(self.lbl_Replace, 1, 1, 1, 1)
        BatchEditorWindow.setCentralWidget(self.centralwidget)
        self.menubar = QtGui.QMenuBar(BatchEditorWindow)
        self.menubar.setGeometry(QtCore.QRect(0, 0, 696, 21))
        self.menubar.setObjectName(_fromUtf8("menubar"))
        BatchEditorWindow.setMenuBar(self.menubar)
        self.statusbar = QtGui.QStatusBar(BatchEditorWindow)
        self.statusbar.setObjectName(_fromUtf8("statusbar"))
        BatchEditorWindow.setStatusBar(self.statusbar)
        self.actionConfigure = QtGui.QAction(BatchEditorWindow)
        self.actionConfigure.setObjectName(_fromUtf8("actionConfigure"))

        self.retranslateUi(BatchEditorWindow)
        QtCore.QMetaObject.connectSlotsByName(BatchEditorWindow)

    def retranslateUi(self, BatchEditorWindow):
        BatchEditorWindow.setWindowTitle(_translate("BatchEditorWindow", "Tag Batch Editor", None))
        self.lbl_Filter.setText(_translate("BatchEditorWindow", "Find:", None))
        self.btn_Apply.setText(_translate("BatchEditorWindow", "Apply", None))
        self.grp_Parameters.setTitle(_translate("BatchEditorWindow", "Parameters", None))
        self.lbl_Type.setText(_translate("BatchEditorWindow", "Type:", None))
        self.combo_Type.setItemText(0, _translate("BatchEditorWindow", "Tag", None))
        self.lbl_Action.setText(_translate("BatchEditorWindow", "Action:", None))
        self.combo_Modify.setItemText(0, _translate("BatchEditorWindow", "Modify", None))
        self.combo_Modify.setItemText(1, _translate("BatchEditorWindow", "Remove", None))
        self.lbl_Scope.setText(_translate("BatchEditorWindow", "Scope:", None))
        self.combo_Scope.setItemText(0, _translate("BatchEditorWindow", "All", None))
        self.combo_Scope.setItemText(1, _translate("BatchEditorWindow", "Collection", None))
        self.lbl_Collection.setText(_translate("BatchEditorWindow", "Collection:", None))
        self.lbl_Replace.setText(_translate("BatchEditorWindow", "Replace:", None))
        self.actionConfigure.setText(_translate("BatchEditorWindow", "Configure...", None))


if __name__ == "__main__":
    import sys
    app = QtGui.QApplication(sys.argv)
    BatchEditorWindow = QtGui.QMainWindow()
    ui = Ui_BatchEditorWindow()
    ui.setupUi(BatchEditorWindow)
    BatchEditorWindow.show()
    sys.exit(app.exec_())

