import tkinter as tk
import sys

def create_hidden_window():
    """
    Create a hidden window that is completely invisible to screen sharing applications.
    """
    # Create the main window
    root = tk.Tk()
    
    # Configure window to be completely hidden
    root.geometry("1x1+3000+3000")  # 1x1 pixel, positioned off-screen
    root.overrideredirect(True)     # Remove window decorations
    root.attributes('-alpha', 0.01) # Almost completely transparent
    root.attributes('-toolwindow', True)  # Tool window style (not shown in taskbar)
    root.wm_attributes("-topmost", False) # Not always on top
    
    # Withdraw the window to make it completely invisible
    root.withdraw()
    
    # Keep the window running in the background
    root.mainloop()

if __name__ == "__main__":
    create_hidden_window()