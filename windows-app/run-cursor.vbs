' VBScript to run PowerShell invisibly for cursor drawing
Dim objArgs, textToDisplay
Dim objShell

' Get the text parameter from command line
Set objArgs = WScript.Arguments
If objArgs.Count > 0 Then
    textToDisplay = objArgs(0)
Else
    ' Exit if no text provided
    WScript.Quit
End If

' Create Shell object
Set objShell = CreateObject("WScript.Shell")

' Run PowerShell script invisibly with additional parameters to suppress any windows
objShell.Run "powershell.exe -WindowStyle Hidden -ExecutionPolicy Bypass -NonInteractive -NoProfile -Command ""& '" & Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\")) & "move-cursor.ps1' -Text '" & textToDisplay & "'""", 0, False

' Clean up
Set objShell = Nothing