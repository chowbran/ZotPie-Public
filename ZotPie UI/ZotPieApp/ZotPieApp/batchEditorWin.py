﻿import time
from PyQt4 import QtCore, QtGui
from batchEditor import Ui_BatchEditorWindow
from BEditor import BEditor

class BatchEditorWin(QtGui.QMainWindow, Ui_BatchEditorWindow):   #or whatever Q*class it is
    def __init__(self, parent=None):
        super(BatchEditorWin, self).__init__(parent)
        self.setupUi(self)
        self.editor = BEditor('2710002', 'user', 'jxIEnHTfXW5guwz6X8q5upsv')
        self.eventHandlerSetup()
    
    def eventHandlerSetup(self):
        self.btn_Apply.clicked.connect(self.btnApplyHandler)

        self.combo_Scope.currentIndexChanged.connect(lambda x: 
            self.combo_Collection.setEnabled(x != 0))

        self.combo_Modify.currentIndexChanged.connect(self._hideNewFields)
        collections = self.editor.get_collections()
        names = [coll.values()[0] for coll in collections]
        self.combo_Collection.addItems(names)

    def _hideNewFields(self, selIndex):
        ''' (BatchEditorWin, bool) -> None
            Hides unnecessary fields
        '''

        self.lbl_New.setEnabled(selIndex != 1)
        self.txt_NewValue.setEnabled(selIndex != 1)

    def btnApplyHandler(self):
        self.progressBar.setValue(0)
        
        # Get the index of the selected modify option
        type_index = self.combo_Type.currentIndex()
        action_index = self.combo_Modify.currentIndex()
        scope_index = self.combo_Scope.currentIndex()

        old_value = self.txt_OldValue.text()
        new_value = self.txt_NewValue.text()

        record_type = self.combo_Type.itemText(type_index)
        action = self.combo_Modify.itemText(action_index)
        scope = self.combo_Scope.itemText(scope_index)

        coll = self.combo_Collection.itemText(self.combo_Collection.currentIndex())
        reply = QtGui.QMessageBox.question(self, 'Confirmation',
            "Are you sure you want to " + action.toLower() + " these tags from " + ("all collections" if scope=="All" else coll) + "?", QtGui.QMessageBox.Yes | 
            QtGui.QMessageBox.No)

        self.progressBar.setValue(10)

        if reply == QtGui.QMessageBox.No:
            return

        coll = self.combo_Collection.itemText(
                    self.combo_Collection.currentIndex())

        if action == "Modify":
            if scope == "All":
                self.editor.batch_edit_tag(str(old_value), str(new_value))
            elif scope == "Collection":
                self.editor.batch_edit_tag_collection(str(coll), str(old_value), str(new_value))
        elif action == "Remove":
            if scope == "All":
                self.editor.delete_tag(str(old_value))
            elif scope == "Collection":
                self.editor.delete_tag_collection(str(coll), str(old_value))


        for i in range(0,6):
            self.progressBar.setValue(self.progressBar.value() + 10)
            time.sleep(.2)

        self.progressBar.setValue(100)

        if scope == "Collection":
            modifiedCollection = coll
        else:
            modifiedCollection = "all collections"

        if action == "Modify":
            actionStr = "Modified"
            modStr = "{0} tag(s): {1} to {2} from {3}.".format(actionStr, str(old_value), str(new_value), modifiedCollection)
        else:
            actionStr = "Removed"
            modStr = "{0} tag(s): {1} from {3}.".format(actionStr, str(old_value), str(new_value), modifiedCollection)

        QtGui.QMessageBox.information(self, actionStr, modStr)
