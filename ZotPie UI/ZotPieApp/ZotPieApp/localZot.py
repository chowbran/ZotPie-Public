import os
import sqlite3
import sys
from pyzotero import zotero
import math
import random
import datetime

class LocalZot:
    def __init__(self):
        dbPath = os.getenv('APPDATA')
        print dbPath
        if (sys.platform.startswith('linux')):
            dbPath += 'aaa'
        elif (sys.platform == 'win32'):
            dbPath += '\Zotero\Zotero\Profiles'

        for file in os.listdir(dbPath):
            if (file.endswith(".default")):
                dbPath += '\\' + file + '\zotero'
                break

        print dbPath

        zot = zotero.Zotero('2720485', 'user', 'amxUEQbOcgQShX0Xd0zuQDvR')

        for item in zot.collections():
            print item
            print '\n'

        print "adasdasdasdas\n\n\n\n\n\addasdasdads"

        self.conn = sqlite3.connect(dbPath + "\zoteroBAK.sqlite")
        self.getCollection()
        self.getCollection('2533477')
        print(self.generateObjectKey())

    def getCollection(self, groupId=None):
        
        returnCollection = []
        
        sql = 'SELECT * FROM collections WHERE libraryID=?'

        if (groupId != None):
            t = (groupId,)

        for row in (self.conn.execute(sql, t) if groupId != None else self.conn.execute('SELECT * FROM collections WHERE libraryID IS NULL')):
            #print row
            collectionData = {}
            innerData = {}
            innerData['name'] = row[1]
            collectionData['data'] = innerData
            collectionData['key'] = row[-1]
            returnCollection.append(collectionData)
            
        print returnCollection


    def addTag(self, tag):
        pass

    def dateToSQL(self, toUTC=False):
        if (toUTC):
            return format(datetime.datetime.utcnow(), '%Y-%m-%d %H:%M:%S')
        
        return format(datetime.datetime.now(), '%Y-%m-%d %H:%M:%S')

    def generateObjectKey(self):
        baseString = "23456789ABCDEFGHIJKMNPQRSTUVWXZ"
        return self.generateRandomString(8, baseString)

    def generateRandomString(self, length=None, chars=None):
        if (chars == None):
            chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"	
        if (length == None):
            length = 8
        randomstring = ''

        for i in range(0, length):
            rnum = int(math.floor(random.random() * len(chars)))
            randomstring += chars[rnum:rnum+1]

        return randomstring


