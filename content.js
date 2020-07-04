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
    link.classList.add('linksdisabler-disabled');
  });
}

const enableLinks = () => {
  [...document.getElementsByTagName('a')].forEach(link => {
    link.classList.remove('linksdisabler-disabled');
  });
}

addStyle(`
  a.linksdisabler-disabled {
    pointer-events: none !important;
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
    default:
      sendResponse({ });
  }
});
