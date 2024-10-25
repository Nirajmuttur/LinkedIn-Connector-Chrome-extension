let isRunning = true;
let connectionCounter = 0;
let timeoutIds = [];

// Helper function to randomize delay between actions

function randomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to send connection requests
function sendConnectionRequests() {
    console.log('Starting to send connection requests...');
    const buttons = Array.from(document.querySelectorAll('button'))
        .filter(button => button.innerText.trim() === 'Connect' && !button.disabled);
    
    function processButton(index) {
        if (!isRunning || index >= buttons.length) {
            console.log('Connection request process stopped or completed.');
            // Notify popup that the process is complete
            chrome.runtime.sendMessage({ action: "processComplete" });
            return;
        }

        const timeoutId = setTimeout(() => {
            if (!isRunning) return;
            
            buttons[index].click();
            console.log(`Clicked Connect button ${index + 1} of ${buttons.length}`);
            
            // Handle modal interactions
            const modalTimeoutId = setTimeout(() => {
                if (!isRunning) return;
                
                if (handleModal()) {
                    connectionCounter++;
                    // Send updated counter to popup
                    chrome.runtime.sendMessage({ action: "updateCounter", count: connectionCounter });
                }
                processButton(index + 1);
            }, 2000); // Wait 2 seconds before interacting with the modal
            
            timeoutIds.push(modalTimeoutId);
        }, randomDelay(5000, 10000));
        
        timeoutIds.push(timeoutId);
    }

    processButton(0);
}

function handleModal() {
    // Try to find the "Send without a note" button
    const sendWithoutNoteButton = document.querySelector('button[aria-label="Send without a note"]');
    if (sendWithoutNoteButton) {
        console.log('Found "Send without a note" button. Clicking...');
        sendWithoutNoteButton.click();
        return true;
    }

    // If neither button is found, look for the dismiss button
    const modalCloseButton = document.querySelector('button[aria-label="Dismiss"]');
    if (modalCloseButton) {
        console.log('Found "Dismiss" button. Clicking to close modal...');
        modalCloseButton.click();
        return false;
    }

    console.log('Could not find any expected buttons in the modal.');
    return false;
}

function stopAllOperations() {
    isRunning = false;
    console.log('Stopping all operations...');
    timeoutIds.forEach(id => clearTimeout(id));
    timeoutIds = [];
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "stop") {
        stopAllOperations();
        console.log('Received stop signal. Halting connection requests.');
    } else if (request.action === "getCounter") {
        sendResponse({ count: connectionCounter });
    }
});

// Execute the function when the script is injected
console.log("Content script injected. Starting the connection requests...");
sendConnectionRequests();
