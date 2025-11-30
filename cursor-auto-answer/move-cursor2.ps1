# PowerShell script to move the cursor in the shape of letter "B" for 3 seconds
Write-Host "Moving cursor in the shape of letter 'B' for 3 seconds..."

# Add necessary assemblies
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Get screen dimensions
$screenWidth = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Width
$screenHeight = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Height

# Define the center of the screen for drawing
$centerX = $screenWidth / 2
$centerY = $screenHeight / 2

# Define size for the letter B
$size = 200
$leftX = $centerX - ($size / 2)
$rightX = $centerX + ($size / 2)
$topY = $centerY - ($size / 2)
$bottomY = $centerY + ($size / 2)
$middleY = $centerY

# Function to move cursor between two points
function Move-CursorLine {
    param(
        [int]$startX,
        [int]$startY,
        [int]$endX,
        [int]$endY,
        [int]$steps
    )
    
    for ($i = 0; $i -le $steps; $i++) {
        $x = $startX + (($endX - $startX) * $i / $steps)
        $y = $startY + (($endY - $startY) * $i / $steps)
        [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point([int]$x, [int]$y)
        Start-Sleep -Milliseconds 10
    }
}

# Draw the letter "B"
# 1. Vertical line (left side)
Move-CursorLine -startX $leftX -startY $topY -endX $leftX -endY $bottomY -steps 20

# 2. Top curve - horizontal line
Move-CursorLine -startX $leftX -startY $topY -endX $rightX -endY $topY -steps 15

# 3. Top curve - vertical line down
Move-CursorLine -startX $rightX -startY $topY -endX $rightX -endY $middleY -steps 10

# 4. Top curve - horizontal line back
Move-CursorLine -startX $rightX -startY $middleY -endX $leftX -endY $middleY -steps 15

# 5. Bottom curve - horizontal line
Move-CursorLine -startX $leftX -startY $middleY -endX $rightX -endY $middleY -steps 15

# 6. Bottom curve - vertical line down
Move-CursorLine -startX $rightX -startY $middleY -endX $rightX -endY $bottomY -steps 10

# 7. Bottom curve - horizontal line back
Move-CursorLine -startX $rightX -startY $bottomY -endX $leftX -endY $bottomY -steps 15

# Animate the letter "B" by tracing it multiple times
$startTime = Get-Date
while (((Get-Date) - $startTime).TotalSeconds -lt 3) {
    # Trace the letter B again
    Move-CursorLine -startX $leftX -startY $topY -endX $leftX -endY $bottomY -steps 10
    Move-CursorLine -startX $leftX -startY $topY -endX $rightX -endY $topY -steps 8
    Move-CursorLine -startX $rightX -startY $topY -endX $rightX -endY $middleY -steps 5
    Move-CursorLine -startX $rightX -startY $middleY -endX $leftX -endY $middleY -steps 8
    Move-CursorLine -startX $leftX -startY $middleY -endX $rightX -endY $middleY -steps 8
    Move-CursorLine -startX $rightX -startY $middleY -endX $rightX -endY $bottomY -steps 5
    Move-CursorLine -startX $rightX -startY $bottomY -endX $leftX -endY $bottomY -steps 8
    
    # Small pause between traces
    Start-Sleep -Milliseconds 100
}

# Return cursor to center
[System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point([int]$centerX, [int]$centerY)

Write-Host "3 seconds completed. Cursor movement finished."