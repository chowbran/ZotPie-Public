from PyQt4 import QtCore, QtGui
from citationEditor import Ui_CitationEditorWindow
from pyzotero import zotero
from xmleditor import xmlpython
from cslmapping import Map
import os
import shutil


zot = zotero.Zotero('2720485', 'user', 'amxUEQbOcgQShX0Xd0zuQDvR')

records = []
recordFields = []

class CitationEditorWin(QtGui.QMainWindow, Ui_CitationEditorWindow):
    fselected = ''
    selected = None
    fieldX = 25
    fieldY = 70
    File = None
    Form = 'citation'
    FileName = None

    def __init__(self, parent=None):
        super(CitationEditorWin, self).__init__(parent)
        self.map = Map()
        self.setupUi(self)
        self.eventHandlerSetup()
        self.fItems = []
        self.Labels = []
        self.fselected = self.combo_Fields.currentText()
       # self.getRecords()
        self.populateRecords()
        self.btn_Add.setEnabled(False)

    def eventHandlerSetup(self):
        self.btn_Add.clicked.connect(self.addField)
        self.btn_Load.clicked.connect(self.LoadField)
        self.btn_Remove.clicked.connect(self.removeField)
        self.btn_Generate.clicked.connect(self.generate)
        self.combo_Record.currentIndexChanged.connect(self.populateFields)
        self.combo_Fields.currentIndexChanged.connect(self.field_change)
    

    def getRecords(self):
        records = zot.item_types()
        recordFields = zot.item_fields()

    def populateRecords(self):
        self.combo_Record.addItem("--Select Record--")
        for item in zot.item_types():
            self.combo_Record.addItem(item['localized'])
            records.append(item['itemType'])

    def populateFields(self):
        self.combo_Fields.clear()
        if (len(records) > 0):
            for item in zot.item_type_fields(records[self.combo_Record.currentIndex() - 1]):
                self.combo_Fields.addItem(item['localized'])

    '''
    This function will add a button to the "label". The button's text will be the given field.
    '''
    def addField(self):
        if (self.fieldY > 140):
            return
        else:
            entry = QtGui.QPushButton(self)
            if '-' in str(self.fselected):
                text = str(self.fselected)[str(self.fselected).find('=') + 1:len(str(self.fselected))]
                #text = self.map.CtoZ(text)
                entry.setText(text)
                self.Labels.append(str(self.fselected))
            else:
                text = str(self.fselected)[str(self.fselected).find('=') + 2:len(str(self.fselected))-1]
                text = self.map.CtoZ(text)
                if text:
                    self.Labels.append(str(self.fselected))
                    entry.setText(text)
                else:
                    self.Labels.append('text variable="' + str(self.map.ZtoC(str(self.fselected)) + '"'))
                    entry.setText(str(self.fselected))
            entry.setFixedSize(100, 30)
            entry.setStyleSheet("font-size:15px;background-color:#00CCFF;border: 2px solid #222222")
            entry.clicked.connect(lambda: self.selectField(entry))
            #entry.setAutoFillBackground(True)
            entry.move(self.fieldX, self.fieldY)
            self.fieldX += 105
        
            if (self.fieldX > 550):
                self.fieldX = 25
                self.fieldY += 35

            entry.show()

            self.fItems.append(entry)
    '''
            if (field == self.selected):
    This function will remove the selected button on the label.
    '''
    def removeField(self):
        counter = 0
        if len(self.fItems) is 0:
            self.Labels = []
            return
        # finds the item and removes it
        for field in self.fItems:
                if self.selected is field:
                    self.fItems.remove(field)
                    self.Labels.pop(counter)
                    field.setParent(None)
                    if len(self.fItems) == 0 :
                        self.selected = None
                    elif (counter == len(self.fItems)):
                        self.selectField(self.fItems[counter-1])
                    else:
                        self.selectField(self.fItems[counter])
                    break
                counter+=1
        # Moves all of the labels after the newly removed label to new adjusted position
        for field in range(counter,len(self.fItems)):
            if ((self.fItems[field].pos().x()-105) < 25):
                if (self.fItems[field].pos().y() > 70):
                    self.fItems[field].move(550,self.fItems[field].pos().y()-35)
                else:
                    break
            else:
                    self.fItems[field].move((self.fItems[field].pos().x() -105),self.fItems[field].pos().y())

        # sets the new position where new labels are created
        if (counter >= 0):
            if (self.fieldX-105 < 25 ):
                if self.fieldY > 70:
                    self.fieldX = 550
                    self.fieldY-=35
                else:
                    pass
            else:
                self.fieldX-=105



    '''
    This function will show us what the citation style will look like with default values.
    '''
    def preview(self):
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

        fileName = QtGui.QFileDialog.getSaveFileName(self, "untitled", "", ".csl")
        if not fileName:
            return
        if not self.Labels:
            return
        fileName = (fileName[0:str(fileName).find('.csl')])
        list = self.Labels
        i = 0
        for item in list:
            if self.map.ZtoC(item):
                self.Labels[i] = 'text variable="' + self.map.ZtoC(item) + '"'
            i+=1
        self.File.SaveLayout(self.Form,list,'temp.xml')
        os.rename('temp.xml', fileName + '.csl')

        # if file is none (DO AT END NOT IMPORTANT RN)




    '''
    This function will choose the selected label
    '''
    def selectField(self, entry=None):
        if (self.selected != None):
            self.selected.setStyleSheet("font-size:15px;background-color:#00CCFF;border: 2px solid #222222")

        self.selected = entry
        entry.setStyleSheet("font-size:15px;background-color:#FFFF66;border: 2px solid #222222")

    def LoadField(self,Path = None):


        fileName = QtGui.QFileDialog.getOpenFileName(self, 'OpenFile')
        if not fileName:
            return
        fileName = (fileName[0:str(fileName).find('.csl')])
        try:
            shutil.copyfile(fileName+'.csl','temp.xml')
        except:
            return
        while len(self.fItems):
            self.selected = self.fItems[0]
            self.removeField()
            self.selected = None

        self.Labels = []
        self.btn_Add.setEnabled(True)
        self.FileName = fileName
        fileName = 'temp.xml'
        self.File = xmlpython(fileName)

        List = self.File.GetLayout(self.Form)
        savedfselected = self.fselected
        for item in List:
            self.fselected = item
            self.addField()
	    self.fselected = savedfselected












