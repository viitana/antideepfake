
// Background script loaded for every site

const scan = () => {
  // Get all image tag elements
  const elems = document.getElementsByTagName('img'); 
  const imgs = {};

  // Map elems to unique src URIs
  for(const elem of elems) {
    imgs[elem.src] = imgs[elem.src]
      ? imgs[elem.src].concat([elem])
      : [elem];
  }

  // Send query server for each
  const srcs = Object.keys(imgs);
  for(const src of srcs) {
      chrome.storage.sync.get('target_url', data => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
          if (xhr.status === 200 & xhr.readyState === 4) {
            handleResponse(xhr.response, imgs);
          }
        }
        xhr.open('POST', data.target_url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({ image_source: src }));
      });
  }
};

// Handle responses from server
const handleResponse = (responseStr, mapping) => {
  const response = JSON.parse(responseStr);
  if(response.result) {
    console.log('Detected deepfake: ' + response.src);
    addAlert(mapping[response.src]);
  }
}

// Add overlay to given elements
const addAlert = elems => {
  for(const elem of elems) {
    const overlay = document.createElement("div");
    overlay.classList.add("deepfakeoverlay");

    overlay.style.cssText = elem.style.cssText;
    overlay.style.top = elem.offsetTop;
    overlay.style.left = elem.offsetLeft;
    overlay.style.width = `${elem.clientWidth ? elem.clientWidth : elem.naturalWidthpx}px`;
    overlay.style.height = `${elem.clientHeight ? elem.clientHeight : elem.naturalHeight}px`;

    elem.parentNode.insertBefore(overlay, elem);
  }
}

// Run when resources are fully loaded & plugin is enabled
chrome.storage.sync.get('enabled', data => {
  if(data.enabled) window.addEventListener ("load", scan, false);
});
