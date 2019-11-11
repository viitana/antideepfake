chrome.runtime.onInstalled.addListener(() => {

  chrome.storage.sync.set({ target_url: 'http://localhost:80/processimg' });
  chrome.storage.sync.set({ enabled: true });

});
