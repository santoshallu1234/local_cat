import tkinter as tk
from tkinter import messagebox
import sys
import json
import os

def show_results_in_console():
    """
    Display AI Auto Marker results in console without any visible windows
    """
    print("=" * 50)
    print("AI Auto Marker - Results")
    print("=" * 50)
    
    # In a real implementation, you would get results from a file or API
    # For now, we'll simulate getting results
    try:
        # Check if there's a results file
        if os.path.exists("results.txt"):
            with open("results.txt", "r") as f:
                results = f.read()
        else:
            results = "No results available. Press Ctrl+Shift+U to capture screen."
        
        print(results)
        print("=" * 50)
        print("Results displayed in console only - completely invisible to screen sharing")
        
        # Wait for user input before closing
        input("\nPress Enter to close...")
        
    except Exception as e:
        print(f"Error displaying results: {e}")

def save_sample_results():
    """
    Save sample results to a file for demonstration
    """
    sample_text = """Sample AI Auto Marker Results:
    
Question 1: What is the capital of France?
Answer: Paris

Question 2: What is 2+2?
Answer: 4

Question 3: Who wrote Romeo and Juliet?
Answer: William Shakespeare"""
    
    with open("results.txt", "w") as f:
        f.write(sample_text)
    
    print("Sample results saved to results.txt")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--save-sample":
        save_sample_results()
    else:
        show_results_in_console()