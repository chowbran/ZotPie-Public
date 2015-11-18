Call ArchiveFolder(".\ZotPie.zip", ".\zotpie@zotero.org\", ".\ZotPie.xpi")

Sub ArchiveFolder (zipFile, sFolder, xpiFile)
    Dim shApp
    Dim zipFolder
    Dim srcFolder

    With CreateObject("Scripting.FileSystemObject")
        zipFile = .GetAbsolutePathName(zipFile)
        sFolder = .GetAbsolutePathName(sFolder)

        With .CreateTextFile(zipFile, True)
            .Write Chr(80) & Chr(75) & Chr(5) & Chr(6) & String(18, chr(0))
        End With
    End With

    set shApp = CreateObject("shell.application")
    set zipFolder = shApp.NameSpace(zipFile)
    set srcFolder = shApp.NameSpace(sFolder)

    zipFolder.CopyHere srcFolder.Items

    Do Until zipFolder.Items.Count = _
             srcFolder.Items.Count
        WScript.Sleep 1000 
    Loop

    With CreateObject("Scripting.FileSystemObject")
        if .FileExists(xpiFile) then
            .DeleteFile xpiFile, true
        end if
        .CopyFile zipFile, xpiFile
    End With
End Sub