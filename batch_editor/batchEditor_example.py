#import the batch editor
from batchEditor import BEditor

#initialize a batch editor, this will give you a error
#since the params are invalid, add proper params to make it work
#params are user-id, user-type (usually 'user'), and API-Key
#you can generate these from your Zotero account
beditor = BEditor("test", "test", "test")

#print raw data for entire library, recommend testing with a small library
beditor.library_raw()

#edit the tags using this
beditor.batch_edit_tag("old value", "new value")

#compare this raw data to the old raw data
beditor.library_raw()