__author__ = 'Wilfred'

import xml.etree.ElementTree as ET

class Map():
    def __init__(self):
        self.Zlocalname = []
        self.Cfieldname = []
        i = 0
        f = open('mapping.txt','r')
        for line in f:
            if 'label' in line:
                self.Zlocalname.append(line[line.find('label'):line.find('value')-1])
                self.Cfieldname.append(line[line.find('value'):line.find('/')])
            i +=1
            if i == 930:
                break
        done = False
        while done is False:
            j=0
            done = True
            for item in self.Zlocalname:
                if item in self.Zlocalname[j+1:len(self.Zlocalname)]:
                    done = False
                    self.Zlocalname.pop(j)
                    self.Cfieldname.pop(j)
                j+=1

    def ZtoC(self,ZoteroString = None):
        i = 0
        for item in self.Zlocalname:
            if ZoteroString == item[7:len(item)-1]:
                return (self.Cfieldname[i])[7:len(self.Cfieldname[i])-2]
            i+=1

    def CtoZ(self,CSLstring = None):
        i = 0
        for item in self.Cfieldname:
            if(CSLstring == (item[7:len(item)-2])):
                return (self.Zlocalname[i])[7:len(self.Zlocalname[i])-1]
            i+=1

    def printZ(self):
        pass




