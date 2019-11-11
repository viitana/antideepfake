const toggle = document.getElementById('toggle');

const color = enabled => enabled ? '#3AA757' : '#FF2200';
const text = enabled => enabled ? 'Enabled' : 'Disabled';

// Sets button appearance based on enabled flag
const refreshButton = enabled => {
  toggle.innerHTML = text(enabled);
  toggle.style.backgroundColor = color(enabled);
}

// Refresh button on load
chrome.storage.sync.get('enabled', data => refreshButton(data.enabled));

// Flip flag & refresh button on click
toggle.onclick = elem => {
  chrome.storage.sync.get('enabled', data => {
    refreshButton(!data.enabled);
    chrome.storage.sync.set({ enabled: !data.enabled });
  });
};
