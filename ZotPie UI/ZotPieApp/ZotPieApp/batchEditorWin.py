from PyQt4 import QtCore, QtGui
from batchEditor import Ui_BatchEditorWindow
from batchConfig import BatchConfig


class BatchEditorWin(QtGui.QMainWindow, Ui_BatchEditorWindow):   #or whatever Q*class it is
    def __init__(self, parent=None):
        super(BatchEditorWin, self).__init__(parent)
        self.setupUi(self)
        self.eventHandlerSetup()
        self.config = BatchConfig()
    
    def eventHandlerSetup(self):
        self.btn_Apply.clicked.connect(self.btnApplyHandler)

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

        # print record_type
        # print action
        # print scope
        # print old_value
        # print new_value

        if action == "Modify":
        	if scope == "All":
        		self.config.batch_editor(str(old_value), str(new_value))
        		print "hello"
