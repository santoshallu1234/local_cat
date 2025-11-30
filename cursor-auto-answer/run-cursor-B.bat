@echo off
TITLE Draw Text with Cursor
echo Moving cursor to draw text for 2 iterations...
echo.

set /p text="Enter text to draw (A-Z): " || set text=B
powershell -ExecutionPolicy Bypass -File "%~dp0move-cursor.ps1" -Text "%text%"

echo.
echo Cursor drawing completed.
pause