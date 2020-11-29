/**
 * Restores select box and checkbox state using the preferences stored in 
 * chrome.storage
 */ 
document.addEventListener('DOMContentLoaded', () => {
  // Default values
  chrome.storage.sync.get({
    global: false,
    disableList: []
  }, (storage) => {
    document.querySelector('#global').checked = storage.global;
    document.querySelector('#disablelist').value = storage.disableList.join("\n");
  });
});

/**
 * Saves options to chrome.storage
 */
document.querySelector('#save').addEventListener('click', () => {
  let global = document.querySelector("#global").checked;
  let disableList = document.querySelector("#disablelist").value.split("\n");

  chrome.storage.sync.set({
    global: global,
    disableList: disableList
  }, () => {
    // Update status to let user know options were saved
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => { status.textContent = '' }, 1000);
  });
});