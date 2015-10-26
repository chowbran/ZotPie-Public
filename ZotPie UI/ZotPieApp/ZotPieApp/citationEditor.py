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
        CitationEditorWindow.resize(720, 414)
        self.centralwidget = QtGui.QWidget(CitationEditorWindow)
        self.centralwidget.setObjectName(_fromUtf8("centralwidget"))
        self.verticalLayout_3 = QtGui.QVBoxLayout(self.centralwidget)
        self.verticalLayout_3.setObjectName(_fromUtf8("verticalLayout_3"))
        self.verticalLayout_5 = QtGui.QVBoxLayout()
        self.verticalLayout_5.setObjectName(_fromUtf8("verticalLayout_5"))
        self.grp_Citation = QtGui.QGroupBox(self.centralwidget)
        self.grp_Citation.setObjectName(_fromUtf8("grp_Citation"))
        self.verticalLayout_7 = QtGui.QVBoxLayout(self.grp_Citation)
        self.verticalLayout_7.setObjectName(_fromUtf8("verticalLayout_7"))
        spacerItem = QtGui.QSpacerItem(20, 144, QtGui.QSizePolicy.Minimum, QtGui.QSizePolicy.Fixed)
        self.verticalLayout_7.addItem(spacerItem)
        self.verticalLayout_5.addWidget(self.grp_Citation)
        self.verticalLayout_3.addLayout(self.verticalLayout_5)
        self.verticalLayout_6 = QtGui.QVBoxLayout()
        self.verticalLayout_6.setObjectName(_fromUtf8("verticalLayout_6"))
        self.grp_Parameters = QtGui.QGroupBox(self.centralwidget)
        self.grp_Parameters.setObjectName(_fromUtf8("grp_Parameters"))
        self.verticalLayout_4 = QtGui.QVBoxLayout(self.grp_Parameters)
        self.verticalLayout_4.setObjectName(_fromUtf8("verticalLayout_4"))
        self.horizontalLayout = QtGui.QHBoxLayout()
        self.horizontalLayout.setObjectName(_fromUtf8("horizontalLayout"))
        self.verticalLayout = QtGui.QVBoxLayout()
        self.verticalLayout.setObjectName(_fromUtf8("verticalLayout"))
        self.lbl_Record = QtGui.QLabel(self.grp_Parameters)
        self.lbl_Record.setObjectName(_fromUtf8("lbl_Record"))
        self.verticalLayout.addWidget(self.lbl_Record)
        self.combo_Record = QtGui.QComboBox(self.grp_Parameters)
        self.combo_Record.setObjectName(_fromUtf8("combo_Record"))
        self.verticalLayout.addWidget(self.combo_Record)
        self.horizontalLayout.addLayout(self.verticalLayout)
        self.verticalLayout_2 = QtGui.QVBoxLayout()
        self.verticalLayout_2.setObjectName(_fromUtf8("verticalLayout_2"))
        self.lbl_Fields = QtGui.QLabel(self.grp_Parameters)
        self.lbl_Fields.setObjectName(_fromUtf8("lbl_Fields"))
        self.verticalLayout_2.addWidget(self.lbl_Fields)
        self.combo_Fields = QtGui.QComboBox(self.grp_Parameters)
        self.combo_Fields.setObjectName(_fromUtf8("combo_Fields"))
        self.verticalLayout_2.addWidget(self.combo_Fields)
        self.horizontalLayout.addLayout(self.verticalLayout_2)
        self.verticalLayout_4.addLayout(self.horizontalLayout)
        self.btn_Add = QtGui.QPushButton(self.grp_Parameters)
        self.btn_Add.setObjectName(_fromUtf8("btn_Add"))
        self.verticalLayout_4.addWidget(self.btn_Add)
        self.btn_Remove = QtGui.QPushButton(self.grp_Parameters)
        self.btn_Remove.setObjectName(_fromUtf8("btn_Remove"))
        self.verticalLayout_4.addWidget(self.btn_Remove)
        self.verticalLayout_6.addWidget(self.grp_Parameters)
        self.verticalLayout_3.addLayout(self.verticalLayout_6)
        self.horizontalLayout_2 = QtGui.QHBoxLayout()
        self.horizontalLayout_2.setContentsMargins(-1, 0, -1, 0)
        self.horizontalLayout_2.setObjectName(_fromUtf8("horizontalLayout_2"))
        self.btn_Load = QtGui.QPushButton(self.centralwidget)
        self.btn_Load.setObjectName(_fromUtf8("btn_Load"))
        self.horizontalLayout_2.addWidget(self.btn_Load)
        spacerItem1 = QtGui.QSpacerItem(40, 20, QtGui.QSizePolicy.Expanding, QtGui.QSizePolicy.Minimum)
        self.horizontalLayout_2.addItem(spacerItem1)
        self.btn_Generate = QtGui.QPushButton(self.centralwidget)
        self.btn_Generate.setObjectName(_fromUtf8("btn_Generate"))
        self.horizontalLayout_2.addWidget(self.btn_Generate)
        self.verticalLayout_3.addLayout(self.horizontalLayout_2)
        CitationEditorWindow.setCentralWidget(self.centralwidget)
        self.menubar = QtGui.QMenuBar(CitationEditorWindow)
        self.menubar.setGeometry(QtCore.QRect(0, 0, 720, 21))
        self.menubar.setObjectName(_fromUtf8("menubar"))
        CitationEditorWindow.setMenuBar(self.menubar)
        self.statusbar = QtGui.QStatusBar(CitationEditorWindow)
        self.statusbar.setObjectName(_fromUtf8("statusbar"))
        CitationEditorWindow.setStatusBar(self.statusbar)

        self.retranslateUi(CitationEditorWindow)
        QtCore.QMetaObject.connectSlotsByName(CitationEditorWindow)

    def retranslateUi(self, CitationEditorWindow):
        CitationEditorWindow.setWindowTitle(_translate("CitationEditorWindow", "Citation Editor", None))
        self.grp_Citation.setTitle(_translate("CitationEditorWindow", "Citation Preview", None))
        self.grp_Parameters.setTitle(_translate("CitationEditorWindow", "Citation Parameters", None))
        self.lbl_Record.setText(_translate("CitationEditorWindow", "Record:", None))
        self.lbl_Fields.setText(_translate("CitationEditorWindow", "Field:", None))
        self.btn_Add.setText(_translate("CitationEditorWindow", "Add", None))
        self.btn_Remove.setText(_translate("CitationEditorWindow", "Remove", None))
        self.btn_Load.setText(_translate("CitationEditorWindow", "Load", None))
        self.btn_Generate.setText(_translate("CitationEditorWindow", "Generate", None))


if __name__ == "__main__":
    import sys
    app = QtGui.QApplication(sys.argv)
    CitationEditorWindow = QtGui.QMainWindow()
    ui = Ui_CitationEditorWindow()
    ui.setupUi(CitationEditorWindow)
    CitationEditorWindow.show()
    sys.exit(app.exec_())

