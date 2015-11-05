__author__ = 'Wilfred'
import xml.etree.ElementTree as ET
class xmlpython():

    def __init__(self,filename = None):
        self.tree = ET.parse(filename)
        self.root = self.tree.getroot()

    def FindLayout(self,Element = None):
        List = []
        for element in Element:
            if 'text' in element.tag:
                List.append(element.attrib)

        for element in Element:
            result = self.FindLayout(element)
            if result:
                List.append(result)
        return List

    def GetLayout(self,Form = None):
        List = []
        # Find citation element
        i = 0

        for element in self.root:
            if Form in element.tag:
                form = element
                break

        for element in  form:
            if 'layout' in element.tag:
                List = self.FindLayout(form)
                break


        return self.flatten(List)

    def flatten(self,S):
     if S == []:
        return S
     if isinstance(S[0], list):
        return self.flatten(S[0]) + self.flatten(S[1:])
     return S[:1] + self.flatten(S[1:])
