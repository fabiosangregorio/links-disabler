'use strict';

const sendMessage = (action, tabId = null, responseFn = null) => {
  if (!responseFn) {
    responseFn = (response) => {
      console.info('response received: ' + (response ? 'not ' : '') + 'empty');
      if(!response) return;
      chrome.storage.sync.set({ globalState: response.state });
      setIcon(response.state);
    }
  }
  
  chrome.storage.sync.get({
    global: false,
    globalState: false
  }, (storage) => {
    const message = {
      action: action,
      global: storage.global,
      globalState: storage.globalState
    }
    if(tabId) {
      chrome.tabs.sendMessage(tabId, message,responseFn); 
    } else {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if(!tabs[0]?.id) {
          console.info('no tab id found. tabs object is: ', tabs);
          return;
        }
        chrome.tabs.sendMessage(tabs[0].id, message, responseFn); 
      });
    }
    console.info('message sent');
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
  // if (changeInfo.status === 'complete' && tab.active) {
  // }
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
  console.info('setIcon: status ', status);
  chrome.browserAction.setIcon({
    path: `icons/icon48${status ? "" : 'enabled'}.png`
  });
}
