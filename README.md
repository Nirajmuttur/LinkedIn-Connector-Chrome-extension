# LinkedIn Auto Connect

Chrome extension that's able to send connection requests to a list of people in a LinkedIn search.

## Installation

To install and run this Chrome extension locally, follow these steps:

1. Clone the repository or download the source code:
   ```
   git clone https://github.com/Nirajmuttur/LinkedIn-Connector-Chrome-extension
   ```

2. Open Google Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" by toggling the switch in the top right corner.

4. Click on "Load unpacked" button that appears after enabling developer mode.

5. Navigate to the directory containing the extension files (manifest.json should be in the root of this directory) and select it.

6. The extension should now be installed and visible in your Chrome browser.
 
## Project Structure

Here's an overview of the main folders and their purposes in this project:

- manifest.json - This file is the backbone of any Chrome extension, defining permissions, scripts, and the structure of the extension.

- popup.html - This file represents the UI, where users can start/stop the automation and see the connection count.

- popup.js - This script handles user interactions on the popup, setting up the start/stop button functionality.

- content.js - This core logic script runs in the context of LinkedIn’s search page, interacting with DOM elements and sending connection requests programmatically.



