let linkedInConnectorRunning = false;
let linkedInConnectorCounter = 0;

function updateCounter(count) {
  linkedInConnectorCounter = count;
  document.getElementById('counter').innerHTML = `<i class="fas fa-user-plus icon"></i>Connections sent: ${count}`;
}

function setButtonToStart() {
  linkedInConnectorRunning = false;
  const button = document.getElementById('start');
  button.innerHTML = '<i class="fas fa-play icon"></i>Start';
  button.style.backgroundColor = '#0a66c2';
}

function setButtonToStop() {
  linkedInConnectorRunning = true;
  const button = document.getElementById('start');
  button.innerHTML = '<i class="fas fa-stop icon"></i>Stop';
  button.style.backgroundColor = '#d11124';
}

function showError(message) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000); // Hide the error message after 5 seconds
}

document.getElementById('start').addEventListener('click', () => {
  if (!linkedInConnectorRunning) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: checkLinkedInPage,
        }).then((injectionResults) => {
          for (const frameResult of injectionResults) {
            if (frameResult.result) {
              chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ['content.js']
              }).then(() => {
                console.log('Content script injected successfully');
                setButtonToStop();
              }).catch(error => {
                console.error('Script injection failed:', error);
                showError('Failed to inject script. Please try again.');
              });
              return;
            }
          }
          // Show error if the current page is not a LinkedIn page
          showError('This doesn\'t seem to be a LinkedIn page. Please navigate to LinkedIn and try again.');
        }).catch(error => {
          console.error('Script injection failed:', error);
          showError('Failed to check page. Please try again.');
        });
      } else {
        console.error('No active tab found');
        showError('No active tab found. Please try again.');
      }
    });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "stop" });
        setButtonToStart();
      }
    });
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateCounter") {
    updateCounter(request.count);
  } else if (request.action === "processComplete") {
    setButtonToStart();
  }
});

// Request current counter value when popup is opened
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs.length > 0) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getCounter" }, (response) => {
      if (response && response.count !== undefined) {
        updateCounter(response.count);
      }
    });
  }
});

function checkLinkedInPage() {
  return window.location.hostname.includes('linkedin.com');
}
