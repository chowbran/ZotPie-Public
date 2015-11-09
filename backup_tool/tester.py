from pyzotero import zotero
from btool import BTool
zot = zotero.Zotero('2704725', 'user', '4lXXdzNY1Io2632823WC0lcF')

b = BTool('2704725', 'user', 'o2Zml5NwMI5JwZD6QHFR7O8S')
#b.backup()
#b.restore("27047252")

print b.savelog()