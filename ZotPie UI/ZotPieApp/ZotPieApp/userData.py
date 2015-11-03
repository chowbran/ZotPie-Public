import ConfigParser
import os

fileName = "./Data/userdata.cfg"

class UserData(object):
    """User data object that stores user settings"""
    def __init__(self):
        self.config = ConfigParser.SafeConfigParser()
        
        if (self.configExists() == False):
            self.createConfigFile()
        else:
            self.config.read(fileName)
        
    def createConfigFile(self):
        if not os.path.exists(os.path.dirname(fileName)):
            os.makedirs(os.path.dirname(fileName))

        self.addSection('GENERAL')

    def configExists(self):
        return os.path.exists(fileName)

    def addSection(self, sectionName):
        self.config.add_section(sectionName)
        self.writeToFile()

    def hasSection(self, sectionName):
        #self.config.read(fileName)
        return self.config.has_section(sectionName)

    def setKeyValue(self, sectionName, key, value):
        self.config.set(sectionName, key, value)
        self.writeToFile()

    def safeSetKeyValue(self, sectionName, key, value):
        if (self.hasSection(sectionName) == False):
            self.addSection(sectionName)

        self.setKeyValue(sectionName, key, value)

    def writeToFile(self):
        with open(fileName, 'wb') as configFile:
            self.config.write(configFile)

    def getValue(self, section, key):
        #self.config.read(fileName)
        return self.config.get(section, key)

    def getIntValue(self, section, key):
        #self.config.read(fileName)
        return self.config.getint(section, key)

    def getFloatValue(self, section, key):
        #self.config.read(fileName)
        return self.config.getfloat(section, key)
    
    def getBoolValue(self, section, key):
        #self.config.read(fileName)
        return self.config.getBoolean(section, key)
