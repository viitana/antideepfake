chrome.runtime.onInstalled.addListener(function() {

  chrome.storage.sync.set({target_url: 'http://localhost/processimg'});

});
