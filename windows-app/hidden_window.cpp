#include <windows.h>

// Window procedure function
LRESULT CALLBACK WindowProcedure(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
    switch(msg) {
        case WM_DESTROY:
            PostQuitMessage(0);
            break;
        default:
            return DefWindowProc(hwnd, msg, wParam, lParam);
    }
    return 0;
}

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    // Register window class
    WNDCLASS wc = {0};
    wc.lpfnWndProc = WindowProcedure;
    wc.hInstance = hInstance;
    wc.lpszClassName = "HiddenWindowClass";
    
    if (!RegisterClass(&wc)) {
        return 1;
    }
    
    // Create a 1x1 pixel window positioned off-screen
    HWND hwnd = CreateWindowEx(
        WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE,  // Extended styles for invisibility
        "HiddenWindowClass",                  // Class name
        "Hidden Window",                      // Window title
        WS_POPUP,                             // Window style
        3000,                                 // X position (off-screen)
        3000,                                 // Y position (off-screen)
        1,                                    // Width (1 pixel)
        1,                                    // Height (1 pixel)
        NULL,                                 // Parent window
        NULL,                                 // Menu
        hInstance,                            // Instance handle
        NULL                                  // Additional application data
    );
    
    if (hwnd == NULL) {
        return 1;
    }
    
    // Set window transparency to make it completely invisible
    SetWindowLong(hwnd, GWL_EXSTYLE, GetWindowLong(hwnd, GWL_EXSTYLE) | WS_EX_LAYERED);
    SetLayeredWindowAttributes(hwnd, 0, 1, LWA_ALPHA); // 1 = almost completely transparent
    
    // Hide the window from taskbar and other UI elements
    ShowWindow(hwnd, SW_HIDE);
    
    // Message loop (this application will run in the background)
    MSG msg;
    while (GetMessage(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    
    return msg.wParam;
}