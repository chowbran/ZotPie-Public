from PyQt4 import QtCore, QtGui
from citationEditor import Ui_CitationEditorWindow

class CitationEditorWin(QtGui.QMainWindow, Ui_CitationEditorWindow):
    fselected = ''
    selected = ''
    x = 140
    y = 70
    def __init__(self, parent=None):
        super(CitationEditorWin, self).__init__(parent)
        self.setupUi(self)
        self.eventHandlerSetup()
        self.Items = []
        self.fselected = self.combo_Fields.currentText()

    def eventHandlerSetup(self):
        self.btn_Add.clicked.connect(self.add)
        self.btn_Remove.clicked.connect(self.remove)
        self.btn_Generate.clicked.connect(self.generate)
        self.btn_Preview.clicked.connect(self.preview)
        self.combo_Record.currentIndexChanged.connect(self.record_change)
        self.combo_Fields.currentIndexChanged.connect(self.field_change)
    '''
    This function will add a button to t    he "label". The button's text will be the given field.
    '''
    def add(self):
        b = QtGui.QLabel(self)
        b.setText(str(self.fselected))
        b.mousePressEvent = self.select(b)
        b.setAutoFillBackground(True)
        b.move(self.x,self.y)
        self.x=self.x +50
        if (self.x > 600):
            self.x = 140
            self.y = self.y + 20

        b.show()
        self.Items.append(b)

    '''
    This function will remove the selected button on the label.
    '''
    def remove(self):
        pass
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
        self.fselected = self.combo_Fields.currentIndex()
    '''
    This function will create the citiation style.
    '''
    def generate(self):
        pass

    '''
    This function will choose the selected label
    '''
    def select(self,b=None):
        self.selected = b.text



