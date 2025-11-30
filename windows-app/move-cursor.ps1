param(
    [string]$Text = "A"
)

# PowerShell script to move the cursor in the shape of text for 2 iterations

# Add necessary assemblies
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Get screen dimensions
$screenWidth = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Width
$screenHeight = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Height

# Define the center of the screen for drawing
$centerX = $screenWidth / 2
$centerY = $screenHeight / 2

# Define size for the letters
$letterWidth = 100
$letterHeight = 150
$spacing = 20

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
        Start-Sleep -Milliseconds 5
    }
}

# Function to draw letter A (modified to move upward)
function Draw-LetterA {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $middleY = $offsetY + ($letterHeight / 2)
    $centerX = $offsetX + ($letterWidth / 2)
    
    # Move upward instead of drawing the letter A
    # Start from bottom and move to top
    Move-CursorLine -startX $centerX -startY $bottomY -endX $centerX -endY $topY -steps 20
}

# Function to draw letter B (modified to move downward)
function Draw-LetterB {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $middleY = $offsetY + ($letterHeight / 2)
    $centerX = $offsetX + ($letterWidth / 2)
    
    # Move downward instead of drawing the letter B
    # Start from top and move to bottom
    Move-CursorLine -startX $centerX -startY $topY -endX $centerX -endY $bottomY -steps 20
}

# Function to draw letter C (modified to move leftward)
function Draw-LetterC {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $middleY = $offsetY + ($letterHeight / 2)
    $centerY = $offsetY + ($letterHeight / 2)
    
    # Move leftward instead of drawing the letter C
    # Start from right and move to left
    Move-CursorLine -startX $rightX -startY $centerY -endX $leftX -endY $centerY -steps 20
}

# Function to draw letter D (modified to move rightward)
function Draw-LetterD {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $middleY = $offsetY + ($letterHeight / 2)
    $centerY = $offsetY + ($letterHeight / 2)
    
    # Move rightward instead of drawing the letter D
    # Start from left and move to right
    Move-CursorLine -startX $leftX -startY $centerY -endX $rightX -endY $centerY -steps 20
}

# Function to draw letter E
function Draw-LetterE {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $middleY = $offsetY + ($letterHeight / 2)
    
    # Top horizontal line
    Move-CursorLine -startX $leftX -startY $topY -endX $rightX -endY $topY -steps 10
    # Left vertical line
    Move-CursorLine -startX $leftX -startY $topY -endX $leftX -endY $bottomY -steps 15
    # Middle horizontal line
    Move-CursorLine -startX $leftX -startY $middleY -endX $rightX -endY $middleY -steps 10
    # Bottom horizontal line
    Move-CursorLine -startX $leftX -startY $bottomY -endX $rightX -endY $bottomY -steps 10
}

# Function to draw letter F
function Draw-LetterF {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $middleY = $offsetY + ($letterHeight / 2)
    
    # Top horizontal line
    Move-CursorLine -startX $leftX -startY $topY -endX $rightX -endY $topY -steps 10
    # Left vertical line
    Move-CursorLine -startX $leftX -startY $topY -endX $leftX -endY $bottomY -steps 15
    # Middle horizontal line
    Move-CursorLine -startX $leftX -startY $middleY -endX $rightX -endY $middleY -steps 10
}

# Function to draw letter G
function Draw-LetterG {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $middleY = $offsetY + ($letterHeight / 2)
    $gStartX = $rightX - ($letterWidth / 3)
    
    # Draw G as a partial rectangle with a hook
    # Top horizontal line
    Move-CursorLine -startX $rightX -startY $topY -endX $leftX -endY $topY -steps 10
    # Left vertical line
    Move-CursorLine -startX $leftX -startY $topY -endX $leftX -endY $bottomY -steps 15
    # Bottom horizontal line
    Move-CursorLine -startX $leftX -startY $bottomY -endX $rightX -endY $bottomY -steps 10
    # Right vertical line (partial)
    Move-CursorLine -startX $rightX -startY $bottomY -endX $rightX -endY $middleY -steps 8
    # Hook
    Move-CursorLine -startX $rightX -startY $middleY -endX $gStartX -endY $middleY -steps 8
}

# Function to draw letter H
function Draw-LetterH {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $middleY = $offsetY + ($letterHeight / 2)
    
    # Left vertical line
    Move-CursorLine -startX $leftX -startY $topY -endX $leftX -endY $bottomY -steps 15
    # Middle horizontal line
    Move-CursorLine -startX $leftX -startY $middleY -endX $rightX -endY $middleY -steps 10
    # Right vertical line
    Move-CursorLine -startX $rightX -startY $topY -endX $rightX -endY $bottomY -steps 15
}

# Function to draw letter I
function Draw-LetterI {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $centerX = $offsetX + ($letterWidth / 2)
    
    # Top horizontal line
    Move-CursorLine -startX $leftX -startY $topY -endX $rightX -endY $topY -steps 10
    # Middle vertical line
    Move-CursorLine -startX $centerX -startY $topY -endX $centerX -endY $bottomY -steps 15
    # Bottom horizontal line
    Move-CursorLine -startX $leftX -startY $bottomY -endX $rightX -endY $bottomY -steps 10
}

# Function to draw letter J
function Draw-LetterJ {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $centerX = $offsetX + ($letterWidth / 2)
    $jStartX = $rightX - ($letterWidth / 3)
    
    # Top horizontal line
    Move-CursorLine -startX $leftX -startY $topY -endX $rightX -endY $topY -steps 10
    # Right vertical line
    Move-CursorLine -startX $jStartX -startY $topY -endX $jStartX -endY $bottomY -steps 15
    # Bottom hook
    Move-CursorLine -startX $jStartX -startY $bottomY -endX $centerX -endY $bottomY -steps 8
}

# Function to draw letter K
function Draw-LetterK {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $middleY = $offsetY + ($letterHeight / 2)
    $centerX = $offsetX + ($letterWidth / 2)
    
    # Vertical line
    Move-CursorLine -startX $leftX -startY $topY -endX $leftX -endY $bottomY -steps 15
    # Upper diagonal
    Move-CursorLine -startX $leftX -startY $middleY -endX $rightX -endY $topY -steps 12
    # Lower diagonal
    Move-CursorLine -startX $leftX -startY $middleY -endX $rightX -endY $bottomY -steps 12
}

# Function to draw letter L
function Draw-LetterL {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    
    # Vertical line
    Move-CursorLine -startX $leftX -startY $topY -endX $leftX -endY $bottomY -steps 15
    # Bottom horizontal line
    Move-CursorLine -startX $leftX -startY $bottomY -endX $rightX -endY $bottomY -steps 10
}

# Function to draw letter M
function Draw-LetterM {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $middleX = $offsetX + ($letterWidth / 2)
    
    # Left vertical line
    Move-CursorLine -startX $leftX -startY $bottomY -endX $leftX -endY $topY -steps 12
    # Diagonal to middle
    Move-CursorLine -startX $leftX -startY $topY -endX $middleX -endY $middleY -steps 10
    # Diagonal to right
    Move-CursorLine -startX $middleX -startY $middleY -endX $rightX -endY $topY -steps 10
    # Right vertical line
    Move-CursorLine -startX $rightX -startY $topY -endX $rightX -endY $bottomY -steps 12
}

# Function to draw letter N
function Draw-LetterN {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    
    # Left vertical line
    Move-CursorLine -startX $leftX -startY $bottomY -endX $leftX -endY $topY -steps 12
    # Diagonal to right
    Move-CursorLine -startX $leftX -startY $topY -endX $rightX -endY $bottomY -steps 12
    # Right vertical line
    Move-CursorLine -startX $rightX -startY $bottomY -endX $rightX -endY $topY -steps 12
}

# Function to draw letter O
function Draw-LetterO {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    
    # Top horizontal line
    Move-CursorLine -startX $leftX -startY $topY -endX $rightX -endY $topY -steps 10
    # Right vertical line
    Move-CursorLine -startX $rightX -startY $topY -endX $rightX -endY $bottomY -steps 15
    # Bottom horizontal line
    Move-CursorLine -startX $rightX -startY $bottomY -endX $leftX -endY $bottomY -steps 10
    # Left vertical line
    Move-CursorLine -startX $leftX -startY $bottomY -endX $leftX -endY $topY -steps 15
}

# Function to draw letter P
function Draw-LetterP {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $middleY = $offsetY + ($letterHeight / 2)
    
    # Vertical line
    Move-CursorLine -startX $leftX -startY $topY -endX $leftX -endY $bottomY -steps 15
    # Top curve - horizontal line
    Move-CursorLine -startX $leftX -startY $topY -endX $rightX -endY $topY -steps 10
    # Top curve - vertical line down
    Move-CursorLine -startX $rightX -startY $topY -endX $rightX -endY $middleY -steps 8
    # Top curve - horizontal line back
    Move-CursorLine -startX $rightX -startY $middleY -endX $leftX -endY $middleY -steps 10
}

# Function to draw letter Q
function Draw-LetterQ {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $tailStartX = $rightX - ($letterWidth / 3)
    $tailStartY = $bottomY - ($letterHeight / 3)
    $tailEndX = $rightX + ($letterWidth / 4)
    $tailEndY = $bottomY + ($letterHeight / 4)
    
    # Top horizontal line
    Move-CursorLine -startX $leftX -startY $topY -endX $rightX -endY $topY -steps 10
    # Right vertical line
    Move-CursorLine -startX $rightX -startY $topY -endX $rightX -endY $bottomY -steps 15
    # Bottom horizontal line
    Move-CursorLine -startX $rightX -startY $bottomY -endX $leftX -endY $bottomY -steps 10
    # Left vertical line
    Move-CursorLine -startX $leftX -startY $bottomY -endX $leftX -endY $topY -steps 15
    # Tail
    Move-CursorLine -startX $tailStartX -startY $tailStartY -endX $tailEndX -endY $tailEndY -steps 8
}

# Function to draw letter R
function Draw-LetterR {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $middleY = $offsetY + ($letterHeight / 2)
    
    # Vertical line
    Move-CursorLine -startX $leftX -startY $topY -endX $leftX -endY $bottomY -steps 15
    # Top curve - horizontal line
    Move-CursorLine -startX $leftX -startY $topY -endX $rightX -endY $topY -steps 10
    # Top curve - vertical line down
    Move-CursorLine -startX $rightX -startY $topY -endX $rightX -endY $middleY -steps 8
    # Top curve - horizontal line back
    Move-CursorLine -startX $rightX -startY $middleY -endX $leftX -endY $middleY -steps 10
    # Diagonal leg
    Move-CursorLine -startX $leftX -startY $middleY -endX $rightX -endY $bottomY -steps 10
}

# Function to draw letter S
function Draw-LetterS {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $middleY = $offsetY + ($letterHeight / 2)
    
    # Top horizontal line
    Move-CursorLine -startX $rightX -startY $topY -endX $leftX -endY $topY -steps 10
    # Left vertical line (top half)
    Move-CursorLine -startX $leftX -startY $topY -endX $leftX -endY $middleY -steps 8
    # Middle horizontal line
    Move-CursorLine -startX $leftX -startY $middleY -endX $rightX -endY $middleY -steps 10
    # Right vertical line (bottom half)
    Move-CursorLine -startX $rightX -startY $middleY -endX $rightX -endY $bottomY -steps 8
    # Bottom horizontal line
    Move-CursorLine -startX $rightX -startY $bottomY -endX $leftX -endY $bottomY -steps 10
}

# Function to draw letter T
function Draw-LetterT {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $centerX = $offsetX + ($letterWidth / 2)
    
    # Top horizontal line
    Move-CursorLine -startX $leftX -startY $topY -endX $rightX -endY $topY -steps 10
    # Middle vertical line
    Move-CursorLine -startX $centerX -startY $topY -endX $centerX -endY $bottomY -steps 15
}

# Function to draw letter U
function Draw-LetterU {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    
    # Left vertical line
    Move-CursorLine -startX $leftX -startY $topY -endX $leftX -endY $bottomY -steps 15
    # Bottom horizontal line
    Move-CursorLine -startX $leftX -startY $bottomY -endX $rightX -endY $bottomY -steps 10
    # Right vertical line
    Move-CursorLine -startX $rightX -startY $bottomY -endX $rightX -endY $topY -steps 15
}

# Function to draw letter V
function Draw-LetterV {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $centerX = $offsetX + ($letterWidth / 2)
    
    # Left diagonal
    Move-CursorLine -startX $leftX -startY $topY -endX $centerX -endY $bottomY -steps 12
    # Right diagonal
    Move-CursorLine -startX $centerX -startY $bottomY -endX $rightX -endY $topY -steps 12
}

# Function to draw letter W
function Draw-LetterW {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $quarterX = $offsetX + ($letterWidth / 4)
    $threeQuarterX = $offsetX + (3 * $letterWidth / 4)
    
    # Left vertical line
    Move-CursorLine -startX $leftX -startY $topY -endX $leftX -endY $bottomY -steps 12
    # Diagonal to first quarter
    Move-CursorLine -startX $leftX -startY $bottomY -endX $quarterX -endY $middleY -steps 10
    # Diagonal to three quarter
    Move-CursorLine -startX $quarterX -startY $middleY -endX $threeQuarterX -endY $bottomY -steps 10
    # Diagonal to right
    Move-CursorLine -startX $threeQuarterX -startY $bottomY -endX $rightX -endY $topY -steps 10
}

# Function to draw letter X
function Draw-LetterX {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    
    # Diagonal from top-left to bottom-right
    Move-CursorLine -startX $leftX -startY $topY -endX $rightX -endY $bottomY -steps 15
    # Diagonal from bottom-left to top-right
    Move-CursorLine -startX $leftX -startY $bottomY -endX $rightX -endY $topY -steps 15
}

# Function to draw letter Y
function Draw-LetterY {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $centerX = $offsetX + ($letterWidth / 2)
    $middleY = $offsetY + ($letterHeight / 2)
    
    # Left diagonal to center
    Move-CursorLine -startX $leftX -startY $topY -endX $centerX -endY $middleY -steps 10
    # Right diagonal to center
    Move-CursorLine -startX $rightX -startY $topY -endX $centerX -endY $middleY -steps 10
    # Vertical line from center down
    Move-CursorLine -startX $centerX -startY $middleY -endX $centerX -endY $bottomY -steps 10
}

# Function to draw letter Z
function Draw-LetterZ {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    
    # Top horizontal line
    Move-CursorLine -startX $leftX -startY $topY -endX $rightX -endY $topY -steps 10
    # Diagonal to bottom-left
    Move-CursorLine -startX $rightX -startY $topY -endX $leftX -endY $bottomY -steps 15
    # Bottom horizontal line
    Move-CursorLine -startX $leftX -startY $bottomY -endX $rightX -endY $bottomY -steps 10
}

# Function to draw number 0
function Draw-Number0 {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    
    # Top horizontal line
    Move-CursorLine -startX $leftX -startY $topY -endX $rightX -endY $topY -steps 10
    # Right vertical line
    Move-CursorLine -startX $rightX -startY $topY -endX $rightX -endY $bottomY -steps 15
    # Bottom horizontal line
    Move-CursorLine -startX $rightX -startY $bottomY -endX $leftX -endY $bottomY -steps 10
    # Left vertical line
    Move-CursorLine -startX $leftX -startY $bottomY -endX $leftX -endY $topY -steps 15
}

# Function to draw number 1
function Draw-Number1 {
    param([int]$offsetX, [int]$offsetY)
    $centerX = $offsetX + ($letterWidth / 2)
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    
    # Vertical line
    Move-CursorLine -startX $centerX -startY $topY -endX $centerX -endY $bottomY -steps 15
}

# Function to draw number 2
function Draw-Number2 {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $middleY = $offsetY + ($letterHeight / 2)
    
    # Top horizontal line
    Move-CursorLine -startX $leftX -startY $topY -endX $rightX -endY $topY -steps 10
    # Right vertical line (top half)
    Move-CursorLine -startX $rightX -startY $topY -endX $rightX -endY $middleY -steps 8
    # Middle horizontal line
    Move-CursorLine -startX $rightX -startY $middleY -endX $leftX -endY $middleY -steps 10
    # Left vertical line (bottom half)
    Move-CursorLine -startX $leftX -startY $middleY -endX $leftX -endY $bottomY -steps 8
    # Bottom horizontal line
    Move-CursorLine -startX $leftX -startY $bottomY -endX $rightX -endY $bottomY -steps 10
}

# Function to draw number 3
function Draw-Number3 {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $middleY = $offsetY + ($letterHeight / 2)
    
    # Top horizontal line
    Move-CursorLine -startX $leftX -startY $topY -endX $rightX -endY $topY -steps 10
    # Right vertical line (top half)
    Move-CursorLine -startX $rightX -startY $topY -endX $rightX -endY $middleY -steps 8
    # Middle horizontal line
    Move-CursorLine -startX $rightX -startY $middleY -endX $leftX -endY $middleY -steps 10
    # Right vertical line (bottom half)
    Move-CursorLine -startX $rightX -startY $middleY -endX $rightX -endY $bottomY -steps 8
    # Bottom horizontal line
    Move-CursorLine -startX $rightX -startY $bottomY -endX $leftX -endY $bottomY -steps 10
}

# Function to draw number 4
function Draw-Number4 {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $middleY = $offsetY + ($letterHeight / 2)
    
    # Left vertical line (top half)
    Move-CursorLine -startX $leftX -startY $topY -endX $leftX -endY $middleY -steps 8
    # Horizontal line
    Move-CursorLine -startX $leftX -startY $middleY -endX $rightX -endY $middleY -steps 10
    # Right vertical line (full)
    Move-CursorLine -startX $rightX -startY $topY -endX $rightX -endY $bottomY -steps 15
}

# Function to draw number 5
function Draw-Number5 {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $middleY = $offsetY + ($letterHeight / 2)
    
    # Top horizontal line
    Move-CursorLine -startX $rightX -startY $topY -endX $leftX -endY $topY -steps 10
    # Left vertical line (top half)
    Move-CursorLine -startX $leftX -startY $topY -endX $leftX -endY $middleY -steps 8
    # Middle horizontal line
    Move-CursorLine -startX $leftX -startY $middleY -endX $rightX -endY $middleY -steps 10
    # Right vertical line (bottom half)
    Move-CursorLine -startX $rightX -startY $middleY -endX $rightX -endY $bottomY -steps 8
    # Bottom horizontal line
    Move-CursorLine -startX $rightX -startY $bottomY -endX $leftX -endY $bottomY -steps 10
}

# Function to draw number 6
function Draw-Number6 {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $middleY = $offsetY + ($letterHeight / 2)
    
    # Top horizontal line
    Move-CursorLine -startX $rightX -startY $topY -endX $leftX -endY $topY -steps 10
    # Left vertical line (full)
    Move-CursorLine -startX $leftX -startY $topY -endX $leftX -endY $bottomY -steps 15
    # Bottom horizontal line
    Move-CursorLine -startX $leftX -startY $bottomY -endX $rightX -endY $bottomY -steps 10
    # Right vertical line (bottom half)
    Move-CursorLine -startX $rightX -startY $middleY -endX $rightX -endY $bottomY -steps 8
    # Middle horizontal line
    Move-CursorLine -startX $rightX -startY $middleY -endX $leftX -endY $middleY -steps 10
}

# Function to draw number 7
function Draw-Number7 {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    
    # Top horizontal line
    Move-CursorLine -startX $leftX -startY $topY -endX $rightX -endY $topY -steps 10
    # Right diagonal line
    Move-CursorLine -startX $rightX -startY $topY -endX $leftX -endY $bottomY -steps 15
}

# Function to draw number 8
function Draw-Number8 {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $middleY = $offsetY + ($letterHeight / 2)
    
    # Top horizontal line
    Move-CursorLine -startX $leftX -startY $topY -endX $rightX -endY $topY -steps 10
    # Right vertical line (top half)
    Move-CursorLine -startX $rightX -startY $topY -endX $rightX -endY $middleY -steps 8
    # Middle horizontal line
    Move-CursorLine -startX $rightX -startY $middleY -endX $leftX -endY $middleY -steps 10
    # Left vertical line (top half)
    Move-CursorLine -startX $leftX -startY $middleY -endX $leftX -endY $topY -steps 8
    # Left vertical line (bottom half)
    Move-CursorLine -startX $leftX -startY $middleY -endX $leftX -endY $bottomY -steps 8
    # Bottom horizontal line
    Move-CursorLine -startX $leftX -startY $bottomY -endX $rightX -endY $bottomY -steps 10
    # Right vertical line (bottom half)
    Move-CursorLine -startX $rightX -startY $middleY -endX $rightX -endY $bottomY -steps 8
}

# Function to draw number 9
function Draw-Number9 {
    param([int]$offsetX, [int]$offsetY)
    $leftX = $offsetX
    $rightX = $offsetX + $letterWidth
    $topY = $offsetY
    $bottomY = $offsetY + $letterHeight
    $middleY = $offsetY + ($letterHeight / 2)
    
    # Top horizontal line
    Move-CursorLine -startX $leftX -startY $topY -endX $rightX -endY $topY -steps 10
    # Right vertical line (full)
    Move-CursorLine -startX $rightX -startY $topY -endX $rightX -endY $bottomY -steps 15
    # Bottom horizontal line
    Move-CursorLine -startX $rightX -startY $bottomY -endX $leftX -endY $bottomY -steps 10
    # Left vertical line (top half)
    Move-CursorLine -startX $leftX -startY $bottomY -endX $leftX -endY $middleY -steps 8
    # Middle horizontal line
    Move-CursorLine -startX $leftX -startY $middleY -endX $rightX -endY $middleY -steps 10
}

# Function to draw a letter or number based on character
function Draw-Letter {
    param(
        [string]$letter,
        [int]$offsetX,
        [int]$offsetY
    )
    
    # Check if it's a number
    if ($letter -match '^\d$') {
        switch ($letter) {
            "0" { Draw-Number0 -offsetX $offsetX -offsetY $offsetY }
            "1" { Draw-Number1 -offsetX $offsetX -offsetY $offsetY }
            "2" { Draw-Number2 -offsetX $offsetX -offsetY $offsetY }
            "3" { Draw-Number3 -offsetX $offsetX -offsetY $offsetY }
            "4" { Draw-Number4 -offsetX $offsetX -offsetY $offsetY }
            "5" { Draw-Number5 -offsetX $offsetX -offsetY $offsetY }
            "6" { Draw-Number6 -offsetX $offsetX -offsetY $offsetY }
            "7" { Draw-Number7 -offsetX $offsetX -offsetY $offsetY }
            "8" { Draw-Number8 -offsetX $offsetX -offsetY $offsetY }
            "9" { Draw-Number9 -offsetX $offsetX -offsetY $offsetY }
        }
    } else {
        # Handle letters as before
        switch ($letter.ToUpper()) {
            "A" { Draw-LetterA -offsetX $offsetX -offsetY $offsetY }
            "B" { Draw-LetterB -offsetX $offsetX -offsetY $offsetY }
            "C" { Draw-LetterC -offsetX $offsetX -offsetY $offsetY }
            "D" { Draw-LetterD -offsetX $offsetX -offsetY $offsetY }
            "E" { Draw-LetterE -offsetX $offsetX -offsetY $offsetY }
            "F" { Draw-LetterF -offsetX $offsetX -offsetY $offsetY }
            "G" { Draw-LetterG -offsetX $offsetX -offsetY $offsetY }
            "H" { Draw-LetterH -offsetX $offsetX -offsetY $offsetY }
            "I" { Draw-LetterI -offsetX $offsetX -offsetY $offsetY }
            "J" { Draw-LetterJ -offsetX $offsetX -offsetY $offsetY }
            "K" { Draw-LetterK -offsetX $offsetX -offsetY $offsetY }
            "L" { Draw-LetterL -offsetX $offsetX -offsetY $offsetY }
            "M" { Draw-LetterM -offsetX $offsetX -offsetY $offsetY }
            "N" { Draw-LetterN -offsetX $offsetX -offsetY $offsetY }
            "O" { Draw-LetterO -offsetX $offsetX -offsetY $offsetY }
            "P" { Draw-LetterP -offsetX $offsetX -offsetY $offsetY }
            "Q" { Draw-LetterQ -offsetX $offsetX -offsetY $offsetY }
            "R" { Draw-LetterR -offsetX $offsetX -offsetY $offsetY }
            "S" { Draw-LetterS -offsetX $offsetX -offsetY $offsetY }
            "T" { Draw-LetterT -offsetX $offsetX -offsetY $offsetY }
            "U" { Draw-LetterU -offsetX $offsetX -offsetY $offsetY }
            "V" { Draw-LetterV -offsetX $offsetX -offsetY $offsetY }
            "W" { Draw-LetterW -offsetX $offsetX -offsetY $offsetY }
            "X" { Draw-LetterX -offsetX $offsetX -offsetY $offsetY }
            "Y" { Draw-LetterY -offsetX $offsetX -offsetY $offsetY }
            "Z" { Draw-LetterZ -offsetX $offsetX -offsetY $offsetY }
        }
    }
}

# Calculate total width needed for the text
$totalWidth = ($Text.Length * $letterWidth) + (($Text.Length - 1) * $spacing)
$startX = $centerX - ($totalWidth / 2)
$startY = $centerY - ($letterHeight / 2)

# Set initial cursor position
[System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point([int]$startX, [int]$startY)

# Small delay to show starting position
Start-Sleep -Milliseconds 100

# Draw each letter in the text twice
for ($iteration = 0; $iteration -lt 2; $iteration++) {
    # Draw each letter in the text
    for ($i = 0; $i -lt $Text.Length; $i++) {
        $char = $Text[$i]
        $offsetX = $startX + ($i * ($letterWidth + $spacing))
        Draw-Letter -letter $char -offsetX $offsetX -offsetY $startY
        
        # Small pause between letters
        Start-Sleep -Milliseconds 50
    }
    
    # Small pause between iterations
    if ($iteration -lt 1) {  # Don't pause after the last iteration
        Start-Sleep -Milliseconds 200
    }
}

# Return cursor to center
[System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point([int]$centerX, [int]$centerY)

Write-Host "2 iterations completed. Cursor movement finished."