'use strict';

let linksDisabled = false;

const disableLinks = () => {
  [...document.getElementsByTagName('a')].forEach(link => {
    link.setAttribute('data-linkdisabler-href', link.getAttribute('href'));
    link.setAttribute('href', 'javascript:;');
  });
}

const enableLinks = () => {
  [...document.getElementsByTagName('a')].forEach(link => {
    link.setAttribute('href', link.getAttribute('data-linkdisabler-href'));
    link.removeAttribute('data-linkdisabler-href');
  });
}

const executeScript = () => {
  if (linksDisabled)
    chrome.tabs.executeScript({
      code: '(' + enableLinks + ')();'
    });
  else
    chrome.tabs.executeScript({
      code: '(' + disableLinks + ')();'
    });

  linksDisabled = !linksDisabled;
  chrome.browserAction.setIcon({
    path: `icon48${linksDisabled ? "" : 'enabled'}.png`
  });
}

chrome.commands.onCommand.addListener(() => executeScript());

chrome.browserAction.onClicked.addListener(() => executeScript());

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active)
    chrome.browserAction.setIcon({
      path: `icon48enabled.png`
    });
})