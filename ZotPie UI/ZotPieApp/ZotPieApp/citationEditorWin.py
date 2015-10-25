from PyQt4 import QtCore, QtGui
from citationEditor import Ui_CitationEditorWindow
from pyzotero import zotero

zot = zotero.Zotero('2720485', 'user', 'amxUEQbOcgQShX0Xd0zuQDvR')
records = []
recordFields = []

class CitationEditorWin(QtGui.QMainWindow, Ui_CitationEditorWindow):
    fselected = ''
    selected = None
    fieldX = 140
    fieldY = 70

    def __init__(self, parent=None):
        super(CitationEditorWin, self).__init__(parent)
        self.setupUi(self)
        self.eventHandlerSetup()
        self.fItems = []
        self.fselected = self.combo_Fields.currentText()
       # self.getRecords()
        self.populateRecords()

    def eventHandlerSetup(self):
        self.btn_Add.clicked.connect(self.addField)
        self.btn_Remove.clicked.connect(self.removeField)
        self.btn_Generate.clicked.connect(self.generate)
        self.btn_Preview.clicked.connect(self.preview)
        self.combo_Record.currentIndexChanged.connect(self.populateFields)
        self.combo_Fields.currentIndexChanged.connect(self.field_change)
    

    def getRecords(self):
        records = zot.item_types()
        recordFields = zot.item_fields()

    def populateRecords(self):
        for item in zot.item_types():
            self.combo_Record.addItem(item['localized'])
            records.append(item['itemType'])

    def populateFields(self):
        self.combo_Fields.clear()
        for item in zot.item_type_fields(records[self.combo_Record.currentIndex()]):
            self.combo_Fields.addItem(item['localized'])

    '''
    This function will add a button to the "label". The button's text will be the given field.
    '''
    def addField(self):
        entry = QtGui.QPushButton(self)
        entry.setText(str(self.fselected))
        entry.setFixedSize(80, 30)
        entry.setStyleSheet("font-size:15px;background-color:#00CCFF;border: 2px solid #222222")
        entry.clicked.connect(lambda: self.selectField(entry))
        #entry.setAutoFillBackground(True)
        entry.move(self.fieldX, self.fieldY)
        self.fieldX += 85
        
        if (self.fieldX > 600):
            self.fieldX = 140
            self.fieldY += 20

        entry.show()

        self.fItems.append(entry)
    
    '''
    This function will remove the selected button on the label.
    '''
    def removeField(self):
        if (self.selected == None):
            return

        for field in self.fItems:
            if (field == self.selected):
                self.fItems.remove(field)
                field.setParent(None)
    '''
    This function will show us what the citation style will look like with default values.
    '''
    def preview(self):
        pass
    '''
    This function will indicate when a new record is selected. This will create a new collection of fields depending on
    the type of record.
    '''
    def record_change(self):
        pass

    '''
    This function will indicate when a new field is selected.
    '''
    def field_change(self):
        self.fselected = self.combo_Fields.currentText()
    '''
    This function will create the citiation style.
    '''
    def generate(self):
        pass

    '''
    This function will choose the selected label
    '''
    def selectField(self, entry=None):
        if (self.selected != None):
            self.selected.setStyleSheet("font-size:15px;background-color:#00CCFF;border: 2px solid #222222")

        self.selected = entry
        entry.setStyleSheet("font-size:15px;background-color:#FFFF66;border: 2px solid #222222")



