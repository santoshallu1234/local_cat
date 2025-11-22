@echo off
g++ -mwindows hidden_window.cpp -o hidden_window.exe -lgdi32
echo Build complete. Hidden window executable created as hidden_window.exe
pause