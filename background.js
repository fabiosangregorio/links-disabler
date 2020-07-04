'use strict';

const executeScript = () => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, "linkstoggle", function(response) {
      if(!response) return;
      setIcon(response.linksDisabled);
    });  
  });
}

const setIcon = (status) => {
  chrome.browserAction.setIcon({
    path: `icon48${status ? "" : 'enabled'}.png`
  });
}

chrome.commands.onCommand.addListener(() => {
  executeScript();
});

chrome.browserAction.onClicked.addListener(() => {
  executeScript();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    setIcon(false);
  }
});

chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.sendMessage(activeInfo.tabId, "getstatus", function(response) {
    if(!response) return;
    setIcon(response.linksDisabled);
  });  
});
