#import statement for pickler class
from pickler import Pickler

#intialize a pickler and pass it the pickle save file name (a string)
#this will be needed to recieve data later
test = Pickler('test')

#example of how to save, you can save almost any python data structure
#this includes things like lists, dicts, strings, ints, etc.
test.save("test2")

#example of how to load data
#remember since you passes 'test' to the pickler instance it will 
#search test.p for the data, so if your program were to close and need the
#data you saved earlier, you would create a pickler instance and pass
#it the parameter 'test' and then call .load() to retrieve saved data
print test.load()