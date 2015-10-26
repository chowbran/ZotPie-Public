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
        self.combo_Modify.currentIndexChanged.connect(self._hideNewFields)
        collections = self.editor.get_collections()
        names = [coll.values()[0] for coll in collections]
        self.combo_Collection.addItem("All")
        self.combo_Collection.addItems(names)

    def _hideNewFields(self, selIndex):
        ''' (BatchEditorWin, bool) -> None
            Hides unnecessary fields
        '''

        self.lbl_New.setEnabled(selIndex != 1)
        self.txt_NewValue.setEnabled(selIndex != 1)

    def btnApplyHandler(self):
        # Get the index of the selected modify option
        type_index = self.combo_Type.currentIndex()
        modify_index = self.combo_Modify.currentIndex()
        scope_index = self.combo_Scope.currentIndex()

        old_value = self.txt_OldValue.text()
        new_value = self.txt_NewValue.text()

        record_type = self.combo_Type.itemText(type_index)
        action = self.combo_Modify.itemText(modify_index)
        scope = self.combo_Scope.itemText(scope_index)

        if action == "Modify":
        	if scope == "All":
        		self.editor.batch_edit(str(old_value), str(new_value))
        		print "modified"
        elif action == "Remove":
            if scope == "All":
                self.editor.delete_tag(str(old_value))
                print "removed"


