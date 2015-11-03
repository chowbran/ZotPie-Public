import time
import re
import nltk
from PyQt4 import QtCore, QtGui
from batchEditor import Ui_BatchEditorWindow
from BEditor import BEditor
from nltk.metrics.distance import edit_distance
from nltk import stem,tokenize



class BatchEditorWin(QtGui.QMainWindow, Ui_BatchEditorWindow):   #or whatever Q*class it is
    
    def normalize(self, s):
        words = tokenize.wordpunct_tokenize(s.lower().strip())
        return ' '.join([self.stemmer.stem(w) for w in words])

    def fuzzy_match(self, s1, s2, max_dist=3):
        return edit_distance(self.normalize(s1), self.normalize(s2)) <= max_dist

    def __init__(self, parent=None):
        super(BatchEditorWin, self).__init__(parent)
        
        self.stemmer = nltk.stem.PorterStemmer()

        self.setupUi(self)
        self.editor = BEditor('2710002', 'user', 'jxIEnHTfXW5guwz6X8q5upsv')

        # store tags in a list
        self.tags = self.editor.getTags()
        self.changeSet = set() #self.tags
        self.list_Tags.addItems(list(self.tags))

        # Populate the collection drop down menu
        tags = self.editor.getTags()
        collections = self.editor.get_collections()
        names = [coll.values()[0] for coll in collections]
        self.combo_Collection.addItems(names)
        self.combo_Collection.setEnabled(False)

        self.eventHandlerSetup()
        self.quagganIn = QtGui.QPixmap('Images/Box_quaggan_icon.png')
        self.quagganOut = QtGui.QPixmap('Images/120px-Box_quaggan_icon_2.png')
    
    def eventHandlerSetup(self):
        self.btn_Apply.clicked.connect(self.btnApplyHandler)

        self.combo_Scope.currentIndexChanged.connect(lambda x: 
            self.combo_Collection.setEnabled(x != 0))

        # Handles the txt_Filter textEdited event
        self.txt_Filter.textEdited.connect(self.textFilterEditedHandler)

        # Handlers for button clicks to add/remove to the change list
        self.btn_Add.clicked.connect(self.addChange)
        self.btn_Remove.clicked.connect(self.removeChange)


        self.combo_Modify.currentIndexChanged.connect(self._hideNewFields)


    def addChange(self):
        toChange = []

        selected = self.list_Tags.selectedItems()
        selectdRows = [self.list_Tags.row(selectedItem) for selectedItem in selected]

        for row in selectdRows:
            toChange += [self.list_Tags.takeItem(row)]

        toChangeStr = [str(row.text()) for row in toChange]

        self.changeSet = self.changeSet.union(set(toChangeStr))

        self.list_ChangeTags.addItems(toChangeStr)

    def removeChange(self):
        toNoChange = []

        selected = self.list_ChangeTags.selectedItems()
        selectdRows = [self.list_ChangeTags.row(selectedItem) for selectedItem in selected]

        for row in selectdRows:
            toNoChange += [self.list_ChangeTags.takeItem(row)]

        toNoChangeStr = [str(row.text()) for row in toNoChange]

        self.changeSet = self.changeSet.difference(set(toNoChangeStr))

        print str(self.changeSet)


        self.list_Tags.addItems(toNoChangeStr)

    def textFilterEditedHandler(self):
        search = self.txt_Filter.text()

        tagList = list(self.tags)
        
        # Remove the ones already selected
        tagList[:] = [tag for tag in tagList if tag not in self.changeSet]

        if str(search).strip() == '':
            result = tagList
        else:
            result = filter(lambda x: self.fuzzy_match(str(search), str(x)), tagList)

        self.list_Tags.clear()
        self.list_Tags.addItems(result)

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

        old_value = self.txt_OldValue.text().trimmed()
        new_value = self.txt_NewValue.text().trimmed()

        if (old_value == '' or new_value == ''):
            QtGui.QMessageBox.warning(self, "Error", "Values cannot be empty.")
            return

        record_type = self.combo_Type.itemText(type_index)
        action = self.combo_Modify.itemText(action_index)
        scope = self.combo_Scope.itemText(scope_index)

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
           
        self.lbl_Quaggan.setPixmap(self.quagganOut);
        QtGui.QMessageBox.information(self, actionStr, modStr)
