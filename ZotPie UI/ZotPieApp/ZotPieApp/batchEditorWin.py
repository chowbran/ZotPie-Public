import time
import re
import nltk
from PyQt4 import QtCore, QtGui
from batchEditor import Ui_BatchEditorWindow
from BEditor import BEditor
from nltk.metrics.distance import edit_distance
from nltk import stem,tokenize



class BatchEditorWin(QtGui.QMainWindow, Ui_BatchEditorWindow):   #or whatever Q*class it is

    def __init__(self, parent=None):
        super(BatchEditorWin, self).__init__(parent)
        
        self.stemmer = nltk.stem.PorterStemmer()

        self.setupUi(self)
        self.editor = BEditor('2710002', 'user', 'jxIEnHTfXW5guwz6X8q5upsv')

        # Populate the collection drop down menu
        collections = self.editor.get_collections()
        names = [coll.values()[0] for coll in collections]
        self.combo_Collection.addItems(names)
        self.combo_Collection.setEnabled(False)

        self.eventHandlerSetup()
        self.quagganIn = QtGui.QPixmap('Images/Box_quaggan_icon.png')
        self.quagganOut = QtGui.QPixmap('Images/120px-Box_quaggan_icon_2.png')

    def normalize(self, s):
        words = tokenize.wordpunct_tokenize(s.lower().strip())
        return ' '.join([self.stemmer.stem(w) for w in words])

    def fuzzy_match(self, s1, s2, max_dist=3):
        return edit_distance(self.normalize(s1), self.normalize(s2)) <= max_dist
    
    def eventHandlerSetup(self):
        self.tagSet = self.editor.getTags()
        self.changeSet = set()

        self.btn_Apply.clicked.connect(self.btnApplyHandler)

        self.combo_Scope.currentIndexChanged.connect(lambda x: 
            self.changeScope("") if x == 0 else 
                self.changeScope(str(self.combo_Collection.itemText(self.combo_Collection.currentIndex()))))
        
        self.combo_Collection.currentIndexChanged.connect(lambda x:
            self.changeScope(str(self.combo_Collection.itemText(x))))

        # Handles the txt_Filter textEdited event
        self.txt_Filter.textEdited.connect(self.textFilterEditedHandler)

        # Handlers for button clicks to add/remove to the change list
        self.btn_Add.clicked.connect(self.addChange)
        self.btn_Remove.clicked.connect(self.removeChange)

        self.combo_Modify.currentIndexChanged.connect(self._hideNewFields)

    def changeScope(self, collection):
        if collection == "":
            self.combo_Collection.setEnabled(False)
            # Use all scope
            self.tagSet = self.editor.getTags()
            self.changeSet = set()
            self.refreshListWidgets()
            return

        self.combo_Collection.setEnabled(True)

        self.tagSet = self.editor.getTagsFromCollection(collection)
    
        self.changeSet = set()

        self.refreshListWidgets()


    def addChange(self):
        toChange = []
        toChangeStr = []

        selected = self.list_Tags.selectedItems()

        for selectedItem in selected:
            self.list_Tags.removeItemWidget(selectedItem)
            self.list_ChangeTags.addItem(selectedItem)

        toChangeStr = [str(row.text()) for row in selected]

        self.changeSet = self.changeSet | set(toChangeStr)

        self.refreshListWidgets()

    def removeChange(self):
        toNoChange = []
        toNoChangeStr = []

        selected = self.list_ChangeTags.selectedItems()

        for selectedItem in selected:
            self.list_ChangeTags.removeItemWidget(selectedItem)
            self.list_Tags.addItem(selectedItem)

        toNoChangeStr = [str(row.text()) for row in selected]
        self.changeSet = self.changeSet - set(toNoChangeStr)

        self.refreshListWidgets()

    def refreshListWidgets(self):
        self.list_ChangeTags.clear()

        changes = list(self.changeSet)
        changes.sort()
        self.list_ChangeTags.addItems(changes)

        self.textFilterEditedHandler()


    def textFilterEditedHandler(self):
        search = self.txt_Filter.text()

        tagList = list(self.tagSet)
        
        # Remove the ones already selected
        tagList[:] = [tag for tag in tagList if tag not in self.changeSet]

        result = []
        if not str(search).strip() == '':
            result = filter(lambda x: self.fuzzy_match(str(search), str(x)), tagList)

        result.sort()

        self.list_Tags.clear()
        self.list_Tags.addItems(result)


    def _hideNewFields(self, selIndex):
        ''' (BatchEditorWin, bool) -> None
            Hides unnecessary fields
        '''

        self.lbl_Replace.setEnabled(selIndex != 1)
        self.txt_Replace.setEnabled(selIndex != 1)


    def btnApplyHandler(self):
        self.progressBar.setValue(0)
        
        # Get the index of the selected modify option
        type_index = self.combo_Type.currentIndex()
        action_index = self.combo_Modify.currentIndex()
        scope_index = self.combo_Scope.currentIndex()

        # old_value = self.txt_OldValue.text().trimmed()
        new_value = self.txt_Replace.text().trimmed()

        record_type = self.combo_Type.itemText(type_index)
        action = self.combo_Modify.itemText(action_index)
        scope = self.combo_Scope.itemText(scope_index)

        if (new_value == '' and action != 'Remove'):
            QtGui.QMessageBox.warning(self, "Error", "Values cannot be empty.")
            return

        coll = self.combo_Collection.itemText(self.combo_Collection.currentIndex())
        reply = QtGui.QMessageBox.question(self, 'Confirmation',
            "Are you sure you want to " + action.toLower() + " these tags from " + ("all collections" if scope=="All" else coll) + "?", QtGui.QMessageBox.Yes | 
            QtGui.QMessageBox.No)

        if (reply == QtGui.QMessageBox.No):
            return

        self.progressBar.setValue(10)
        self.lbl_Quaggan.setPixmap(self.quagganIn)
        coll = self.combo_Collection.itemText(
                    self.combo_Collection.currentIndex())

        if action == "Modify":
            if scope == "All":
                self.editor.editBatchTags(self.changeSet, str(new_value))
            elif scope == "Collection":
                self.editor.editBatchTags(self.changeSet, str(new_value), str(new_value))
        elif action == "Remove":
            if scope == "All":
                self.editor.deleteBatchTags(self.changeSet)
                # self.editor.delete_tag(str(old_value))
            elif scope == "Collection":
                self.editor.deleteBatchTags(self.changeSet, str(coll))
                # self.editor.delete_tag_collection(str(coll), str(old_value))

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
            modStr = "{0} tag(s): {1} to {2} from {3}.".format(actionStr, str(self.changeSet), str(new_value), modifiedCollection)
        else:
            actionStr = "Removed"
            modStr = "{0} tag(s): {1} from {3}.".format(actionStr, str(self.changeSet), str(new_value), modifiedCollection)
           
        self.lbl_Quaggan.setPixmap(self.quagganOut);
        QtGui.QMessageBox.information(self, actionStr, modStr)


        self.tagSet = (self.tagSet - self.changeSet) 
        print self.tagSet
        self.tagSet = self.tagSet | set([str(new_value)])
        print self.tagSet
        self.changeSet = set()
        self.refreshListWidgets()