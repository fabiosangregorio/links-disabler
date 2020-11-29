'use strict';

let localState = false; // true: disabled, false: enabled

addStyle(`
  a.linksdisabler-disabled {
    pointer-events: none !important;
  }
`);

const setLinks = (disable) => {
  [...document.getElementsByTagName('a')].forEach(link => {
    if (disable) {
      link.classList.add('linksdisabler-disabled');
    } else {
      link.classList.remove('linksdisabler-disabled');
    }
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  let currentState = request.global ? request.globalState : localState;

  switch(request.action) {
    case "toggleLinks":
      localState = !currentState;
      setLinks(localState);
      break;
    case "refresh":
      if(currentState != localState) {
        localState = currentState;
        setLinks(localState);
      }
      break;
  }
  console.info('localstate: ', localState);
  sendResponse({ state: localState });
});


/* UTILITY FUNCTIONS */

/**
 * Utility function to switch attribute and data values on an HTML node
 * @param {HTMLnode} node Node on which to switch attributes
 * @param {string} attrKey Attribute name on which to take the value to switch with data
 * @param {string} dataKey Data name on which to take the value to switch with attribute
 * @param {bool} removeData Whether to remove the data attbitute from the node or not
 * @param {string} attrValue Attribute value to switch with data
 * @param {string} dataValue Data value to switch with attribute
 */
function switchDataAttr(node, attrKey, dataKey, removeData, attrValue, dataValue) {
  attrValue = attrValue || node.getAttribute(dataKey);
  dataValue = dataValue || node.getAttribute(attrKey);
  node.setAttribute(attrKey, attrValue);
  if (removeData) node.removeAttribute(switchDataAttr);
  else node.setAttribute(dataKey, dataValue);
}

/**
* Utility function to add CSS in multiple passes.
* @param {string} styleString
*/
function addStyle(styleString) {
  const style = document.createElement('style');
  style.textContent = styleString;
  document.head.append(style);
}
