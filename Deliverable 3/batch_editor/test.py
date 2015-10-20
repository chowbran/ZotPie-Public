from pyzotero import zotero
zot = zotero.Zotero('2710002', 'user', 'jxIEnHTfXW5guwz6X8q5upsv')
items = zot.top(limit=100)
# we've retrieved the latest five top-level items in our library
# we can print each item's item type and ID
#for item in items:
    #print('Item: %s | Key: %s') % (item['data']['itemType'], item['data']['key'])
#    item['data']['tags'].append('tag_add_test')
#    zot.update_item(item);

#for item in items:
#    print('Item: %s | Key: %s') % (item['data']['tags'], item['data']['key'])
zot.items()
for item in items:
    #print('Item: %s | Key: %s') % (item['data']['itemType'], item['data']['key'])
    try:
    	item['data']['date'] = ['1999', '2005']
    	zot.update_item(item)
    except:
    	pass

items = zot.top(limit=100)
for item in items:
    print('Item: %s | Key: %s') % (item['data']['date'], item['data']['key'])

