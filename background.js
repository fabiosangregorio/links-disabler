'use strict';

const sendMessage = (action, tabId = null, responseFn = null) => {
  if (!responseFn) {
    responseFn = (response) => {
      if(!response) return;
      chrome.storage.sync.set({ globalState: response.state });
      setIcon(response.state);
    }
  }
  
  chrome.storage.sync.get({
    global: false,
    globalState: false,
    disableList: []
  }, (storage) => {
    const message = {
      action: action,
      global: storage.global,
      globalState: storage.globalState,
      disableList: storage.disableList
    }
    if(tabId) {
      chrome.tabs.sendMessage(tabId, message,responseFn); 
    } else {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if(!tabs[0]?.id) {
          return;
        }
        chrome.tabs.sendMessage(tabs[0].id, message, responseFn); 
      });
    }
  });
}

/**
 * Handler for commands fired from keyboard shortcuts
 */
chrome.commands.onCommand.addListener(() => sendMessage('toggleLinks'));

/**
 * Handler for extension button click
 */
chrome.browserAction.onClicked.addListener(() => sendMessage('toggleLinks'));

/**
 * Fired when a tab is updated.
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  sendMessage('refresh', tabId);
});

/**
 * Fires when the active tab in a window changes
 */
chrome.tabs.onActivated.addListener(activeInfo => {
  sendMessage('refresh', activeInfo.tabId);
});


/* UTILITY FUNCTIONS */

/**
 * Sets the extension icon to either enabled or disabled
 * @param {bool} status Boolean indicating whether the icon is enabled or not
 */
const setIcon = (status) => {
  chrome.browserAction.setIcon({
    path: `icons/icon48${status ? "" : 'enabled'}.png`
  });
}
