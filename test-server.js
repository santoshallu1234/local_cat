/**
 * Test script for the MCQ Solver Server
 * This script demonstrates how to send screenshot data to the server
 */

async function testMCQSolver() {
    try {
        console.log('Testing MCQ Solver Server with screenshot data...');
        
        // Create a mock screenshot data URL (in a real scenario, this would be an actual screenshot)
        const mockScreenshot = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
        
        const response = await fetch('http://localhost:3000/solve-mcqs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ screenshot: mockScreenshot })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('Server Response:');
        console.log(JSON.stringify(data, null, 2));
        
        if (data.success) {
            console.log('\nAnswers found:');
            if (Array.isArray(data.answers)) {
                data.answers.forEach((answer, index) => {
                    console.log(`${index + 1}. ${answer.question || 'Unknown question'}`);
                    console.log(`   Correct Answer: ${answer.answer || 'Unknown'}`);
                });
            } else {
                console.log('Unexpected response format:', data.answers);
            }
        } else {
            console.log('\nError from server:');
            console.log(data.error);
            if (data.details) {
                console.log('Details:', data.details);
            }
        }
    } catch (error) {
        console.error('Error testing MCQ solver:', error);
    }
}

// Run the test
testMCQSolver();