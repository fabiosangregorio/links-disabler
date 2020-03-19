'use strict';

let linksDisabled = false;

/**
* Utility function to add CSS in multiple passes.
* @param {string} styleString
*/
function addStyle(styleString) {
  const style = document.createElement('style');
  style.textContent = styleString;
  document.head.append(style);
}

function dataAttr(node, attrKey, dataKey, removeData, attrValue, dataValue) {
  attrValue = attrValue || node.getAttribute(dataKey);
  dataValue = dataValue || node.getAttribute(attrKey);
  node.setAttribute(attrKey, attrValue);
  if (removeData) node.removeAttribute(dataAttr);
  else node.setAttribute(dataKey, dataValue);
}

const disableLinks = () => {
  [...document.getElementsByTagName('a')].forEach(link => {
    dataAttr(link, 'href', 'data-linkdisabler-href', false, 'javascript:;');
    dataAttr(link, 'draggable', 'datalinkdisabler-draggable', false, 'false');
    link.classList.add('linkdisabler-disabled');
  });
}

const enableLinks = () => {
  [...document.getElementsByTagName('a')].forEach(link => {
    dataAttr(link, 'href', 'data-linkdisabler-href', true);
    dataAttr(link, 'draggable', 'datalinkdisabler-draggable', true);
    link.classList.remove('linkdisabler-disabled');
  });
}

addStyle(`
  a.linkdisabler-disabled {
    cursor: auto !important;
    -webkit-user-select: text !important;
    -moz-select: text !important;
    -ms-select: text !important;
    user-select: text !important;
  }
`);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch(request) {
    case "linkstoggle":
      linksDisabled = !linksDisabled;
      linksDisabled ? disableLinks() : enableLinks();
      sendResponse({ linksDisabled });
    break;
    case "getstatus":
      sendResponse({ linksDisabled });
      break;
  }
});
