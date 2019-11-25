chrome.runtime.onInstalled.addListener(() => {

  chrome.storage.sync.set({ target_url: 'http://teekkari.net:8080/processimg' });
  chrome.storage.sync.set({ enabled: true });

});
