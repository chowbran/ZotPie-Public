from pyzotero import zotero

zot = zotero.Zotero('2704725', 'user', '4lXXdzNY1Io2632823WC0lcF')

print zot.key_info()['access']['user'].keys()

if 'write' in zot.key_info()['access']['user'].keys():
	print 'write'

print zot.items()