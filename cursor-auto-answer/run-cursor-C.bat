@echo off
TITLE Draw Letter C with Cursor
echo Moving cursor to draw the letter "C" for 3 seconds...
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0move-cursor.ps1" -Letter "C"

echo.
echo Cursor drawing completed.
pause